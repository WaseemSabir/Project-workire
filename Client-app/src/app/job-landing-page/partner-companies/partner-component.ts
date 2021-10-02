import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DeafultLocService } from '../../deafult-loc.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-landingpage-partner',
    templateUrl: './partner.html',
    styleUrls: ['./partner.css']
  })
export class LandingPagePartner implements OnInit {

  companies : any = [];
  isMobile : boolean = false;

  domain : string = environment.APIEndpoint + "/mediaimage/"
  
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

  urlParse = (str : string,comp : string) =>{
    if(str =="/mediaimage/default.jpg")
    {
      return this.domain + "/mediaimage/" + (comp[0].toUpperCase() + ".png")
    }
    else if(str.includes("http"))
    {
      str = str.replace("/mediaimage/",'')
      str = str.replace("%3A",':')
      return str;
    }
    else if(str[0] == '/')
    {
      return this.domain + str;
    }
    else
    {
      return this.domain + '/' + str;
    }
  }
}