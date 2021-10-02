import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Filters, Job } from './Interfece'

@Injectable({
  providedIn: 'root'
})
export class FilterValueService {

  constructor() { }

  temp : Filters = {
    search : '',
    country : '',
    company : '',
    category : '',
    days : 0,
    page : 1
  }

  _filter = new BehaviorSubject<Filters>(this.temp)

  filter$ = this._filter.asObservable();

  get filter(): Filters {
    return this._filter.getValue();
  }

  set filter(val: Filters) {
    this._filter.next(val);
  }

  refresh() {
    // this.filter = {
    //   search : '',
    //   country : '',
    //   company : '',
    //   category : '',
    //   days : 0,
    //   page : 1
    // };
  }

  setFilterCustom(search : string, country : string, category : string, company : string,daysAgo : number, page: number) {
    this.filter = {
      search : search,
      country : country,
      company : company,
      category : category,
      days : daysAgo,
      page : page
    };
  }

  addSearch(str : string ) {
    let temp : Filters = this.filter;
    let arr = temp.search.split(',')
    arr.push(str);
    arr = arr.filter((val)=>{return val.length});
    temp.search = arr.join(',');
    this.filter = temp;
  }

  addCountry(str : string) {
    let temp : Filters = this.filter;
    let arr = temp.country.split(',')
    arr.push(str.replace(' , ','-'))
    arr = arr.filter((val)=>{return val.length});
    temp.country = arr.join(',')
    this.filter = temp;
  }

  addCompany(str : string ) {
    let temp : Filters = this.filter;
    let arr = temp.company.split(',')
    arr.push(str);
    arr = arr.filter((val)=>{return val.length});
    temp.company = arr.join(',');
    this.filter = temp;
  }

  addCategory(str : string ) {
    let temp : Filters = this.filter;
    let arr = temp.category.split(',');
    arr.push(str);
    arr = arr.filter((val)=>{return val.length});
    temp.category = arr.join(',');
    this.filter = temp;
  }

  removeSearch(str : string) {
    let temp : Filters = this.filter;
    let arr = temp.search.split(',')
    arr = arr.filter((val)=>{
      return val!=str;
    })
    temp.search = arr.join(',');
    this.filter = temp;
  }

  removeCountry(str : string) {
    let temp : Filters = this.filter;
    let arr = temp.country.split(',')
    str = str.replace(' , ','-')
    arr = arr.filter((val)=>{
      return val!=str;
    })
    temp.country = arr.join(',');
    this.filter = temp;
  }

  removeCompany(str : string) {
    let temp : Filters = this.filter;
    let arr = temp.company.split(',')
    arr = arr.filter((val)=>{
      return val!=str;
    })
    temp.company = arr.join(',');
    this.filter = temp;
  }

  removeCategory(str : string) {
    let temp : Filters = this.filter;
    let arr = temp.category.split(',')
    arr = arr.filter((val)=>{
      return val!=str;
    })
    temp.category = arr.join(',');
    this.filter = temp;
  }

  setTime(days : number) {
    let temp : Filters = this.filter;
    temp.days = days;
    this.filter = temp;
  }

  setPage(page : number) {
    if(page > 0)
    {
      let temp : Filters = this.filter;
      temp.page = page;
      this.filter = temp;
    }
  }

  _title = new BehaviorSubject<Job>({title:'',id:0})
  title$ = this._title.asObservable();

  get title(): Job {
    return this._title.getValue();
  }

  set title(val: Job) {
    this._title.next(val);
  }

  setTitle(str : string,idents : number)
  {
    let temp : Job = {
      title : str,
      id : idents
    };
    this.title = temp;
  }

  private messageSource = new BehaviorSubject<any[]>([]);
  currentMessage = this.messageSource.asObservable();

  changeMessage(data : any[]) {
    this.messageSource.next(data);
  }


  // Route Payloads
  payloadToValues(payload : string)
  {
    let search : string = "" , country : string = "", category : string = "", company : string = ""
    let days = 0
    let page = 1

    // search:Engineer&country:Qatar&category:Hello&company:bro&days:10&page:10
    let splited = payload.split("&")
    
    splited.forEach((each : any)=>{
      if(each.includes("search:")) search = each.replace("search:","")
      else if(each.includes("country:")) country = each.replace("country:","")
      else if(each.includes("category:")) category = each.replace("category:","")
      else if(each.includes("company:")) company = each.replace("company:","")
      else if(each.includes("days:")){ 
        if(Number(each.replace("days:",""))) days = Number(each.replace("days:",""))
      }
      else if(each.includes("page:")){ 
        if(Number(each.replace("page:",""))) page = Number(each.replace("page:",""))
      }
      else console.log("Ignored!")
    })
    return {
      search : search,
      country : country,
      company : company,
      category : category,
      days : days,
      page : page
    };
  }

  valuesToPayload(search : string, country : string, category : string, company : string,daysAgo : number, page: number)
  {
    let payload = ""
    if (search.length) payload +=`search:${search}&`
    if (country.length) payload +=`country:${country}&`
    if (category.length) payload +=`category:${category}&`
    if (company.length) payload +=`company:${company}&`
    payload +=`days:${daysAgo}&`
    payload +=`page:${page}`
    return payload
  }
}