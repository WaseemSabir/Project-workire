import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { SeoServiceService } from '../seo-service.service';
import { environment } from '../../environments/environment';
import { DeafultLocService } from '../api-call.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  
  isMobile : boolean = false;

  domain : string = environment.APIEndpoint + "/mediaimage/"

  domain2 : string = environment.APIEndpoint + "/"

  search : any[] = []

  blogPost : any = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private seo : SeoServiceService,private route : Router,private loc: DeafultLocService) { }

  ngOnInit(): void {

    this.loc.getAllPosts().subscribe((res : any)=>{
      this.blogPost = []
      if(res.data.length<3)
      {
        this.blogPost.push(res.data[0]);
        this.blogPost.push(res.data[0]);
        this.blogPost.push(res.data[0]);
      }
      else
      {
        this.blogPost = res.data.slice(0,3);
      }
    })

    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 786;
    }
    let title = 'About Us | Workire'
    let desc = "Workire is the leading job site in the Gulf Region, connecting job seekers with potential employers. Every day, many new job vacancies are listed on the platform."
    let keywords = "About Us, Workire,what is Workire,workire jobs"
    let type = 'article'
    let url =  this.domain+this.route.url
    let image = this.domain+ "/assets/workire.jpg"
    
    this.seo.updateSeoWithImage(title,desc,keywords,image,type,url);
    this.seo.createCanonicalURL(this.domain2 + this.route.url);
  }

  urlParseBlog(str : string){
    return this.domain2 + str;
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

  urlParse = (str : string,comp : string) =>{
    if(str =="default.jpg")
    {
      return this.domain + (comp[0].toUpperCase() + ".png")
    }
    if(str.includes('http'))
    {
      return str;
    }
    return this.domain + str;
  }

}