import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { DeafultLocService } from '../api-call.service';
import { NgxSpinnerService } from "ngx-spinner";
import { FilterValueService } from '../filter-value.service';
import { Job } from '../Interfece'
import { SeoServiceService } from '../seo-service.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-job-page',
  templateUrl: './job-page.component.html',
  styleUrls: ['./job-page.component.css']
})
export class JobPageComponent implements OnInit {

  isMobile : boolean = false;
  isSaved : boolean = false;
  jobSchema : any = {};
  @Input() check : boolean = true;
  jobid : string = '';
  jobDetails : any = {};

  domain : string = environment.APIEndpoint;
  target_feature : any[] = []
  tit : string = '';
  schema : any = {};

  constructor(private route: Router,private loc : DeafultLocService,@Inject(PLATFORM_ID) private platformId: Object,private seo : SeoServiceService,private spinner: NgxSpinnerService,private filter : FilterValueService) { }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }

    this.filter.title$.subscribe((res : Job) =>{
      this.jobid = res.title;
      this.spinner.show();
      if(res.id) {
        this.loc.jobById(res.id).toPromise()
        .then((res : any)=>{
          this.spinner.hide()
          this.initJob(res, false);
        })
      }
      else {
        this.loc.jobTitle(this.jobid).toPromise()
        .then((res : any)=>{
          this.spinner.hide()
          this.initJob(res, true);
        })
      }

      if(isPlatformBrowser(this.platformId))
      {
        if(localStorage.getItem('saved'))
        {
          this.isSaved = localStorage.getItem('saved')?.split('~').includes(this.jobid)!
        }
      }
    })
  }

  initJob(jobData : any, getFeatured : boolean) {
    this.spinner.hide();
    this.jobDetails = jobData.Jobs[0];

    if(getFeatured) {
      this.loc.featured(this.jobDetails.Classification).toPromise()
      .then((res : any)=>{
        this.target_feature = res.job;
        this.target_feature = this.target_feature.filter((val)=>{
          return this.jobid !== val.Position;
        })
      })
      .catch()
    }

    this.schema = {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": this.jobDetails.Position,
      "description": this.jobDetails.Description,
      "hiringOrganization" : {
        "@type": "Organization",
        "name": this.jobDetails.AdvertiserName
      },
      "industry": this.jobDetails.Classification,
      "employmentType": this.jobDetails.EmploymentType,
      "workHours": this.jobDetails.WorkHours,
      "datePosted": this.jobDetails.PostDate,
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": this.jobDetails.Area,
          "addressLocality": this.jobDetails.Location,
          "postalCode": this.jobDetails.PostalCode,
          "addressCountry": this.jobDetails.Country
        }
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": this.jobDetails.SalaryCurrency,
        "value": {
          "@type": "QuantitativeValue",
          "minValue": this.jobDetails.SalaryMinimum,
          "maxValue": this.jobDetails.SalaryMaximum,
          "unitText": this.jobDetails.SalaryPeriod
        }
      }
    }
  }

  saveIcon() {
    if(this.isSaved)
    {
      let temp = localStorage.getItem('saved')?.split('~')
      temp = temp?.filter((val : string)=>{
        return val !== this.jobid;
      })

      if(temp?.length)
      {
        localStorage.setItem('saved',temp!.join('~'));
      }
      else
      {
        localStorage.setItem('saved','')
      }
    }
    else
    {
      if(localStorage.getItem('saved'))
      {
        let temp = localStorage.getItem('saved')
        let k = temp?.split('~')
        k?.push(this.jobid)
        localStorage.setItem('saved',k!.join('~'))
      }
      else
      {
        localStorage.setItem('saved',this.jobid)
      }
    }
    this.isSaved = (!this.isSaved)
    this.seo.changeMessage();
  }

  DateFun (str : string)
  {
    let today = Date.parse(new Date().toString());
    let d = Date.parse(str);
    let j = Math.floor((today - d)/(86400*1000))
    if(j==0)
    {
      return 'Today';
    }
    else if(j==1)
    {
      return 'Yesterday';
    }
    else
    {
      return `${j} days ago`;
    }
  }

  isEmpty = () =>{
    if(this.jobDetails)
    {
      return true;
    }
    else
    {
      return false;
    }
  }
}
