import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FilterValueService } from '../filter-value.service';
import { Filters } from '../Interfece'

@Component({
  selector: 'app-job-list-filter',
  templateUrl: './job-list-filter.component.html',
  styleUrls: ['./job-list-filter.component.css']
})
export class JobListFilterComponent implements OnInit {

  search : string = ''

  country : string = ''
  countryList : any[] = []

  category : string = ''
  catList : any[] = []

  company : string = ''
  compList : any[] = []

  days : number = 0;

  filterChips : any = {}

  mobileObj : any;
  mobInp : string = '';
  MobileFilters : any[] = [];
  selectedFilter : string = 'search';

  public parseObj = Object.keys

  @Input() all : any;
  @Input() toggleView : boolean = false;
  isMobile : boolean = false;

  timeFilter : any = {
    'Anytime' : 0,
    'A day ago' : 1,
    'A week ago' : 7,
    'within 15 days' : 15,
    'A month ago' : 30
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private filter : FilterValueService) {
  }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width <= 768;
    }

    this.filter.filter$.subscribe((res : Filters ) =>{
      this.filterChips = {
        search : this.filterEmpty(res.search),
        location_on : this.filterEmpty(res.country),
        category : this.filterEmpty(res.category),
        home : this.filterEmpty(res.company)
      }
      this.days = res.days;
    })
    this.countryList = Object.keys(this.all.Countrycount)
    this.catList = Object.keys(this.all.categorycount)
    this.compList = Object.keys(this.all.companiescount)
    this.mobileObj = {
      search : {
        icon : "search",
        placeholder: "Job Title or keyword",
        list : []
      },
      country : {
        icon : "location_on",
        placeholder : "City or Country",
        list : this.countryList
      },
      category : {
        icon : "category",
        placeholder : "Category Keywords",
        list : this.catList
      },
      company : {
        icon : "home",
        placeholder : "Company Keyword",
        list : this.compList
      },
      time : {
        icon : "schedule",
        placeholder : "Time",
        list : Object.keys(this.timeFilter)
      }
    };
    this.MobileFilters = this.parseObj(this.mobileObj);
  }

  selcted(str : string)
  {
    this.selectedFilter = str;
  }

  retOptions(list : any[],str : string) : any[]
  {
    let options : any[] = []
    if(str.length>1)
    {
      options = list.filter((val,ind)=>{
        return (val.toLowerCase().includes(str.toLowerCase()));
      })
    }
    else
    {
      options = list.filter((val,ind)=>{
        let temp = str.length;
        return (str.toLowerCase()===val.toLowerCase().slice(0,temp));
      })
    }
    return options;
  }

  filterEmpty(str : string) : string[]
  {
    let t : string[] = str.split(',')
    t = t.filter((val)=>{return val.length});
    return t;
  }

  removeChip(item : string,chip : string)
  {
    switch(item) {
      case "search":
        this.filter.removeSearch(chip);
        break;
      case "location_on":
        this.filter.removeCountry(chip);
        break;
      case "category":
        this.filter.removeCategory(chip);
        break;
      case "home":
        this.filter.removeCompany(chip);
        break;
    }
  }

  applyFilter()
  {
    if(this.search.length)
    {
      this.filter.addSearch(this.search);
      this.search = '';
    }
    if(this.country.length)
    {
      this.filter.addCountry(this.country);
      this.country = '';
    }
    if(this.category.length)
    {
      this.filter.addCategory(this.category);
      this.category = '';
    }
    if(this.company.length)
    {
      this.filter.addCompany(this.company);
      this.company = '';
    }
  }

  mobileApply() {
    switch(this.selectedFilter) {
      case "search":
        this.filter.addSearch(this.mobInp);
        break;
      case "country":
        this.filter.addCountry(this.mobInp);
        break;
      case "category":
        this.filter.addCategory(this.mobInp);
        break;
      case "company":
        this.filter.addCompany(this.mobInp);
        break;
      case "time":
        if(Object.keys(this.timeFilter).includes(this.mobInp))
        {
          this.filter.setTime(this.timeFilter[this.mobInp])
        }
        else
        {
          this.mobInp = ''
        }
        break;
    }
  }

  setTime()
  {
    this.filter.setTime(this.days);
  }
}
