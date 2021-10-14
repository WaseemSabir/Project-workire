import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DeafultLocService } from '../api-call.service';
import { isPlatformBrowser } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { FilterValueService } from '../filter-value.service';
import { Job, SearchPayload, getPayloadByRoute, getHeaderFromRoute } from '../Interfece'
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

  header : string = '';

  first : boolean = true;
  header2 : string = ' Jobs Found: Showing '

  domain : string = environment.APIEndpoint;

  loaded : boolean = false;

  allJobs : any = {}
  data : any;

  currJob : Job = {title:'',id:0};

  toggleView : boolean = false;

  searchFailed : any[] = []

  constructor(private loc : DeafultLocService,@Inject(PLATFORM_ID) private platformId: Object,private spinner: NgxSpinnerService,private filter : FilterValueService,private activated : ActivatedRoute, private route : Router) { }

  ngOnInit(): void {

    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width <= 768;
    }

    this.filter.title$.subscribe((res : Job)=>{
      this.currJob = res;
    })
    
    this.activated.paramMap
    .subscribe((params : any)=>{
      let payload = params.get("payload")!
      let variable = params.get("var")!

      let values : SearchPayload = getPayloadByRoute(this.route.url,payload,variable)

      if(isPlatformBrowser(this.platformId))
      {
        this.scrollToTop();
      }

      this.spinner.show();
      this.loaded = false;
      this.loc.getAllJobsSearchPayload(values).toPromise()
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

        this.header = getHeaderFromRoute(this.route.url, payload, variable, this.count, values);
        
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
