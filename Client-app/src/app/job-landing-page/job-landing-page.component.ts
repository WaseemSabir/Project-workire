import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { DeafultLocService } from '../api-call.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-landing-page',
  templateUrl: './job-landing-page.component.html',
  styleUrls: ['./job-landing-page.component.css']
})
export class JobLandingPageComponent implements OnInit {

  constructor(private router : Router,private loc: DeafultLocService,@Inject(PLATFORM_ID) private platformId: Object) { }

  domain : string = environment.APIEndpoint + "/mediaimage/"

  domain2 : string = environment.APIEndpoint

  search : any[] = []

  blogPost : any = [];

  isMobile : boolean = false

  ngOnInit() {
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }

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

}