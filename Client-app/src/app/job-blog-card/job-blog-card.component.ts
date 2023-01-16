import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeafultLocService } from '../api-call.service';
import { NgxSpinnerService } from "ngx-spinner";
import { SeoServiceService } from '../seo-service.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-job-blog-card',
  templateUrl: './job-blog-card.component.html',
  styleUrls: ['./job-blog-card.component.css']
})
export class JobBlogCardComponent implements OnInit {

  id : string = ''
  post : any;
  additional : any[] = [];
  loaded : boolean = false;

  domain : string = environment.APIEndpoint
  blogSearch : UntypedFormControl = new UntypedFormControl();

  schema : any = {};

  constructor(private loc: DeafultLocService,private activatedRoute: ActivatedRoute,private route: Router,private spinner: NgxSpinnerService,private seo : SeoServiceService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params =>{
      this.id = params.get('url')!
      if(!this.id)
      {
        this.route.navigate(['/blog-does-not-exist'])
      }
      this.loaded = false;
      this.spinner.show()
      this.loc.getJobBlogPost(this.id).subscribe((res : any)=>{
        console.log(res)
        this.loaded = true;
        this.spinner.hide();
        this.post = res.data
        this.schema = {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": this.domain+this.route.url
          },
          "headline": this.post.title,
          "description": this.post.description,
          "image": this.post.image,  
          "author": {
            "@type": "Organization",
            "name": "Workire"
          },  
          "publisher": {
            "@type": "Organization",
            "name": "Workire",
            "logo": {
              "@type": "ImageObject",
              "url": this.domain + "/assets/logo.png"
            }
          },
          "datePublished": this.post.created_at,
          "dateModified": this.post.updated_at
        }

        let title = this.post.seo_title
        let desc = this.post.seo_description
        let keyword = this.post.seo_keywords
        let type = 'article'
        let image = this.domain + this.post.image
        let url = this.domain+this.route.url

        this.seo.updateSeoWithImage(title,desc,keyword,image,type,url)
        this.seo.createCanonicalURL(this.domain+this.route.url);

        this.post.image = image;
        this.additional = res.related.filter((item : any)=>{
          return (this.post.id !== item.id)
        })
      })
    })
  }

  urlParse(str : string){
    return this.domain + str;
  }

  getDate(str : string)
  {
    let d = new Date(str);
    let longMonth = d.toLocaleString('en-us', { month: 'long' });
    let s = `${longMonth} ${str.split('-')[2]}, ${str.split('-')[0]}`
    return s
  }
}
