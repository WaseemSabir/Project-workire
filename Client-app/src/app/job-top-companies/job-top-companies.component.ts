import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DeafultLocService } from '../deafult-loc.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-job-top-companies',
  templateUrl: './job-top-companies.component.html',
  styleUrls: ['./job-top-companies.component.css']
})
export class JobTopCompaniesComponent implements OnInit {

  constructor(private router : Router,private loc: DeafultLocService,@Inject(PLATFORM_ID) private platformId: Object) { }

  cards : any = [];

  domain : string = "https://workire.com/mediaimage/"

  domain2 : string = "https://workire.com/"

  search : any[] = []

  blogPost : any = [];

  isMobile : boolean = false

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

  ngOnInit() {
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 786;
    }

    this.loc.getAllCompanies().subscribe((res: any)=>{
      let count = 0
      let t;
      if(this.isMobile)
      {
        t = 9;
      }
      else
      {
        t = 10;
      }
      this.cards = []

      for(let k of Object.keys(res.data))
      {
        if(count < t && res.data[k][1]!="default.jpg")
        {
          this.cards.push([k,res.data[k][1]])
          count+=1
        }
      }

    });

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

    this.loc.getAllSeoCat().subscribe((res : any)=>{
      this.search = res.category
      this.search = this.search.filter((val)=>{
        return (val.SEO_NAME);
      })
    })
  }

  imageClicked (i : Number) {
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

  rep(str : any)
  {
    return str.replace(/ /g,'-')
  }

}
