import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DeafultLocService } from '../api-call.service';
import { SeoServiceService } from '../seo-service.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-job-company',
  templateUrl: './job-company.component.html',
  styleUrls: ['../Common-styles/jobs-by.styles.css']
})
export class JobCompanyComponent implements OnInit {

  domain : string = environment.APIEndpoint;
  allCat : any[] = [] // refer to all companies object
  loaded : boolean = false
  keys = Object.keys
  check : any[] = []
  isMobile : boolean = false
  moreInt : number = 0

  str : string = "Load more"
  
  constructor(private seo : SeoServiceService,private loc : DeafultLocService,@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    this.loaded = false
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }

    this.loc.getAllCompany().toPromise()
    .then((res : any)=>{
      this.allCat = res.data;

      let date = new Date();
      const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

      let title = `Find  latest Jobs by Company (${monthNames[date.getMonth()]}-${date.getFullYear()}) | Workire`
      let desc = "Apply for the best jobs in all company.New careers in all companies are added daily on Workire.com. Apply quickly to various job openings that are hiring near you."
      let keywords = ""
      for (let i = 0; i < 80; i++) {
        keywords += this.allCat[i].AdvertiserName + ','
      }
      let url = this.domain + '/Jobs/All-Companies'
      let type = 'job'

      this.seo.updateSeo(title,desc,keywords,type,url);
      this.seo.createCanonicalURL(this.domain + '/Jobs/All-Companies');
    })
    .catch()
  }

  rep(str : string)
  {
    return str.replace(/ /g,'-')
  }

  more() {
    this.moreInt+=1
    this.str = "Load more ..."
    this.loc.getAllCompanyMore(this.moreInt).toPromise()
    .then((res : any)=>{
      this.allCat.push(...res.data);
      this.str = "Load more"
    })
    .catch()
  }

}
