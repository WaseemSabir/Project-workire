import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterValueService } from '../filter-value.service';
import { environment } from '../../environments/environment';
import { urlParseCommon, payloadToValues, valuesToPayload, getPayloadByRoute, SearchPayload } from '../Interfece';

@Component({
  selector: 'app-job-list-cards',
  templateUrl: './job-list-cards.component.html',
  styleUrls: ['./job-list-cards.component.css']
})
export class JobListCardsComponent implements OnInit {

  count : number = 0;
  domain : string = environment.APIEndpoint;
  jobs : any = [];
  page : number = 1;

  @Input() item : any;
  @Input() load : boolean = false;
  @Input() show : boolean = true;
  @Input() toggleView : boolean = false;
  @Input() isMobile : boolean = false;

  currvalues : SearchPayload = {
    search : '',
    country : '',
    company : '',
    category : '',
    page : 1,
    days : 0
  }

  constructor(private activatedRoute: ActivatedRoute,private filter : FilterValueService,private route : Router) { 
  }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe((params : any)=>{
      let payload = params.get("payload")!
      let variable = params.get("var")!

      this.currvalues = getPayloadByRoute(this.route.url,payload,variable);

      this.page = this.currvalues.page;
      this.count = this.item.count;
    })

    this.filter.currentMessage.subscribe((res : any)=>{
      this.jobs = res;
    })
  }

  pageChange(ev : number)
  {
    this.currvalues.page = ev;
    let p = valuesToPayload(this.currvalues.search,this.currvalues.country,this.currvalues.category,this.currvalues.company,this.currvalues.days,this.currvalues.page)
    this.route.navigate(['/Jobs',p]);
  }

  dateParse(d : string) : string
  {
    let today = Date.parse(new Date().toString());
    let curr = Date.parse(d);
    let j = Math.floor((today - curr)/(86400*1000))
    if(j==0)
    {
      return `Today`
    }
    else if(j==1)
    {
      return `Yesterday`
    }
    return `${j} day ago`
  }

  urlParse(str : string,comp : string) {
    return urlParseCommon(str,comp);
  }

  cardClick(slug : string)
  {
    this.filter.setSlug(slug);
    window.scroll(0,0);
  }
}
