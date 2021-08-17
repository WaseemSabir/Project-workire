import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, Location } from "@angular/common";
import { Router } from "@angular/router";
import { DeafultLocService } from '../deafult-loc.service';

@Component({
  selector: 'app-job-footer',
  templateUrl: './job-footer.component.html',
  styles: []
})
export class JobFooterComponent implements OnInit {

  public route: string[] = [];
  public cat : any = {}
  public links : any = {}

  public blogCat : any = []

  public isRoot: boolean = true;
  public isBlog: boolean = this.route.includes("blog");
  isMobile : boolean = false;

  constructor(location: Location,router: Router,private loc : DeafultLocService,@Inject(PLATFORM_ID) private platformId: Object) {
    router.events.subscribe(val => {
      if(isPlatformBrowser(this.platformId))
      {
        this.isMobile = screen.width < 768;
      }
      this.route = location.path().split('/');
      this.links = []
      let temp = true;
      let blog = false;
      let hello = true

      let check = true;
      for(let i=0;i<this.route.length;i++)
      {
        if(this.route[i]=='')
        {
          this.links.push(['Workire >','/'])
        }
        if(this.route.length==2 && check)
        {
          check = false;
          this.links.push([this.route[1],'/'+this.route[1]])
        }
        if(this.route.includes('career-advice'))
        {
          if(!blog)
          {
            let k = decodeURIComponent(location.path())
            let j = k.split('/')
            if(j.length==3)
            {
              this.links.push(['Career Advice > ' + j[2].replace(/-/g,' '),k])
            }
            else if(j.length==4 && !router.url.split('/').includes('search'))
            {
              this.links.push(['Career Advice > ' + j[3],k])
            }
            blog = (!blog)
          }
        }
        if(router.url.includes('advice') && router.url.split('/').length<4 && !blog)
        {
          console.log(router.url.split('/'))
          this.links.push(['advice > '+router.url.split('/')[2],router.url])
          blog = true;
        }
        if(router.url.includes('Job-category') || router.url.includes('Job-country') || router.url.includes('Job-company'))
        {
          if(!blog)
          {
            let k = decodeURIComponent(location.path())
            let j = k.split('/')
            this.links.push([j[1] + ' > ',k])
            this.links.push([j[2].replace(/-/g,' '),k])
          }
          blog = true
        }
        if(this.route.includes('career-advice') && this.route.includes('search'))
        {
          if(hello)
          {
            this.links.push([' Career Advice > Search > ' + router.url.split('/')[3],router.url])
            hello = false;
          }
        }
        if(this.route.includes('Jobs') && temp && router.url.split('/').length>=4)
        {
          let k = decodeURIComponent(location.path())
          let j = k.split('/')
          let j2 = router.url.split('/')
          if(j[4]!=='country')
          {
            this.links.push([j[1]+ ' > ' + j[4],k])
          }
          else if(j[3]!=='search')
          {
            this.links.push([j[1]+ ' > ' + j[3],k])
          }
          else if(j[5]!=='category')
          {
            this.links.push([j[1]+ ' > ' + j[5],k])
          }
          else if(j[6]!=='company')
          {
            this.links.push([j[1]+ ' > ' + j[6],k])
          }
          else
          {
            this.links.push([j[1],k])
          }
          temp = false;
        }
        if(this.route.includes('All-Companies') || this.route.includes('All-Countries') || this.route.includes('All-Categories') && temp)
        {
          let k = decodeURIComponent(location.path())
          let j = k.split('/')
          this.links.push([j[1]+ ' > ' + j[2],router.url])
          temp = false;
        }
        if(this.route.includes('Job') && temp)
        {
          let k = decodeURIComponent(location.path())
          let j = k.split('/')
          let j2 = router.url.split('/')
          this.links.push([j[1]+ ' > ' + j[2],'Job'+'/'+j2[2]])
          temp = false;
        }
      }
      this.isRoot = (this.route.length==1) ? true : false;
      if(this.isRoot)
      {
        this.cat = {
          'Iraq' : [],
          'Bahrain' : ['Manama','Busaiteen','Muharraq'],
          'Kuwait' : ['Ahmadi','Kuwait City','Al Asimah'],
          'Oman' : ['Muscat','Sohar','Salalah'],
          'Qatar' : ['Al Khor','Al Wakrah','Doha','Umm Salal'],
          'Suadi Arabia' : ['Jeddah','Al Khobar','Yanbu','Al Jubail','Dhahran','Riyadh'],
          'United Arab Emirates' : ['Abu Dhabi','Dubai','Ajman','Sharjah','Ras al-Khaimah','Fujairah'],
          'Jordan' : ['Amman']
        }
      }
    })
  }

  ngOnInit(): void {
    let nh = new Set()
      this.loc.getAllPosts().subscribe((res : any)=>{
        for(let k of res.data)
        {
          nh.add(k.category);
        }
        let temp2 = []
        for(let k of nh)
        {
          temp2.push([k,'career-advice/'+k]);
        }
        temp2.unshift(["All Career Advice",'career-advice/All'])
        this.blogCat = temp2;
      })
  }

}
