import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DeafultLocService } from '../api-call.service';
import { environment } from '../../environments/environment';

// Not used
@Component({
  selector: 'app-job-featured',
  templateUrl: './job-featured.component.html',
  styleUrls: ['./job-featured.component.css']
})
export class JobFeaturedComponent implements OnInit {

  public featured : any = []

  domain : string = environment.APIEndpoint;
  isMobile : boolean = false;

  constructor(private loc: DeafultLocService,@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }

    this.loc.getAllJobs('','','','',0,1)
    .subscribe(
      (res : any)=>{
        this.featured = res.data.slice(0,6)
      },
      err =>{
        this.featured = [];
      }
    )
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
}
