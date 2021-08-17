import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DeafultLocService } from '../deafult-loc.service';

@Component({
  selector: 'app-job-featured',
  templateUrl: './job-featured.component.html',
  styleUrls: ['./job-featured.component.css']
})
export class JobFeaturedComponent implements OnInit {

  public featured : any = []

  domain : string = "https://workire.com"
  isMobile : boolean = false;

  constructor(private loc: DeafultLocService,@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }

    let temp = ''
    if(isPlatformBrowser(this.platformId))
    {
      if(localStorage.getItem('search'))
      {
        temp = localStorage.getItem('search')!
      }
    }
    this.loc.featured(temp).subscribe((res : any)=>{
      this.featured = res.job;
      if(!this.isMobile)
      {
        this.featured = this.featured.slice(1,4);
      }
    })
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
