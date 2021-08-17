import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DeafultLocService } from '../deafult-loc.service';

@Component({
  selector: 'app-job-company',
  templateUrl: './job-company.component.html',
  styleUrls: ['./job-company.component.css']
})
export class JobCompanyComponent implements OnInit {

  domain : string = "https://workire.com"
  allCat : any[] = []
  loaded : boolean = false
  keys = Object.keys
  check : any[] = []
  isMobile : boolean = false
  target_feature : any[] = []
  
  constructor(private title : Title,private meta : Meta,private loc : DeafultLocService,@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    this.loaded = false
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }

    this.loc.getAllCompany().subscribe((res : any)=>{
      this.allCat = res;
      this.title.setTitle('Find  latest Jobs by Company | Workire');
      this.meta.updateTag({name: "description",content:"Apply for the best jobs in all company.New careers in all companies are added daily on Workire.com. Apply quickly to various job openings that are hiring near you."})
      this.meta.updateTag({name: 'keywords', content: Object.keys(this.allCat).toString()})
      this.meta.updateTag({name: 'robots', content: 'index, follow'})
      this.meta.updateTag({property: 'og:type',content:'job'})
      this.meta.updateTag({property: 'og:title',content: 'Find  latest Jobs by Company | Workire'})
      this.meta.updateTag({property: 'og:description',content:"Apply for the best jobs in all location.New careers in all Company  are added daily on Workire.com. Apply quickly to various job openings that are hiring near you."})
      this.meta.updateTag({property: 'og:url',content:this.domain + '/Jobs/All-Companies'})
      this.meta.updateTag({name: 'og:site_name',content: 'Workire'})
      this.meta.updateTag({name: 'twitter:title',content: 'Find  latest Jobs by Company | Workire'})
      this.meta.updateTag({name: 'twitter:description',content: "Apply for the best jobs in all location.New careers in all Companies are added daily on Workire.com. Apply quickly to various job openings that are hiring near you."})
      this.meta.updateTag({name: 'twitter:site',content: '@Workire'})
      this.meta.updateTag({name: 'twitter:creator',content: '@WaseemSabir01'})
    })

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

}
