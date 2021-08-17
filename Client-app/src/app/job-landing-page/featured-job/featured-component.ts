import { Component, OnInit } from '@angular/core';
import { DeafultLocService } from '../../deafult-loc.service';

@Component({
    selector: 'app-landingpage-featured',
    templateUrl: './featured.html',
    styleUrls: ['./featured.css']
  })
export class LandingPageFeatured implements OnInit {

  featured : any[] = []
  domain : string = "https://workire.com/mediaimage/"
  domain2 : string = "https://workire.com/"

  constructor (private loc : DeafultLocService) {}

  ngOnInit() {
    this.loc.getAllJobs('','','','',0,1)
    .subscribe(
      data =>{
        this.featured = data.data.slice(0,8)
        console.log(this.featured)
      }
    )
  }

  urlParse = (str : string,comp : string) =>{
    if(str.includes("default.jpg"))
    {
      return this.domain + (comp[0].toUpperCase() + ".png")
    }
    else if(str.includes('http'))
    {
      return str;
    }
    return this.domain2 + str;
  }

  getTitle(str : string)
  {
    return str.split(" ").slice(0,2).join(" ");
  }

  getJobTitle(str : string)
  {
    str = str.replace(' & ',' ')
    str = str.replace('& ',' ')
    str = str.replace(' &',' ')
    str = str.replace(' and ',' ')
    str = str.replace(' (',' ')
    str = str.replace(' )',' ')
    str = str.replace(',','')
    str = str.split(" ").slice(0,2).join(" ")
    return str;
  }

  getText(str : string) {
    str = str.replace(/<[^>]+>/g, '');
    return "Apply to this job or view all the job via button below"
  }
}