import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeafultLocService } from '../deafult-loc.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-job-list-cards',
  templateUrl: './job-list-cards.component.html',
  styleUrls: ['./job-list-cards.component.css']
})
export class JobListCardsComponent implements OnInit {

  jsonLD: SafeHtml = '';
  search : string = 'search';
  country : string = 'country';
  category : string = 'category';
  company : string = 'company';
  time : number = 0;
  page : number = 0;
  count : number = 0;
  totalPages : number = 0;

  jobId : string = 'find-job';

  domain : string = "https://workire.com"

  isMobile : boolean = false;

  filtertext : string = "Show Filter";
  
  paginate : any = [];
  jobs : any = [];

  int = parseInt

  @Input() item : any;
  @Input() load : boolean = false;
  @Input() show : boolean = true;
  @Input() head : string = '';
  @Input() head2 : string = '';

  constructor(private activatedRoute: ActivatedRoute,private route: Router,private loc: DeafultLocService,private sanitizer: DomSanitizer,@Inject(PLATFORM_ID) private platformId: Object) { 
  }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {

      if(this.route.url.split('/').includes('Job-category'))
      {
        this.country = 'country';
        this.search = 'search';
        this.company = 'company';
        this.loc.seoCatBySeo(this.unrep(params.get('cat')!)).subscribe((res : any)=>{
          console.log(res)
          this.category = res.category[0].Name;
        })
        this.time = 0;
        this.page = 1;
        this.jobId = 'find-job';
      }
      else if(this.route.url.split('/').includes('Job-country'))
      {
        this.search = 'search';
        this.company = 'company';
        this.time = 0;
        this.page = 1;
        this.jobId = 'find-job';
        this.category = 'category'
        this.country = params.get('count')!
      }
      else if(this.route.url.split('/').includes('Job-company'))
      {
        this.search = 'search';
        this.company = params.get('comp')!;
        this.company = this.company.replace(/-/g,' ')
        this.time = 0;
        this.page = 1;
        this.jobId = 'find-job';
        this.category = 'category'
        this.country = 'country'
      }
      else if(this.route.url.split('/').includes('Jobs') && this.route.url.split('/').length < 4)
      {
        this.country = 'country';
        this.search = 'search';
        this.company = 'company';
        this.category = 'category';
        this.time = 0;
        this.page = 1;
        this.jobId = 'find-job';
      }
      else
      {
        this.country = params.get('country')!
        this.search = params.get('search')!
        this.category = params.get('category')!
        this.company = params.get('company')!
        this.time = +params.get('days')!
        this.page = +params.get('page')!
        this.jobId = params.get('job')!
      }

      this.search = (this.search=="search") ? ('') : (this.search)
      this.company = (this.company=="company") ? ('') : (this.company)
      this.category = (this.category=="category") ? ('') : (this.category)
      this.country = (this.country=="country") ? ('') : (this.country)

      if(isPlatformBrowser(this.platformId))
      {
        this.isMobile = screen.width < 768;
      }

      this.count = this.item.count;

      this.totalPages = Math.floor(this.count/10)
      this.totalPages = (this.count%10) ? (this.totalPages+1) : (this.totalPages)

      this.paginate = []
      if(this.page!=1)
      {
        this.paginate.push("Previous");
        this.paginate.push(1)
        this.paginate.push('...')
      }
      else
      {
        this.paginate.push(1);
      }

      let pageSize = 1

      let t1 = (this.page - pageSize < 0) ? (1) : (this.page - pageSize)
      let t2 = (this.page + pageSize > this.totalPages) ? (this.totalPages) : (this.page + pageSize)
      for(let i=t1-1;i<t2;i++)
      {
        if(i>0)
        {
          this.paginate.push(i+1);
        }
      }
      if(this.page!=this.totalPages)
      {
        this.paginate.push('...')
        this.paginate.push(this.totalPages)
        this.paginate.push("Next");
      }
      this.jobs = this.item.data;
    })
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


  jobReinitiate(){
    try {

      if(this.jobs.length && !this.isMobile && this.jobId=='find-job' && !this.route.url.split('/').includes('job-category') && !this.route.url.split('/').includes('jobs'))
      {
        this.search = (this.search=='') ? ("search") : (this.search)
        this.company = (this.company=='') ? ("company") : (this.company)
        this.category = (this.category=='') ? ("category") : (this.category)
        this.country = (this.country=='') ? ("country") : (this.country)

        this.route.navigate(['/Jobs',this.jobs[0].Position,this.search,this.country,this.category,this.company,this.time,this.page]);
      }
    }
    catch (err){
      console.log(err)
    }
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

  unrep = (str: string) =>{
    return str.replace(/-/g,' ')
  }
}
