import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeafultLocService } from '../deafult-loc.service';
import { SeoServiceService } from '../seo-service.service';

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

  constructor(private loc : DeafultLocService,private seo : SeoServiceService,private route : ActivatedRoute) { }

  ngOnInit(): void {

    this.loc.initFeatured_and_Country_and_count();

    let title = 'Find Jobs, Get Career help and Build Resume | Workire'
    let desc = "Find jobs in your area using workire job search engine. Get access to best career advice, free resume builder,  online mock interview practice and top Resume writing services."
    let keywords = "top resume writing services,Job listing,Find jobs, career advice,best online job sites,free resume builder,online mock interview practice"
    let url = this.domain + '/'
    let type = 'page'

    this.seo.updateSeo(title,desc,keywords,type,url);
    this.seo.createCanonicalURL(url);
  }
}
