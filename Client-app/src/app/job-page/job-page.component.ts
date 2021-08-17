import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DeafultLocService } from '../deafult-loc.service';
import { MetaServiceService } from '../meta-service.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-job-page',
  templateUrl: './job-page.component.html',
  styleUrls: ['./job-page.component.css']
})
export class JobPageComponent implements OnInit {

  @Input() show : boolean = false;
  @Input() jobDetails : any;
  isMobile : boolean = false;
  isSaved : boolean = false;
  jobSchema : any = {};
  @Input() jobid : string = 'find-job';
  @Input() check : boolean = true;

  domain : string = "https://workire.com"
  target_feature : any[] = []
  tit : string = '';
  schema : any = {};

  constructor(private activatedRoute: ActivatedRoute,private route: Router,private loc : DeafultLocService,private title : Title,private meta : Meta,@Inject(PLATFORM_ID) private platformId: Object,private serv : MetaServiceService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
      if(isPlatformBrowser(this.platformId))
      {
        this.isMobile = screen.width < 768;
      }
      this.activatedRoute.paramMap.subscribe(params => {
        if(this.check)
        {
          this.spinner.show();
          this.jobid = params.get('job')!
          this.loc.jobTitle(this.jobid).subscribe((res : any)=>{
            this.spinner.hide();
            this.jobDetails = res.Jobs[0];
            this.show = true;
            let rola = (this.jobDetails.Location!=='Not Specified') ? (this.jobDetails.Location + ' , ' + this.jobDetails.Country) : this.jobDetails.Country
            this.tit = this.jobDetails.Position + ' in ' + rola + ' at '+ this.jobDetails.AdvertiserName;
            this.title.setTitle(this.jobDetails.Position + ' in ' + rola + ' at '+ this.jobDetails.AdvertiserName + ' | Workire');
            this.meta.updateTag({name: "description",content: this.jobDetails.Position + ' in ' + rola + ' at '+ this.jobDetails.AdvertiserName + " .Find relvent jobs in " + this.jobDetails.Classification + ". Browse best " + this.jobDetails.Classification +" Jobs in "+ rola +" at Workire.com"})
            this.meta.updateTag({name: 'keywords', content: this.jobDetails.Position + ' in ' + rola + ' at '+ this.jobDetails.AdvertiserName + ','+this.jobDetails.Classification + ' Jobs in ' + rola})
            this.meta.updateTag({name: 'robots', content: 'index, follow'})
            this.meta.updateTag({property: 'og:type',content:'job'})
            this.meta.updateTag({property: 'og:title',content: this.jobDetails.Position + ' in ' + rola + ' at '+ this.jobDetails.AdvertiserName + ' | Workire'})
            this.meta.updateTag({property: 'og:description',content:this.jobDetails.Position + ' in ' + rola + ' at '+ this.jobDetails.AdvertiserName + " .Find relvent jobs in " + this.jobDetails.Classification + ". Browse best " + this.jobDetails.Classification +" Jobs in "+ rola +" at Workire.com"})
            this.meta.updateTag({property: 'og:url',content:this.domain + this.route.url})
            this.meta.updateTag({property: 'og:image',content:this.domain + this.jobDetails.LogoURL})
            this.meta.updateTag({name: 'og:site_name',content: 'Workire'})
            this.meta.updateTag({name: 'twitter:title',content: this.jobDetails.Position + ' in ' + rola + ' at '+ this.jobDetails.AdvertiserName + ' | Workire'})
            this.meta.updateTag({name: 'twitter:description',content: this.jobDetails.Position + ' in ' + rola + ' at '+ this.jobDetails.AdvertiserName + " .Find relvent jobs in " + this.jobDetails.Classification + ". Browse best " + this.jobDetails.Classification +" Jobs in "+ rola +" at Workire.com"})
            this.meta.updateTag({name: 'twitter:site',content: '@Workire'})
            this.meta.updateTag({name: 'twitter:creator',content: '@WaseemSabir01'})

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

            this.loc.featured(this.jobDetails.Classification).subscribe((res : any)=>{
              this.target_feature = res.job;
              this.target_feature = this.target_feature.filter((val)=>{
                return this.jobid !== val.Position;
              })
            })
          })

          
        }
        if(isPlatformBrowser(this.platformId))
        {
          if(this.check)
          {
            this.jobid = params.get('job')!
          }
          else if(this.route.url.split('/').includes('jobs') || this.route.url.split('/').includes('categories'))
          {
          }
          else
          {
            this.jobid = params.get('job')!
          }
          if(localStorage.getItem('saved'))
          {
            this.isSaved = localStorage.getItem('saved')?.split('~').includes(this.jobid)!
          }
        }
      })
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
    this.serv.changeMessage();
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
