import { Component, OnInit, Optional, Inject, PLATFORM_ID } from '@angular/core';
import { DeafultLocService } from '../api-call.service';
import { isPlatformBrowser } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { FilterValueService } from '../filter-value.service';
import { Job, SearchPayload, getPayloadByRoute, getHeaderFromRoute } from '../Interfece'
import { environment } from '../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { RESPONSE, REQUEST } from '@nguniversal/express-engine/tokens';
import { isPlatformServer } from '@angular/common';
import { Request, Response } from 'express';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {

  public isMobile: boolean = false;
  count: number = 0;

  header: string = '';

  first: boolean = true;
  header2: string = ' Jobs Found: Showing '

  domain: string = environment.APIEndpoint;

  loaded: boolean = false;

  allJobs: any = {}
  data: any;

  currJob: Job = { slug: "" };

  toggleView: boolean = false;

  searchFailed: any[] = []
  schemaData: any[] = [];

  constructor(private loc: DeafultLocService, @Inject(PLATFORM_ID) private platformId: Object, private spinner: NgxSpinnerService, private filter: FilterValueService, private activated: ActivatedRoute, private route: Router, @Optional() @Inject(REQUEST) private request: Request,
    @Optional() @Inject(RESPONSE) private response: Response) { }

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = screen.width <= 768;
    }

    this.filter.title$.subscribe((res: Job) => {
      this.currJob = res;
    })

    this.activated.paramMap
      .subscribe((params: any) => {
        let payload = params.get("payload")!
        let variable = params.get("var")!

        let values: SearchPayload = getPayloadByRoute(this.route.url, payload, variable)
        if (isPlatformBrowser(this.platformId)) {
          this.scrollToTop();
        }

        this.spinner.show();
        this.loaded = false;
        this.loc.getAllJobsSearchPayload(values).toPromise()
          .then((dataRet: any) => {
            this.spinner.hide();
            this.handleJobData(dataRet, payload, variable, values);
            if (isPlatformServer(this.platformId)) {
              this.response.status(200);
            }
          })
          .catch((err: any) => {
            this.spinner.hide();
            let dataRet: any = {
              count: 0,
              data: []
            }
            if (err.error) {
              dataRet = err.error;
            }

            if (isPlatformServer(this.platformId)) {
              this.response.status(404);
            }
            this.handleJobData(dataRet, payload, variable, values);
          })
      })
  }

  scrollToTop() {
    window.scroll(0, 0);
  }

  handleJobData(dataRet: any, payload: any, variable: any, values: any) {
    this.spinner.hide();
    this.data = dataRet;

    this.allJobs = dataRet.data;

    // initialize json ld schema data
    this.schemaData = [];
    this.allJobs.forEach((job: any) => {
      this.schemaData.push(this.jobDataToLdJsonSchema(job));
    })

    // headers and title for page
    if (this.data.count && !this.isMobile) {
      let slug = this.allJobs[0].slug;
      this.filter.setSlug(slug);
    }
    this.loaded = true;
    this.count = this.data.count;

    this.header = getHeaderFromRoute(this.route.url, payload, variable, this.count, values);

    this.first = false;

    // inform other components that data is loaded
    this.filter.changeMessage(this.allJobs);
    if (!this.allJobs.length) {
      this.prepareCategoryList();
    }
  }

  goBackMobile() {
    this.filter.setSlug('');
  }

  jobDataToLdJsonSchema(data: any): any {
    return {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": data.Position,
      "description": data.Description,
      "hiringOrganization": {
        "@type": "Organization",
        "name": data.AdvertiserName
      },
      "industry": data.Classification,
      "employmentType": data.EmploymentType,
      "workHours": data.WorkHours,
      "datePosted": data.PostDate,
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": data.Area,
          "addressLocality": data.Location,
          "postalCode": data.PostalCode,
          "addressCountry": data.Country
        }
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": data.SalaryCurrency,
        "value": {
          "@type": "QuantitativeValue",
          "minValue": data.SalaryMinimum,
          "maxValue": data.SalaryMaximum,
          "unitText": data.SalaryPeriod
        }
      }
    }
  }

  prepareCategoryList() {
    this.loc.getAllSeoCat().toPromise()
      .then((res: any) => {
        let rand = Math.floor(Math.random() * res.category.length);
        if (rand > 20) {
          rand = rand - 5;
        }
        this.searchFailed = res.category.slice(rand, rand + 5).map((val: any) => {
          return [val.SEO_NAME, '/Job-category/' + val.SEO_NAME]
        })
      })
  }
}
