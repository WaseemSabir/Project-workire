import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DeafultLocService } from '../deafult-loc.service';

@Component({
  selector: 'app-job-country',
  templateUrl: './job-country.component.html',
  styleUrls: ['./job-country.component.css']
})
export class JobCountryComponent implements OnInit {

  allCat : any = {};
  domain : string = "https://workire.com"
  loaded : boolean = false
  keys = Object.keys
  isMobile : boolean = false
  target_feature : any[] = []

  constructor(private meta : Meta,private title : Title,private loc : DeafultLocService,@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }
    this.allCat = this.loc.getCustomCountries();
    this.title.setTitle('Find  latest Jobs by Location | Workire');
    this.meta.updateTag({name: "description",content:"Apply for the best jobs in all location.New careers in all locations  are added daily on Workire.com. Apply quickly to various job openings that are hiring near you."})
    this.meta.updateTag({name: 'keywords', content: Object.keys(this.allCat).toString()})
    this.meta.updateTag({name: 'robots', content: 'index, follow'})
    this.meta.updateTag({property: 'og:type',content:'job'})
    this.meta.updateTag({property: 'og:title',content: 'Find  latest Jobs by Location | Workire'})
    this.meta.updateTag({property: 'og:description',content:"Apply for the best jobs in all location.New careers in all locations  are added daily on Workire.com. Apply quickly to various job openings that are hiring near you."})
    this.meta.updateTag({property: 'og:url',content:this.domain + '/Jobs/All-Countries'})
    this.meta.updateTag({name: 'og:site_name',content: 'Workire'})
    this.meta.updateTag({name: 'twitter:title',content: 'Find  latest Jobs by Location | Workire'})
    this.meta.updateTag({name: 'twitter:description',content: "Apply for the best jobs in all location.New careers in all locations  are added daily on Workire.com. Apply quickly to various job openings that are hiring near you."})
    this.meta.updateTag({name: 'twitter:site',content: '@Workire'})
    this.meta.updateTag({name: 'twitter:creator',content: '@WaseemSabir01'})

    let tempo = '';

    if(localStorage.getItem('search'))
    {
      tempo = localStorage.getItem('search')!;
    }

    this.loc.featured('').subscribe((res : any)=>{
      this.target_feature = res.job;
    })

  }

    rep(str : string)
    {
      return str.replace(/ /g,'-')
    }

    tell(s1: string,s2: string)
    {
      return (s1+'-'+s2)
    }
}
