import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeafultLocService } from '../api-call.service';
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
    "@type": "Corporation",
    "name": "Workire",
    "alternateName": "Workire.com",
    "url": "https://workire.com/",
    "logo": "https://workire.com/assets/Workire-jobs-uk-uae-qatar-dubai-london.svg",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+971501739398",
      "contactType": "technical support",
      "areaServed": ["GB","AE","QA","BH","KW","OM","SA","JO","IQ"],
      "availableLanguage": ["en","Arabic"]
    },
    "sameAs": [
      "https://www.facebook.com/workire",
      "https://www.linkedin.com/company/workire/",
      "https://www.instagram.com/workire.co/"
    ]
  }

  web : any = {
    "@context": "https://schema.org/",
    "@type": "WebSite",
    "name": "Workire",
    "url": "https://workire.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://workire.com/Jobs/search:{search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  constructor(private loc : DeafultLocService,private seo : SeoServiceService,private route : ActivatedRoute) { }

  ngOnInit(): void {

    this.loc.initFeatured_and_Country_and_count();

    let title = 'Jobs in UK, UAE, London, Dubai, Qatar | Workire'
    let desc = `Workire is a free job site that posts job vacancies in the UK, UAE, Qatar, Dubai, and London in fields such as engineering, oil and gas, teaching, software, banking, marketing,IT, Driver, Real Estate and Accounting as well as provides access to career advice and best career development tools.`
    let keywords = "top resume writing services,Job listing,Find jobs, career advice,best online job sites,free resume builder,online mock interview practice"
    let url = this.domain + '/'
    let type = 'page'

    this.seo.updateSeo(title,desc,keywords,type,url);
    this.seo.createCanonicalURL(url);
  }
}
