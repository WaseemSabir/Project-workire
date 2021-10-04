import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FilterValueService } from '../filter-value.service';
import { Filters } from '../Interfece'
import { ActivatedRoute, Router} from '@angular/router';
import { DeafultLocService } from '../deafult-loc.service';

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

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private filter : FilterValueService, private activatedRoute : ActivatedRoute,private route : Router,private loc : DeafultLocService) {
  }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width <= 768;
    }

    this.activatedRoute.paramMap.subscribe((params : any)=>{
      let payload = params.get("payload")!
      let search : string= "",country : string="",category : string="",company : string="",days = 0, page = 1
      
      if(payload)
      {
        let output = this.filter.payloadToValues(payload);
        search = output.search!
        country = output.country!
        category = output.category!
        company = output.company!
        days = output.days!
        page = output.page!
      }

      this.filter.setFilterCustom(search,country,category,company,days,page);

      this.filterChips = {
        search : this.filterEmpty(search),
        location_on : this.filterEmpty(country),
        category : this.filterEmpty(category),
        home : this.filterEmpty(company)
      }
      this.days = days;

      this.loc.getFilterSuggestions(search).toPromise()
      .then((res : any)=>{
        this.countryList = Object.keys(res.Countrycount)
        this.catList = Object.keys(res.categorycount)
        this.compList = Object.keys(res.companiescount)
        this.initMobileFilters();
      }) 
      this.initMobileFilters();
    })
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
    this.routeRefresh()
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
    
    this.routeRefresh()
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
    
    this.routeRefresh();
  }

  routeRefresh()
  {
    let payload = ""
    this.filter.filter$.subscribe((res : Filters)=>{
      payload = this.filter.valuesToPayload(res.search,res.country,res.category,res.company,res.days,res.page)
      this.route.navigate(['/Jobs',payload])
    })
  }

  setTime()
  {
    this.filter.setTime(this.days);
  }

  initMobileFilters() {
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
}
