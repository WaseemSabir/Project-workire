import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-job-disclaimer',
  templateUrl: './job-disclaimer.component.html',
  styleUrls: ['./job-disclaimer.component.css']
})
export class JobDisclaimerComponent implements OnInit {

  constructor(private meta : Meta,private title : Title,@Inject(PLATFORM_ID) private platformId: Object) { }

  domain : string = 'https://workire.com'
  isMobile : boolean = false

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }
    this.title.setTitle('Disclaimer | Workire');
    this.meta.updateTag({name: "description",content:"By using our website, you hereby consent to our disclaimer and agree to its terms."})
    this.meta.updateTag({name: 'keywords', content: ""})
    this.meta.updateTag({name: 'robots', content: 'index, follow'})
    this.meta.updateTag({property: 'og:type',content:'job'})
    this.meta.updateTag({property: 'og:title',content: 'Disclaimer | Workire'})
    this.meta.updateTag({property: 'og:description',content:"By using our website, you hereby consent to our disclaimer and agree to its terms."})
    this.meta.updateTag({property: 'og:url',content:this.domain + '/disclaimer'})
    this.meta.updateTag({name: 'og:site_name',content: 'Workire'})
    this.meta.updateTag({name: 'twitter:title',content: 'Disclaimer | Workire'})
    this.meta.updateTag({name: 'twitter:description',content: "By using our website, you hereby consent to our disclaimer and agree to its terms."})
    this.meta.updateTag({name: 'twitter:site',content: '@Workire'})
    this.meta.updateTag({name: 'twitter:creator',content: '@WaseemSabir01'})
  }

}
