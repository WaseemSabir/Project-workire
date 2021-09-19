import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { SeoServiceService } from '../seo-service.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-career-develpment-tools',
  templateUrl: './career-develpment-tools.component.html',
  styleUrls: ['./career-develpment-tools.component.css']
})
export class CareerDevelpmentToolsComponent implements OnInit {

  domain : string = environment.APIEndpoint;
  isMobile : boolean = false;

  link1 : string = 'https://www.topresume.com/resume-review/?pt=fhtsVLxOYDCkW';
  link2 : string = 'https://www.topresume.com/resume-writing/?pt=fhtsVLxOYDCkW';
  link3 : string = 'https://myinterviewpractice.com/partner/workire/?bemobdata=c%3D693cf4fc-f0d9-4fbe-9e46-b54ce0fb41a0..l%3D9e7eb28b-ffad-432e-8269-aaba672c4059..a%3D0..b%3D0..e%3D%257Bworkire%257D..r%3Dhttps%253A%252F%252Fworkire.com%252F';
  link4 : string = 'https://www.udemy.com/';

  constructor(private route : Router,@Inject(PLATFORM_ID) private platformId: Object,private seo : SeoServiceService) { }

  ngOnInit(): void {

    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }

    let title = 'Level up your career today | Workire'
    let desc = "You've come to the correct place if you're eager to take your tech career to the next level. Workire's Career Development tools will assist you in getting on the exact route, no matter where you want to go."
    let keywords = "Resume writing service, Free Resume review, Online mock interview practice, Online courses"
    let type = 'article'
    let url = this.domain+this.route.url
    
    this.seo.updateSeo(title,desc,keywords,type,url);
    this.seo.createCanonicalURL(this.domain + this.route.url);
  }

}
