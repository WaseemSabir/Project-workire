import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { DeafultLocService } from '../deafult-loc.service';
import { FormControl } from '@angular/forms'
import { isPlatformBrowser } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-job-one-country',
  templateUrl: './job-one-country.component.html',
  styleUrls: ['./job-one-country.component.css']
})
export class JobOneCountryComponent implements OnInit {

  public isMobile : boolean = false;
  public showFilter : boolean = false;

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
  jobSchema : any;
  haj : boolean = false;

  h1tag : string = ''
  anotherOne : boolean = false;

  realCat : string = ''

  constructor(private activatedRoute: ActivatedRoute,private route: Router,public meta: Meta, public title: Title,private loc : DeafultLocService,@Inject(PLATFORM_ID) private platformId: Object,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
        this.spinner.show()
        if(isPlatformBrowser(this.platformId))
        {
          this.isMobile = screen.width < 768;
        }
        this.anotherOne = false
        let c = params.get('count')!
        this.page = 1;
        this.job = 'find-job';

        this.anotherOne = true;
        this.realCat = c
        this.h1tag = 'Jobs in ' + c
        this.title.setTitle('Jobs in ' + c + ' | Workire');
        this.meta.updateTag({name: "description",content:'Apply for the best jobs in ' + c + '.New careers in ' + c + ' are added daily on Workire.com. Apply quickly to various ' + c.split(' ')[0] + ' job openings that are hiring near you.'})
        this.meta.updateTag({name: 'keywords', content:'Jobs in '+ c.split('-')[0] + ', Job in ' + c.split('-')[0] +",Career in "+ c.split('-')[0] + ','+ c.split('-')[0] +" job,Job opportunity in "+c.split('-')[0]+",Employment in " + c.split('-')[0]+",Recruitment in "+ c.split('-')[0] +",Jobs openings in "+c.split(' ')[0]+",Jobs search in "+c.split('-')[0]})
        this.meta.updateTag({name: 'robots', content: 'index, follow'})
        this.meta.updateTag({property: 'og:type',content:'category'})
        this.meta.updateTag({property: 'og:title',content:'Jobs in ' + c + ' | Workire'})
        this.meta.updateTag({property: 'og:description',content:'Apply for the best jobs in ' + c + '.New careers in ' + c + ' are added daily on Workire.com. Apply quickly to various ' + c.split(' ')[0] + ' job openings that are hiring near you.'})
        this.meta.updateTag({property: 'og:image',content:this.domain+ "/assets/workire.jpg"})
        this.meta.updateTag({property: 'og:url',content:this.domain+this.route.url})
        this.meta.updateTag({name: 'og:site_name',content: 'Workire'})
        this.meta.updateTag({name: 'twitter:title',content: 'Jobs in ' + c + ' | Workire'})
        this.meta.updateTag({name: 'twitter:description',content:'Apply for the best jobs in ' + c + '.New careers in ' + c + ' are added daily on Workire.com. Apply quickly to various ' + c.split(' ')[0] + ' job openings that are hiring near you.'})
        this.meta.updateTag({name: 'twitter:image',content: this.domain + "/assets/workire.jpg"})
        this.meta.updateTag({name: 'twitter:site',content: '@Workire'})
        this.meta.updateTag({name: 'twitter:creator',content: '@WaseemSabir01'})

        this.country=c
        this.search=''
        this.category=''
        this.company=''
        this.time=0
        this.change = false
        this.firstTime = false;
        this.loaded = false
        this.header = ' Jobs ';
        this.header2 = ' Jobs Found: Showing '
        this.currSearch.setValue(this.search);
        this.loc.getAllJobs(this.search,this.country,this.category,this.company,this.time,1).subscribe((res2 : any)=>{
              this.data = res2;
              this.allJobs = res2.data;
              this.spinner.hide();
              if(this.allJobs.length && !this.isMobile)
              {
                this.job = this.allJobs[0].id;
                this.dekho = false;
                this.loc.jobById(this.job).subscribe((res3 : any) => {
                  this.dekho = true;
                  this.akjob = res3.Jobs[0];
                })
              }
              this.header2 = ' Jobs Found: Showing '
              this.loaded = true;
              this.count = res2.count
              this.header = 'Jobs in ' + this.ungap(c)
              this.header2 = this.count.toString() + this.header2 + (((this.page-1)*10)+1).toString() + ' - ';
              let temp = (((this.page-1)*10)+10)
              this.header2 = (temp<this.count) ? (this.header2 + temp.toString()) : (this.header2 + this.count)
        })
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
    this.realCat = (this.realCat=='') ? ("category") : (this.realCat)
    return this.realCat;
  }

  countCheck ()
  {
    this.country = (this.country=='') ? ("country") : (this.country)
    return this.country;
  }

  unrep(str : string)
  {
    return str.replace(/-/g,' ')
  }

  ungap (str : string)
  {
    return str.replace('-',' , ')
  }

}
