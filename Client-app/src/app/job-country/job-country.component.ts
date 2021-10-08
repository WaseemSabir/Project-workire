import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DeafultLocService } from '../api-call.service';
import { SeoServiceService } from '../seo-service.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-job-country',
  templateUrl: './job-country.component.html',
  styleUrls: ['../Common-styles/jobs-by.styles.css']
})
export class JobCountryComponent implements OnInit {

  allCat : any = {};
  domain : string = environment.APIEndpoint;
  loaded : boolean = false
  keys = Object.keys
  isMobile : boolean = false

  constructor(private seo : SeoServiceService,private loc : DeafultLocService,@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }
    this.loc.getCustomCountries().toPromise()
    .then((res : any)=>{
      this.allCat = {};
      for(let k of res)
      {
        this.allCat[k.Country] = k.cities.split(',').filter((val:string)=>{
          return val!='';
        })
      }

      let date = new Date();
      const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

      let title = `Find  latest Jobs by Location (${monthNames[date.getMonth()]}-${date.getFullYear()}) | Workire`
      let desc = "Apply for the best jobs in all location.New careers in all locations  are added daily on Workire.com. Apply quickly to various job openings that are hiring near you."
      let keywords = Object.keys(this.allCat).toString()
      let url = this.domain + '/Jobs/All-Countries'
      let type = 'job'

      this.seo.updateSeo(title,desc,keywords,type,url);
      this.seo.createCanonicalURL(this.domain + '/Jobs/All-Countries');
    })
    .catch()
  }

    rep(str : string)
    {
      return str.replace(/ /g,'-')
    }

    tell(s1: string,s2: string)
    {
      return (s1+'-'+s2)
    }
}
