import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { DeafultLocService } from '../deafult-loc.service';
import { FormControl } from '@angular/forms'
import { isPlatformBrowser } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {

  public isMobile : boolean = false;
  public showFilter : boolean = true;

  currSearch = new FormControl('');

  search : string = 'search';
  country : string = 'country';
  category : string = 'category';
  company : string = 'company';
  time : number = 0;
  page : number = 0;
  count : number = 0;
  job : string = 'find-job';

  header : string = ' Jobs ';
  header2 : string = ' Jobs Found: Showing '
  filtertext : string = "Show Filter";

  bStr : string = '< Back '

  domain : string = "https://workire.com"

  loaded : boolean = false;

  allJobs : any = {}

  firstTime : boolean = true

  change : boolean = false

  data : any;

  akjob : any;
  dekho : boolean = false;
  haj : boolean = false;

  h1tag : string = ''

  constructor(private activatedRoute: ActivatedRoute,private route: Router,public meta: Meta, public title: Title,private loc : DeafultLocService,@Inject(PLATFORM_ID) private platformId: Object,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
        if(isPlatformBrowser(this.platformId))
        {
          this.isMobile = screen.width < 768;
        }
        let a,b,c,d,e,g;
        let f : number = 0;
        if(this.route.url.split('/').includes('Jobs') && this.route.url.split('/').length < 4)
        {
          b = 'search'
          d = 'company'
          a = 'country'
          c = 'category'
          e = 0
          f = 1
          this.job = 'find-job'
        }
        else
        {
          a = params.get('country')!
          b = params.get('search')!
          c = params.get('category')!
          d = params.get('company')!
          e = +params.get('days')!
          f = +params.get('page')!
          g = params.get('job')!
          this.job = g;
        }

        this.loc.jobTitle(this.job).subscribe((res : any) => {
          this.akjob = res.Jobs[0];
          if(this.akjob.Location=='Not Specified')
          {
            this.h1tag = this.akjob.Position + ' in ' + this.akjob.Country + ' at '  + this.akjob.AdvertiserName;
          }
          else
          {
            this.h1tag = this.akjob.Position + ' in ' + this.akjob.Location + ' at '  + this.akjob.AdvertiserName;
          }
          if(this.header ===' Jobs ')
          {
            this.title.setTitle('Jobs | Browse our Job Listing | Workire')
            this.meta.updateTag({name: "description",content: "Search and apply on Workire for jobs hiring now. Find a job using our Job Search platform and get hired faster. Many new jobs are updated daily for all categories"})
            this.meta.updateTag({name: 'keywords', content: "find jobs,get hired faster"})
            this.meta.updateTag({property: 'og:type',content:'job'})
            this.meta.updateTag({property: 'og:title',content: 'Jobs | Browse our Job Listing | Workire'})
            this.meta.updateTag({property: 'og:description',content:"Search and apply on Workire for jobs hiring now. Find a job using our Job Search platform and get hired faster. Many new jobs are updated daily for all categories"})
            this.meta.updateTag({property: 'og:url',content:this.domain + this.route.url})
            this.meta.updateTag({property: 'og:image',content:this.domain + '/assets/workire.png'})
            this.meta.updateTag({name: 'og:site_name',content: 'Workire'})
            this.meta.updateTag({name: 'twitter:title',content: 'Jobs | Browse our Job Listing | Workire'})
            this.meta.updateTag({name: 'twitter:description',content: "Search and apply on Workire for jobs hiring now. Find a job using our Job Search platform and get hired faster. Many new jobs are updated daily for all categories"})
            this.meta.updateTag({name: 'twitter:site',content: '@Workire'})
            this.meta.updateTag({name: 'twitter:creator',content: '@WaseemSabir01'})
          }
        })
        if(this.job!='find-job')
        {
          this.dekho = false;
          this.loc.jobTitle(this.job).subscribe((res : any) => {
            this.dekho = true;
            this.akjob = res.Jobs[0];
            if(this.akjob.Location=='Not Specified')
            {
              this.h1tag = this.akjob.Position + ' in ' + this.akjob.Country + ' at '  + this.akjob.AdvertiserName;
            }
            else
            {
              this.h1tag = this.akjob.Position + ' in ' + this.akjob.Location + ' at '  + this.akjob.AdvertiserName;
            }
          })
        }

        this.search = (this.search=='') ? ("search") : (this.search)
        this.company = (this.company=='') ? ('company') : (this.company)
        this.category = (this.category=='') ? ('category') : (this.category)
        this.country = (this.country=='') ? ('country') : (this.country)

        if(!(this.country==a && this.search==b && this.category==c && this.company==d && this.time==e && this.page==f) || this.firstTime || this.change)
        {
          this.spinner.show();
          this.country=a
          this.search=b
          this.category=c
          this.company=d
          this.time=e
          this.page=f
          this.change = false
          this.firstTime = false;
          this.loaded = false
          this.search = (this.search=="search") ? ('') : (this.search)
          this.company = (this.company=="company") ? ('') : (this.company)
          this.category = (this.category=="category") ? ('') : (this.category)
          this.country = (this.country=="country") ? ('') : (this.country)
          if(this.route.url.split('/').includes('job-category'))
          {
            this.header = params.get("str")!
          }
          else
          {
            this.header = ' Jobs ';
          }
          this.header2 = ' Jobs Found: Showing '
          this.currSearch.setValue(this.search);
          this.loc.getAllJobs(this.search,this.country,this.category,this.company,this.time,this.page).subscribe((res : any)=>{
              this.spinner.hide();
              this.data = res;
              this.allJobs = res.data;

              if(this.data.count && this.job==='find-job' && !this.isMobile)
              {
                this.job = this.allJobs[0].Position;
                this.dekho = false;
                this.loc.jobTitle(this.job).subscribe((res : any) => {
                  this.dekho = true;
                  this.akjob = res.Jobs[0];
                })
              }
              this.header = ' Jobs ';
              this.header2 = 'Showing '
              this.loaded = true;
              this.count = this.data.count
              this.header = (this.search.length==0) ? (this.header) : (this.search + this.header) 
              this.header = (this.country.length!=0) ? (this.header + "in " + this.country.split(',').join(' , ')) : this.header
              let SeoHead = this.header;
              let SeoLoc = (this.country.length!=0) ? ("in " + this.country.split(',').join(' , ')) : ''
              this.header = this.count.toString() + '+ ' + this.header
              let temp = (((this.page-1)*10)+10)
              this.header2 = this.header2 + (((this.page-1)*10)+1).toString() + ' - ';
              this.header2 = (temp<this.count) ? (this.header2 + temp.toString()) : (this.header2 + this.count)

              this.title.setTitle("Find latest " + SeoHead + ' | Workire')
              this.meta.updateTag({name: "description",content: "Top " + SeoHead + ".  Many new " + SeoHead + " are updated daily."})
              this.meta.updateTag({name: 'keywords', content: `${SeoHead},new ${SeoHead},${this.search} Job ${SeoLoc},${this.search} Job opportunity ${SeoLoc},${this.search} Job openings ${SeoLoc}`})
              this.meta.updateTag({property: 'og:type',content:'job'})
              this.meta.updateTag({property: 'og:title',content: "Find latest " + SeoHead + ' | Workire'})
              this.meta.updateTag({property: 'og:description',content:"Top " + SeoHead + ".  Many new " + SeoHead + " are updated daily."})
              this.meta.updateTag({property: 'og:url',content:this.domain + this.route.url})
              this.meta.updateTag({property: 'og:image',content:this.domain + '/assets/workire.png'})
              this.meta.updateTag({name: 'og:site_name',content: 'Workire'})
              this.meta.updateTag({name: 'twitter:title',content: "Find latest " + SeoHead + ' | Workire'})
              this.meta.updateTag({name: 'twitter:description',content: "Top " + SeoHead + ".  Many new " + SeoHead + " are updated daily."})
              this.meta.updateTag({name: 'twitter:site',content: '@Workire'})
              this.meta.updateTag({name: 'twitter:creator',content: '@WaseemSabir01'})
          })
        }
    })
  }

  filterButton () {
    this.filtertext = (this.filtertext=="Show Filter") ? "Hide Filter" : "Show Filter";
    this.showFilter = (!this.showFilter)
  }

  changeInSearch() {

    this.search = (this.currSearch.value=="") ? ("search") : (this.currSearch.value)
    this.company = (this.company=='') ? ("company") : (this.company)
    this.category = (this.category=='') ? ("category") : (this.category)
    this.country = (this.country=='') ? ("country") : (this.country)

    this.change = true;

    this.route.navigate(['/Jobs','find-job',this.search,this.country,this.category,this.company,0,1])
  }

  searchCheck ()
  {
    this.search = (this.search=='') ? ("search") : (this.search)
    return this.search;
  }

  compCheck ()
  {
    this.company = (this.company=='') ? ("company") : (this.company)
    return this.company;
  }

  catCheck ()
  {
    this.category = (this.category=='') ? ("category") : (this.category)
    return this.category;
  }

  countCheck ()
  {
    this.country = (this.country=='') ? ("country") : (this.country)
    return this.country;
  }

}
