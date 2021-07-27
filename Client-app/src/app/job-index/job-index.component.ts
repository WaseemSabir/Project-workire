import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DeafultLocService } from '../deafult-loc.service';
import { MetaServiceService } from '../meta-service.service';

@Component({
  selector: 'app-job-index',
  templateUrl: './job-index.component.html',
  styles: [
  ]
})
export class JobIndexComponent implements OnInit {

  jobTitle : string = ''
  domain : string = 'https://workire.com'
  schema : any = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Workire",
    "alternateName": "Workire.com",
    "url": "https://workire.com/",
    "logo": "https://workire.com/assets/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "inof@workire.com",
      "contactType": "customer service"
    },
    "sameAs": [
      "https://www.facebook.com/workire",
      "https://twitter.com/workire1",
      "https://www.instagram.com/workire.co"
    ]
  }
  web : any = {
    "@context": "https://schema.org/",
    "@type": "WebSite",
    "name": "Workire",
    "url": "https://workire.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://workire.com/search/{search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  constructor(private loc : DeafultLocService,private meta : Meta,private title : Title,private route : ActivatedRoute,private link : MetaServiceService) { }

  ngOnInit(): void {
    this.title.setTitle('Find Jobs, Get Career help and Build Resume | Workire');
    this.meta.updateTag({name: "description",content:"Find jobs in your area using workire job search engine. Get access to best career advice, free resume builder,  online mock interview practice and top Resume writing services."})
    this.meta.updateTag({name: 'keywords', content: "top resume writing services,Job listing,Find jobs, career advice,best online job sites,free resume builder,online mock interview practice"})
    this.meta.updateTag({property: 'og:type',content:'job'})
    this.meta.updateTag({property: 'og:title',content: 'Find Jobs, Get Career help and Build Resume | Workire'})
    this.meta.updateTag({property: 'og:description',content:"Find jobs in your area using workire job search engine. Get access to best career advice, free resume builder,  online mock interview practice and top Resume writing services."})
    this.meta.updateTag({property: 'og:url',content:this.domain})
    this.meta.updateTag({name: 'og:site_name',content: 'Workire'})
    this.meta.updateTag({name: 'twitter:title',content: 'Find Jobs, Get Career help and Build Resume | Workire'})
    this.meta.updateTag({name: 'twitter:description',content: "Find jobs in your area using workire job search engine. Get access to best career advice, free resume builder,  online mock interview practice and top Resume writing services."})
    this.meta.updateTag({name: 'twitter:site',content: '@Workire'})
    this.meta.updateTag({name: 'twitter:creator',content: '@WaseemSabir01'})
    this.link.createCanonicalURL(this.domain);
  }

}
