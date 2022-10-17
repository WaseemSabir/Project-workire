import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, Optional, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { DeafultLocService } from '../api-call.service';
import { NgxSpinnerService } from "ngx-spinner";
import { FilterValueService } from '../filter-value.service';
import { Job } from '../Interfece'
import { SeoServiceService } from '../seo-service.service';
import { environment } from '../../environments/environment';
import { RESPONSE, REQUEST } from '@nguniversal/express-engine/tokens';
import { isPlatformServer } from '@angular/common';
import { Request, Response } from 'express';


/**
 * Page is deprecated. and not used anymore
 * 
 * notes: schema is removed from html, add that if needed
 */
@Component({
  selector: 'app-job-page',
  templateUrl: './job-page.component.html',
  styleUrls: ['./job-page.component.css']
})
export class JobPageComponent implements OnInit {

  isMobile: boolean = false;
  isSaved: boolean = false;
  jobSchema: any = {};
  @Input() check: boolean = true;
  jobTitle: string = '';
  jobDetails: any = {};

  domain: string = environment.APIEndpoint;
  target_feature: any[] = []
  tit: string = '';
  schema: any = {};
  showSchema: boolean = true

  slug : string = '';

  constructor(private route: Router, private loc: DeafultLocService, @Inject(PLATFORM_ID) private platformId: Object, private seo: SeoServiceService, private spinner: NgxSpinnerService, private filter: FilterValueService, @Optional() @Inject(REQUEST) private request: Request,
    @Optional() @Inject(RESPONSE) private response: Response) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = screen.width < 768;
    }

    this.showSchema = this.route.url.split("/").some(
      (val, index, array) => {
        return (val=="Job" || val=="job")
      }
    )

    this.filter.title$.subscribe((res: Job) => {

      // different job requested, that is not already loaded
      if (this.jobTitle !== this.jobDetails.Position) {
        this.fetchJob(res); // fetches job, init job details, gets featured jobs and sets SEO
      } else {
        this.handleSeo(); // sets SEO
      }

      if (isPlatformBrowser(this.platformId)) {
        if (localStorage.getItem('saved')) {
          this.isSaved = localStorage.getItem('saved')?.split('~').includes(this.jobTitle)!
        }
      }
    })
  }


  fetchJob(res: Job) {
    this.spinner.show();
    let id = res.slug.split('-').at(-1)!!

    if (id) {
      let jobId: number = parseInt(id, 0);

      this.loc.jobById(jobId).toPromise()
        .then((res: any) => {
          this.spinner.hide()
          this.initJob(res);
        })
    } else {
      this.spinner.hide()
      this.initJob({ Jobs: [] });
    }
  }

  initJob(jobData: any) {
    // Used after getting new data, to cater all side effects of showing new job!
    this.spinner.hide();

    if (jobData.Jobs.length) {

      this.jobDetails = jobData.Jobs[0];

      this.slug = this.jobDetails.slug;

      this.getFeaturedJobs();
      this.handleSeo();

      // return good response
      try {
        if (isPlatformServer(this.platformId)) {
          this.response.status(200);
        }
      } catch {}

    } else {
      // No job found, return 404! page rendering handled in html
      try {
        if (isPlatformServer(this.platformId)) {
          this.response.status(404);
        }
      } catch {}
    }

  }

  getFeaturedJobs() {
    this.loc.featured(this.jobDetails.Classification).toPromise()
      .then((res: any) => {
        this.target_feature = res.job;
        this.target_feature = this.target_feature.filter((val) => {
          return this.jobTitle !== val.Position;
        })
      })
      .catch((err: any) => {
        console.log(err)
      })
  }

  handleSeo() {
    if (this.isNotEmpty()) {

      this.schema = {
        "@context": "https://schema.org/",
        "@type": "JobPosting",
        "title": this.jobDetails.Position,
        "description": this.jobDetails.Description,
        "hiringOrganization": {
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

      // set seo
      let rola = (this.jobDetails.Location !== 'Not Specified') ? (this.jobDetails.Location + ', ' + this.jobDetails.Country) : this.jobDetails.Country

      let tit = this.jobDetails.Position + ' in ' + rola + ' at ' + this.jobDetails.AdvertiserName;
      let desc = this.jobDetails.Position + ' in ' + rola + ' at ' + this.jobDetails.AdvertiserName + " .Find relvent jobs in " + this.jobDetails.Classification + ". Browse best " + this.jobDetails.Classification + " Jobs in " + rola + " at Workire.com"
      let keywords = this.jobDetails.Position + ' in ' + rola + ' at ' + this.jobDetails.AdvertiserName + ',' + this.jobDetails.Classification + ' Jobs in ' + rola
      let type = 'job'
      let url = this.domain + this.route.url
      let image = this.domain + this.jobDetails.LogoURL

      this.seo.updateSeoWithImage(tit, desc, keywords, image, type, url);
      this.seo.createCanonicalURL(url);
    }

  }

  saveIcon() {
    if (this.isSaved) {
      let temp = localStorage.getItem('saved')?.split('~')
      temp = temp?.filter((val: string) => {
        return val !== this.jobTitle;
      })

      if (temp?.length) {
        localStorage.setItem('saved', temp!.join('~'));
      }
      else {
        localStorage.setItem('saved', '')
      }
    }
    else {
      if (localStorage.getItem('saved')) {
        let temp = localStorage.getItem('saved')
        let k = temp?.split('~')
        k?.push(this.jobTitle)
        localStorage.setItem('saved', k!.join('~'))
      }
      else {
        localStorage.setItem('saved', this.jobTitle)
      }
    }
    this.isSaved = (!this.isSaved)
    this.seo.changeMessage();
  }

  DateFun(str: string) {
    let today = Date.parse(new Date().toString());
    let d = Date.parse(str);
    let j = Math.floor((today - d) / (86400 * 1000))
    if (j == 0) {
      return 'Today';
    }
    else if (j == 1) {
      return 'Yesterday';
    }
    else {
      return `${j} days ago`;
    }
  }

  isNotEmpty = () => {
    return !(this.jobDetails && (Object.keys(this.jobDetails).length === 0));
  }
}
