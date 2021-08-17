import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeafultLocService } from '../deafult-loc.service';
import { Title, Meta } from '@angular/platform-browser';
import { MetaServiceService } from '../meta-service.service';
import { isPlatformBrowser } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.css']
})
export class BlogCardComponent implements OnInit {

  id : string = ''
  post : any;
  additional : any;
  loaded : boolean = false;

  domain : string = "https://workire.com"
  blogSearch : FormControl = new FormControl();
  blogCat : Set<string> = new Set();
  isMobile : boolean = false;

  schema : any = {};

  constructor(private loc: DeafultLocService,private activatedRoute: ActivatedRoute,private route: Router,private title : Title,private meta : Meta,private link : MetaServiceService,@Inject(PLATFORM_ID) private platformId: Object,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params =>{
      this.id = params.get('url')!
      if(this.id=='')
      {
        this.route.navigate(['/invalidRequest'])
      }
      if(isPlatformBrowser(this.platformId))
      {
        this.isMobile = screen.width < 768;
      }
      this.loaded = false;
      this.loc.getPost(this.id).subscribe((res : any)=>{
        this.loaded = true;
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

        this.title.setTitle(this.post.title + ' | ' + this.post.category +'| Career Advice');
        this.meta.updateTag({name: "description",content:this.post.Description})
        this.meta.updateTag({name: 'keywords', content: this.post.KeyWord})
        this.meta.updateTag({property: 'og:type',content:'article'})
        this.meta.updateTag({property: 'og:title',content:this.post.title})
        this.meta.updateTag({property: 'og:description',content:this.post.Description})
        this.meta.updateTag({property: 'og:image',content:this.domain + this.post.image})
        this.meta.updateTag({property: 'og:url',content:this.domain+this.route.url})
        this.meta.updateTag({name: 'og:site_name',content: 'Workire'})
        this.meta.updateTag({name: 'twitter:title',content: this.post.title})
        this.meta.updateTag({name: 'twitter:description',content: this.post.Description})
        this.meta.updateTag({name: 'twitter:image',content: this.domain + this.post.image})
        this.meta.updateTag({name: 'twitter:site',content: '@Workire'})
        this.meta.updateTag({name: 'twitter:creator',content: '@WaseemSabir01'})

        this.link.createCanonicalURL(this.domain+this.route.url);

        this.post.image = this.domain + this.post.image
        this.additional = res.related.filter((item : any)=>{
          return (this.post.id !== item.id)
        })
      })
    })

    this.loc.getAllPosts().subscribe((res:any)=>{
      for(let k of res.data)
      {
        this.blogCat.add(k.category);
      }
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

  cap(str : string)
  {
    let temp='';
    for(let k of str.split(' '))
    {
      temp += k[0].toUpperCase() + k.slice(1,k.length) + ' '
    }
    return temp;
  }

}
