import { keyframes } from '@angular/animations';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRadioModule } from '@angular/material/radio';
import { ActivatedRoute, Router } from '@angular/router';
import { DeafultLocService } from '../deafult-loc.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-job-list-filter',
  templateUrl: './job-list-filter.component.html',
  styleUrls: ['./job-list-filter.component.css']
})
export class JobListFilterComponent implements OnInit {

  search : string = 'search';
  country : string = 'country';
  category : string = 'category';
  company : string = 'company';
  time : number = 0;
  keys = Object.keys
  
  // For Time Filter
  timeStr : string = '';
  public timeValues : any[] = [
    {
      val : 0,
      str : 'Any',
      checked : false
    },
    {
      val : 30,
      str : 'Past Month',
      checked : false
    },
    {
      val : 7,
      str : 'Past Week',
      checked : false
    },
    {
      val : 1,
      str : 'Past 24 Hours',
      checked : false
    }
  ]

  // Company
  compCount : number = 0;
  companies : any;

  // Country
  cCount : number = 0;
  countries : any;
  private list : string[] = ['Iraq','Bahrain','Manama , Bahrain','Busaiteen , Bahrain','Muharraq , Bahrain','Kuwait','Ahmadi , Kuwait','Kuwait City , Kuwait','Al Asimah , Kuwait','Oman','Muscat , Oman','Sohar , Oman','Salalah , Oman','Qatar','Al Khor , Qatar','Al Wakrah , Qatar','Doha , Qatar','Umm Salal , Qatar','Suadi Arabia','Jeddah , Suadi Arabia','Al Khobar , Suadi Arabia','Yanbu , Suadi Arabia','Al Jubail , Suadi Arabia','Dhahran , Suadi Arabia','Riyadh , Suadi Arabia','United Arab Emirates','Abu Dhabi , United Arab Emirates','Dubai , United Arab Emirates','Ajman , United Arab Emirates','Sharjah , United Arab Emirates','Ras al-Khaimah , United Arab Emirates','Fujairah , United Arab Emirates','Jordan','Amman , Jordan'];

  // Category
  catCount : number = 0;
  categories : any;

  constructor(private activatedRoute: ActivatedRoute,private route: Router,private loc : DeafultLocService,@Inject(PLATFORM_ID) private platformId: Object) {
  }
  public parseObj = Object.keys

  @Input() all : any;
  isMobile : boolean = false;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if(this.route.url.split('/').includes('Jobs') && this.route.url.split('/').length >3)
      {
        this.country = params.get('country')!
        this.search = params.get('search')!
        this.category = params.get('category')!
        this.company = params.get('company')!
        this.time = +params.get('days')!
      }
      else if(this.route.url.split('/').includes('Job-country'))
      {
        this.search = 'search';
        this.country = params.get('count')!
        this.category = 'category';
        this.company = 'company';
        this.time = 0;
      }
      else if(this.route.url.split('/').includes('Job-company'))
      {
        this.search = 'search';
        this.country = 'country'
        this.category = 'category';
        this.company = params.get('comp')!
        this.time = 0;
      }
      else if(this.route.url.split('/').includes('Job-category'))
      {
        this.search = 'search';
        this.country = 'country';
        this.category = 'category';
        this.company = 'company';
        this.time = 0;
      }
      else
      {
        this.search = 'search';
        this.country = 'country';
        this.category = 'category';
        this.company = 'company';
        this.time = 0;
      }

      if(isPlatformBrowser(this.platformId))
      {
        this.isMobile = screen.width < 768;
      }

      if(this.all)
      {
      
        // sets values for time filter
        this.timeSet()

        // to set companies
        if(this.all.companiescount)
        {
          this.compSet() 
        }

        // set country
        this.countrySet()

        if(this.all.categorycount)
        {
          this.catSet()
        }
      }

