import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilterValueService } from '../filter-value.service';
import { Filters } from '../Interfece'
import { environment } from '../../environments/environment';

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

  constructor(private activatedRoute: ActivatedRoute,private filter : FilterValueService) { 
  }

  ngOnInit(): void {

    this.filter.filter$.subscribe((res : Filters)=>{
      this.page = res.page;
      this.count = this.item.count;
    })

    this.filter.currentMessage.subscribe((res : any)=>{
      this.jobs = res;
    })
  }

  pageChange(ev : number)
  {
    this.filter.setPage(ev);
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

  cardClick(title : string,iden : number)
  {
    this.filter.setTitle(title,iden);
    window.scroll(0,0);
  }
}
