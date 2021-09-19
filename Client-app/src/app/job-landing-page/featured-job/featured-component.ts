import { Component, OnInit } from '@angular/core';
import { DeafultLocService } from '../../deafult-loc.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-landingpage-featured',
    templateUrl: './featured.html',
    styleUrls: ['./featured.css']
  })
export class LandingPageFeatured implements OnInit {

  featured : any[] = []
  domain : string = environment.APIEndpoint + "/mediaimage/"
  domain2 : string = environment.APIEndpoint + '/'

  constructor (private loc : DeafultLocService) {}

  ngOnInit() {
    this.loc.getAllJobs('','','','',0,1)
    .subscribe(
      data =>{
        this.featured = data.data.slice(0,8)
      },
      err =>{}
    )
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
    return this.cap(str);
  }

  getText(str : string) {
    str = str.replace(/<[^>]+>/g, '');
    return "Apply to this job or view all the job via button below"
  }
  
  cap(str : string)
  {
    let temp='';
    for(let k of str.split(' '))
    {
      temp += k[0].toUpperCase() + k.slice(1,k.length).toLowerCase() + ' '
    }
    return temp;
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
}