import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Route, Router } from '@angular/router';
import { MetaServiceService } from '../meta-service.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  isMobile : boolean = false
  domain : string = "https://workire.com"
  constructor(private title : Title,private meta : Meta,@Inject(PLATFORM_ID) private platformId: Object,private link : MetaServiceService,private route : Router) { }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }
    this.title.setTitle('Contact Us | Workire');
    this.meta.updateTag({name: "description",content:"Drop Us an email at info@workire.com and we'll get back to as soon as possible, Or reach out through social media platforms."},"name='description'"),
    this.meta.updateTag({name: 'keywords', content: "Contact Us, Workire,what is Workire,workire jobs"},"name='keywords'")
    this.meta.updateTag({property: 'og:type',content:'article'},"property='og:type'")
    this.meta.updateTag({property: 'og:title',content:"Contact Us | Workire"},"property='og:title'")
    this.meta.updateTag({property: 'og:description',content:"Drop Us an email at info@workire.com and we'll get back to as soon as possible, Or reach out through social media platforms."},"property='og:description'")
    this.meta.updateTag({property: 'og:image',content:this.domain+ "/assets/workire.jpg"},"property='og:image'")
    this.meta.updateTag({property: 'og:url',content:this.domain+'/about'},"property='og:url'")
    this.meta.updateTag({name: 'og:site_name',content: 'Workire'},"name='og:site_name'")
    this.meta.updateTag({name: 'twitter:title',content: 'Contact Us | Workire'},"name='twitter:title'")
    this.meta.updateTag({name: 'twitter:description',content:"Drop Us an email at info@workire.com and we'll get back to as soon as possible, Or reach out through social media platforms."},"name='twitter:description'")
    this.meta.updateTag({name: 'twitter:image',content: this.domain + "/assets/workire.jpg"},"name='twitter:image'")
    this.meta.updateTag({name: 'twitter:site',content: '@Workire'},"name='twitter:site'")
    this.meta.updateTag({name: 'twitter:creator',content: '@WaseemSabir01'},"name='twitter:creator'")
    this.link.createCanonicalURL(this.domain + this.route.url);
  }

}