      this.search = (this.search=="search") ? ('') : (this.search)
      this.company = (this.company=="company") ? ('') : (this.company)
      this.category = (this.category=="category") ? ('') : (this.category)
      this.country = (this.country=="country") ? ('') : (this.country)
    });
  }

  // extra fun
  readyToRoute() 
  {
    this.search = (this.search=='') ? 'search' : this.search;
    this.company = (this.company=='') ? 'company' : this.company;
    this.category = (this.category=='') ? 'category' : this.category;
    this.country = (this.country=='') ? 'country' : this.country;
  }

  gap(i : string)
  {
    return i.replace(' , ','-')
  }

  ungap(i : string)
  {
    return i.replace('-',' , ')
  }

  // Time Functions
  timeClick(i : number) {
    this.readyToRoute();
    this.route.navigate(['/Jobs','find-job',this.search,this.country,this.category,this.company,i,1]);
  }

  timeSet() {
    this.timeValues = this.timeValues.map((k)=>{
      if(this.time===k.val)
      {
        k.checked = true;
        return k;
      }
      else
      {
        k.checked = false;
        return k;
      }
    })
    if(this.time===0)
    {
      this.timeStr = "Date Posted";
    }
    else
    {
      for(let k of this.timeValues)
      {
        if(k.val===this.time)
        {
          this.timeStr=k.str;
        }
      }
    }
  }


  // Company Functions
  compSet() {
    this.company = (this.company=='company') ? '' : this.company; 
    let temp = this.company.split(',')
    temp = temp.filter((val)=>{return (val!=="")})
    this.compCount = temp.length;
    let tim : any = {};
    for(let k of Object.keys(this.all.companiescount))
    {
      tim[k] = temp.includes(k);
    }
    this.companies = tim;
  }

  compClick(k : any)
  {
    this.company = (this.company=='company') ? '' : this.company; 
    let temp = this.company.split(',')
    let check = temp.includes(k)
    temp = temp.filter((val)=>{return (val!=="" && val!==k)})
    if(!check)
    {
      temp.push(k);
    }
    console.log(temp)
    this.company = temp.join(',')

    this.readyToRoute();
    this.route.navigate(['/Jobs','find-job',this.search,this.country,this.category,this.company,this.time,1]);
  }


  // Country Functions
  countrySet() {
    this.country = (this.country=='country') ? '' : this.country; 
    let temp = this.country.split(',')
    temp = temp.map((val)=>{
      return this.ungap(val);
    })
    temp = temp.filter((val)=>{return (val!=="")})
    this.cCount = temp.length;
    let tim : any = {};
    for(let k of this.list)
    {
      tim[k] = temp.includes(k);
    }
    this.countries = tim;
  }

  countryClick(k : any)
  {
    this.country = (this.country=='country') ? '' : this.country; 
    let temp = this.country.split(',')
    temp = temp.map((val)=>{
      return this.ungap(val);
    })
    let check = temp.includes(k)
    temp = temp.filter((val)=>{return (val!=="" && val!==k)})
    if(!check)
    {
      temp.push(k);
    }
    temp = temp.map((val)=>{
      return this.gap(val);
    })
    this.country = temp.join(',')

    this.readyToRoute();
    this.route.navigate(['/Jobs','find-job',this.search,this.country,this.category,this.company,this.time,1]);
  }

  // category Functions
  catSet() {
    this.category = (this.category=='category') ? '' : this.category; 
    let temp = this.category.split(',')
    temp = temp.filter((val)=>{return (val!=="")})
    console.log()
    this.catCount = temp.length;
    let tim : any = {};
    for(let k of Object.keys(this.all.categorycount))
    {
      tim[k] = temp.includes(k);
    }
    this.categories = tim;
  }

  catClick(k : any)
  {
    this.category = (this.category=='category') ? '' : this.category; 
    let temp = this.category.split(',')
    let check = temp.includes(k)
    temp = temp.filter((val)=>{return (val!=="" && val!==k)})
    if(!check)
    {
      temp.push(k);
    }
    this.category = temp.join(',')

    this.readyToRoute();
    this.route.navigate(['/Jobs','find-job',this.search,this.country,this.category,this.company,this.time,1]);
  }

}
