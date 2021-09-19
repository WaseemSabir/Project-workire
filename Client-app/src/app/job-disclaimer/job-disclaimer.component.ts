import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { SeoServiceService } from '../seo-service.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-job-disclaimer',
  templateUrl: './job-disclaimer.component.html',
  styleUrls: ['./job-disclaimer.component.css']
})
export class JobDisclaimerComponent implements OnInit {

  constructor(private seo : SeoServiceService,@Inject(PLATFORM_ID) private platformId: Object) { }

  domain : string = environment.APIEndpoint;
  isMobile : boolean = false

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }

    let title = 'Disclaimer | Workire'
    let desc = "By using our website, you hereby consent to our disclaimer and agree to its terms."
    let keywords = "disclaimer,privacy policy"
    let url = this.domain + '/disclaimer'
    let type = 'job'

    this.seo.updateSeo(title,desc,keywords,type,url);
    this.seo.createCanonicalURL(this.domain + '/disclaimer');
  }
}
