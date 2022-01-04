import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router'
import { DeafultLocService } from '../api-call.service';
import { FilterValueService } from '../filter-value.service';
import { valuesToPayload } from '../Interfece';

@Component({
  selector: 'app-job-search',
  templateUrl: './job-search.component.html',
  styleUrls: ['./style.css']
})
export class JobSearchComponent implements OnInit {

  constructor(private router : Router,private loc: DeafultLocService,@Inject(PLATFORM_ID) private platformId: Object,private filter : FilterValueService) {  }

  search : string = ''
  country : string = ''

  val : string = '';

  public check = false;
  public isMobile = false;
  public catShow: boolean = false;
  public countShow : boolean = false;
  public categories: any = {};
  public countries: any = {};
  public seocat: any = {};
  public totalJobs : number = 50000;

  // country autocomplete
  private list: string[] = [];
  public customCunt : any = {};
  public options: string[] = [];


  ngOnInit(): void {
    this.check = false;
    this.loc.getCustomCountries().toPromise()
    .then((res : any)=>{
      this.customCunt = {};
      for(let k of res)
      {
        this.customCunt[k.Country] = k.cities.split(',').filter((val:string)=>{
          return val!='';
        })
      }
      this.options = this.list = this.BendIt(this.customCunt);
    })
    .catch()

    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }

    this.loc.totalJobCount().toPromise()
    .then((res : any)=>{
      this.totalJobs = res.count;
    })

    // this.loc.featued$.subscribe((res : any)=>{
    //   this.totalJobs = res.count;
    // })
  }

  submitClicked(){
    this.check = true;
    localStorage.setItem('search',this.search)

    let country : string = this.country.replace(' , ','-')
    let payload : string = valuesToPayload(this.search,country,'','',0,1)
    this.router.navigate(['/Jobs',payload])
  }

  rep(str : any)
  {
    return str.replace(/ /g,'-')
  }

  BendIt(Countries : any)
  {
    let k : string[] = []
    for(let count of Object.keys(Countries))
    {
      k.push(count)
      for(let little of Countries[count])
      {
        let countryWithCity = little + ' , ' + count;
        k.push(countryWithCity)
      }
    }
    return k;
  }

  inputGiven(ev: any) : void
  {
    if(this.country.length>1)
    {
      this.options = this.list.filter((val,ind)=>{
        return (val.toLowerCase().includes(this.country.toLowerCase()));
      })
    }
    else
    {
      this.options = this.list.filter((val,ind)=>{
        let temp = this.country.length;
        return (this.country.toLowerCase()===val.toLowerCase().slice(0,temp));
      })
    }
  }

}
