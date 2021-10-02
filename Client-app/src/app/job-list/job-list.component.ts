import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { DeafultLocService } from '../deafult-loc.service';
import { isPlatformBrowser } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { FilterValueService } from '../filter-value.service';
import { Filters, Job } from '../Interfece'
import { environment } from '../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {

  public isMobile : boolean = false;
  count : number = 0;

  @Input() header : string = '';
  first : boolean = true;
  header2 : string = ' Jobs Found: Showing '

  domain : string = environment.APIEndpoint;

  loaded : boolean = false;

  allJobs : any = {}
  data : any;

  currJob : Job = {title:'',id:0};

  toggleView : boolean = false;

  searchFailed : any[] = []

  @Input() payloadFromAbove : string = ''

  constructor(private loc : DeafultLocService,@Inject(PLATFORM_ID) private platformId: Object,private spinner: NgxSpinnerService,private filter : FilterValueService,private route : ActivatedRoute) { }

  ngOnInit(): void {

    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width <= 768;
    }

    this.filter.title$.subscribe((res : Job)=>{
      this.currJob = res;
    })
    
    this.route.paramMap
    .subscribe((params : any)=>{
      let payload = params.get("payload")!
      let search : string = "", country : string = "", category : string = "", company : string = "", days : number = 0, page : number = 1
      if(this.header.length && this.first)
      {
        payload = this.payloadFromAbove;
      }
      else
      {
        this.header = ''
      }
      this.first = true
      if(payload)
      {
        let output = this.filter.payloadToValues(payload);
        search = output.search!
        country = output.country!
        category = output.category!
        company = output.company!
        days = output.days!
        page = output.page!
      }

      if(isPlatformBrowser(this.platformId))
      {
        this.scrollToTop();
      }
      this.spinner.show();
      this.loaded = false;
      this.loc.getAllJobs(search,country,category,company,days,page).toPromise()
      .then((dataRet : any)=>{
        this.spinner.hide();
        this.data = dataRet;
        
        this.allJobs = dataRet.data;
        
        if(this.data.count && !this.isMobile)
        {
          this.filter.setTitle(this.allJobs[0].Position,this.allJobs[0].id);
        }
        this.loaded = true;
        this.count = this.data.count;

        if(!this.header || !this.first)
        {
          this.header = ' Jobs ';
          this.header2 = 'Showing '
          this.header = (search.length==0) ? (this.header) : (search + this.header) 
          this.header = (country.length!=0) ? (this.header + "in " + country.split(',').join(' , ')) : this.header
          let temp = (((page-1)*10)+10)
          this.header2 = this.header2 + (((page-1)*10)+1).toString() + ' - ';
          this.header2 = (temp<this.count) ? (this.header2 + temp.toString()) : (this.header2 + this.count)
        }

        this.header = this.count.toString() + '+ ' + this.header
        this.first = false;
        
        this.filter.changeMessage(this.allJobs);
        if(!this.allJobs.length)
        {
          this.prepareCategoryList();
        }
      })
      .catch()
    })
  }

  scrollToTop() {
    window.scroll(0,0);
  }

  goBackMobile()
  {
    this.filter.setTitle('',0);
  }

  prepareCategoryList()
  {
    this.loc.getAllSeoCat().toPromise()
    .then((res : any)=>{
      let rand = Math.floor(Math.random() * res.category.length);
      if(rand>20)
      {
        rand=rand-5;
      }
      this.searchFailed = res.category.slice(rand,rand+5).map((val : any)=>{
        return [val.SEO_NAME,'/Job-category/'+val.SEO_NAME.replace(/ /g,'-')]
      })
    })
  }
}
