import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeafultLocService } from '../api-call.service';
import { NgxSpinnerService } from "ngx-spinner";
import { SeoServiceService } from '../seo-service.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.css']
})
export class BlogCardComponent implements OnInit {

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
      this.loc.getPost(this.id).subscribe((res : any)=>{
        this.loaded = true;
        this.spinner.hide();
        this.post = res.data[0]
        this.schema = {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": this.domain+this.route.url
          },
          "headline": this.post.title,
          "description": this.post.Description,
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
          "datePublished": this.post.addDate,
          "dateModified": this.post.addDate
        }

        let title = this.post.title + ' | ' + this.post.category +'| Career Advice'
        let desc = this.post.Description
        let keyword = this.post.KeyWord
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

  searchChange()
  {
    this.route.navigate(['/career-advice','search',this.blogSearch.value])
  }

  url(str : string)
  {
    return this.domain + '/'+ str;
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
