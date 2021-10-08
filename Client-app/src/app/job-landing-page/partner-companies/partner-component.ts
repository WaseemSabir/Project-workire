import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DeafultLocService } from '../../api-call.service';
import { environment } from '../../../environments/environment';
import { urlParseCommon } from 'src/app/Interfece';

@Component({
    selector: 'app-landingpage-partner',
    templateUrl: './partner.html',
    styleUrls: ['./partner.css']
  })
export class LandingPagePartner implements OnInit {

  companies : any = [];
  isMobile : boolean = false;

  domain : string = environment.APIEndpoint
  domain2 : string = environment.APIEndpoint + '/'
  
  constructor (private loc : DeafultLocService,@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {

    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }

    this.loc.getFeaturedCompanies().toPromise()
    .then((res: any)=>{
      this.companies = res.data;
    })
    .catch()
  }

  urlParse(str : string,comp : string) {
    return urlParseCommon(str,comp);
  }
}