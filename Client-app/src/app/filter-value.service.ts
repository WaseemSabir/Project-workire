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
    this.filter = {
      search : '',
      country : '',
      company : '',
      category : '',
      days : 0,
      page : 1
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
}