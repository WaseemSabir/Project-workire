import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MetaServiceService } from '../meta-service.service';

@Component({
  selector: 'app-career-develpment-tools',
  templateUrl: './career-develpment-tools.component.html',
  styleUrls: ['./career-develpment-tools.component.css']
})
export class CareerDevelpmentToolsComponent implements OnInit {

  domain : string = 'https://workire.com'
  isMobile : boolean = false;

  link1 : string = 'https://www.topresume.com/resume-review/?pt=fhtsVLxOYDCkW';
  link2 : string = 'https://www.topresume.com/resume-writing/?pt=fhtsVLxOYDCkW';
  link3 : string = 'https://myinterviewpractice.com/partner/workire/?bemobdata=c%3D693cf4fc-f0d9-4fbe-9e46-b54ce0fb41a0..l%3D9e7eb28b-ffad-432e-8269-aaba672c4059..a%3D0..b%3D0..e%3D%257Bworkire%257D..r%3Dhttps%253A%252F%252Fworkire.com%252F';
  link4 : string = 'https://www.udemy.com/';

  constructor(private meta : Meta, private title : Title,private route : Router, private link : MetaServiceService,@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {

    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }
    
    this.title.setTitle('Level up your career today | Workire');
    this.meta.updateTag({name: "description",content:"You've come to the correct place if you're eager to take your tech career to the next level. Workire's Career Development tools will assist you in getting on the exact route, no matter where you want to go."},"name='description'"),
    this.meta.updateTag({name: 'keywords', content: "Resume writing service, Free Resume review, Online mock interview practice, Online courses"},"name='keywords'")
    this.meta.updateTag({property: 'og:type',content:'article'},"property='og:type'")
    this.meta.updateTag({property: 'og:title',content:"Level up your career today | Workire"},"property='og:title'")
    this.meta.updateTag({property: 'og:description',content:"You've come to the correct place if you're eager to take your tech career to the next level. Workire's Career Development tools will assist you in getting on the exact route, no matter where you want to go."},"property='og:description'")
    this.meta.updateTag({property: 'og:image',content:this.domain+ "/assets/workire.jpg"},"property='og:image'")
    this.meta.updateTag({property: 'og:url',content:this.domain+'/Career-development-tools'},"property='og:url'")
    this.meta.updateTag({name: 'og:site_name',content: 'Workire'},"name='og:site_name'")
    this.meta.updateTag({name: 'twitter:title',content: 'Level up your career today | Workire'},"name='twitter:title'")
    this.meta.updateTag({name: 'twitter:description',content:"You've come to the correct place if you're eager to take your tech career to the next level. Workire's Career Development tools will assist you in getting on the exact route, no matter where you want to go."},"name='twitter:description'")
    this.meta.updateTag({name: 'twitter:image',content: this.domain + "/assets/workire.jpg"},"name='twitter:image'")
    this.meta.updateTag({name: 'twitter:site',content: '@Workire'},"name='twitter:site'")
    this.meta.updateTag({name: 'twitter:creator',content: '@WaseemSabir01'},"name='twitter:creator'")
    this.link.createCanonicalURL(this.domain + this.route.url);
  }

}
