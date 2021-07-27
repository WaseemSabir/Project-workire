import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MetaServiceService } from '../meta-service.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {


  isMobile : boolean = false;
  domain : string = "https://workire.com"
  constructor(private title : Title,private meta : Meta,@Inject(PLATFORM_ID) private platformId: Object,private link : MetaServiceService,private route : Router) { }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 786;
    }
    this.title.setTitle('About Us | Workire');
    this.meta.updateTag({name: "description",content:"Workire is the leading job site in the Gulf Region, connecting job seekers with potential employers. Every day, many new job vacancies are listed on the platform."},"name='description'"),
    this.meta.updateTag({name: 'keywords', content: "About Us, Workire,what is Workire,workire jobs"},"name='keywords'")
    this.meta.updateTag({property: 'og:type',content:'article'},"property='og:type'")
    this.meta.updateTag({property: 'og:title',content:"About Us | Workire"},"property='og:title'")
    this.meta.updateTag({property: 'og:description',content:"Workire is the leading job site in the Gulf Region, connecting job seekers with potential employers. Every day, many new job vacancies are listed on the platform."},"property='og:description'")
    this.meta.updateTag({property: 'og:image',content:this.domain+ "/assets/workire.jpg"},"property='og:image'")
    this.meta.updateTag({property: 'og:url',content:this.domain+'/about'},"property='og:url'")
    this.meta.updateTag({name: 'og:site_name',content: 'Workire'},"name='og:site_name'")
    this.meta.updateTag({name: 'twitter:title',content: 'About Us | Workire'},"name='twitter:title'")
    this.meta.updateTag({name: 'twitter:description',content:"Workire is the leading job site in the Gulf Region, connecting job seekers with potential employers. Every day, many new job vacancies are listed on the platform."},"name='twitter:description'")
    this.meta.updateTag({name: 'twitter:image',content: this.domain + "/assets/workire.jpg"},"name='twitter:image'")
    this.meta.updateTag({name: 'twitter:site',content: '@Workire'},"name='twitter:site'")
    this.meta.updateTag({name: 'twitter:creator',content: '@WaseemSabir01'},"name='twitter:creator'")
    this.link.createCanonicalURL(this.domain + this.route.url);
  }

}
