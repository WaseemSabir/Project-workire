import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router} from '@angular/router';
import { DeafultLocService } from '../api-call.service';
import { isPlatformBrowser } from '@angular/common';
import { SeoServiceService } from '../seo-service.service';

@Component({
  selector: 'app-job-nav',
  templateUrl: './job-nav.component.html',
  styleUrls: ['./style.css']
})
export class JobNavComponent implements OnInit {

  constructor(private router : Router,private loc : DeafultLocService,@Inject(PLATFORM_ID) private platformId: Object,private seo : SeoServiceService) { }

  public nav: any;
  public isHome: boolean = false;
  public ObjectKeys: any = Object.keys;
  public isAuth: boolean = true;

  public blogCat : Set<any[]> = new Set();

  public saved : any[] = [];
  public isMobile: boolean = false;

  ngOnInit(): void {
    this.nav = {
      "Find Jobs" : [['Browse All Jobs','/Jobs'],["Jobs By Position","Jobs/All-Positions"],["Jobs By Location",'Jobs/All-Countries'],["Jobs By Company","Jobs/All-Companies"],["Jobs By Category","Jobs/All-Categories"],["Trending Search","Jobs/Trending-Search"]],
      "Career Advice" : ["career-advice"],
      "Career Tools" : ["/Career-development-tools"],
    }

    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }

    if(this.router.url=="/")
    {
      this.isHome = true;
    }
    else
    {
      this.isHome = false;
    }

    this.blogCat = new Set()

    // this is not for seo, it's actually for when user bookmarks a new job, the nav bar reprocesses saved data
    this.seo.currentMessage.subscribe((res : any)=>{
      if(isPlatformBrowser(this.platformId))
      {
        if(localStorage.getItem('saved'))
        {
          this.saved = localStorage.getItem('saved')!.split('~')
        }
        else
        {
          this.saved = []
        }
      }
    })
  }

  removeJob (k : string)
  {
    let temp = localStorage.getItem('saved')?.split('~')
    temp = temp?.filter((val : string)=>{
      return val !== k;
    })

    if(temp?.length)
    {
      localStorage.setItem('saved',temp!.join('~'));
    }
    else
    {
      localStorage.setItem('saved','')
    }
    this.saved = localStorage.getItem('saved')!.split('~');
    this.saved = this.saved.filter((val)=>{
      return val !== "";
    })
  }

}
