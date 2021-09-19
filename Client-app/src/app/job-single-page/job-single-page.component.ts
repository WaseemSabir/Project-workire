import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeafultLocService } from '../deafult-loc.service';
import { FilterValueService } from '../filter-value.service';
import { SeoServiceService } from '../seo-service.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-job-single-page',
  templateUrl: './job-single-page.component.html',
  styleUrls: []
})
export class JobSinglePageComponent implements OnInit {

  domain : string = environment.APIEndpoint;

  constructor(private active : ActivatedRoute,private filter : FilterValueService,private loc : DeafultLocService,private seo : SeoServiceService,private route : Router) { }

  ngOnInit(): void {
    this.active.paramMap.subscribe((params : any)=>{
      this.filter.setTitle(params.get("job")!,0);

      this.loc.jobTitle(params.get("job")!).toPromise()
      .then((res : any)=>{
        
        let jobDetails = res.Jobs[0];
        let rola = (jobDetails.Location!=='Not Specified') ? (jobDetails.Location + ' , ' + jobDetails.Country) : jobDetails.Country
  
        let tit = jobDetails.Position + ' in ' + rola + ' at '+ jobDetails.AdvertiserName;
        let desc = jobDetails.Position + ' in ' + rola + ' at '+ jobDetails.AdvertiserName + " .Find relvent jobs in " + jobDetails.Classification + ". Browse best " + jobDetails.Classification +" Jobs in "+ rola +" at Workire.com"
        let keywords = jobDetails.Position + ' in ' + rola + ' at '+ jobDetails.AdvertiserName + ','+jobDetails.Classification + ' Jobs in ' + rola
        let type = 'job'
        let url = this.domain + this.route.url
        let image = this.domain + jobDetails.LogoURL
  
        this.seo.updateSeoWithImage(tit,desc,keywords,image,type,url);
        this.seo.createCanonicalURL(url);
      })
      .catch()
    })
  }
}
