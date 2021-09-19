import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { SeoServiceService } from '../seo-service.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  isMobile : boolean = false
  domain : string = environment.APIEndpoint;
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route : Router,private seo : SeoServiceService) { }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }

    let title = 'Contact Us | Workire'
    let desc = "Drop Us an email at info@workire.com and we'll get back to as soon as possible, Or reach out through social media platforms."
    let keywords = "Contact Us, Workire,what is Workire,workire jobs"
    let type = 'article'
    let url = this.domain + this.route.url;
    let image = this.domain+ "/assets/workire.jpg"

    this.seo.updateSeoWithImage(title,desc,keywords,image,type,url);
    this.seo.createCanonicalURL(this.domain + this.route.url);
  }

}
