import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router'
import { DeafultLocService } from '../deafult-loc.service';

@Component({
  selector: 'app-job-search',
  templateUrl: './job-search.component.html',
  styleUrls: ['./style.css']
})
export class JobSearchComponent implements OnInit {

  constructor(private router : Router,private loc: DeafultLocService,@Inject(PLATFORM_ID) private platformId: Object) {  }

  search : FormControl = new FormControl('')
  country : FormControl = new FormControl('')

  val : string = '';

  public check = false;
  public isMobile = false;
  public cat : string = "Jobs By Category";
  public catShow: boolean = false;
  public count : string = "Jobs By Country";
  public countShow : boolean = false;
  public categories: any = {};
  public countries: any = {};
  public seocat: any = {};
  public totalJobs : number = 0;


  ngOnInit(): void {
    this.check = false;
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }

    this.loc.getAllJobs('','','','',0,1)
    .subscribe(
      data =>{
        this.totalJobs = data.count;
      },
      err =>{
        console.log(err)
      }
    )
  }

  submitClicked(){
    this.check = true;
    if(!this.country.invalid)
    {
      localStorage.setItem('search',this.search.value)
      let temp = ''
      let temp2 = ''
      if(!this.country.value.length)
      {
        temp = 'country'
      }
      else
      {
        temp = this.country.value.replace(' , ','-');
      }
      if(!this.search.value.length)
      {
        temp2 = 'search'
      }
      else
      {
        temp2 = this.search.value
      }
      this.router.navigate(['/Jobs','find-job',temp2,temp,'category','company',0,1]);
    }
  }

  searchChange(ev : any)
  {
    console.log("search chnaged")
  }

  countChange(ev : any)
  {
    this.country.setValue(ev);
  }

  cateClicked(){
    if(this.cat == "Show less")
    {
      this.catShow = false;
      this.cat = "Jobs By Category";
    }
    else
    {
      this.catShow = true;
      this.cat = "Show less";
    }
  }

  countClicked(){
    if(this.count == "Show less")
    {
      this.countShow = false;
      this.count = "Jobs By Country";
    }
    else
    {
      this.countShow = true;
      this.count = "Show less";
    }
  }

  rep(str : any)
  {
    return str.replace(/ /g,'-')
  }

}
