import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeafultLocService {

  private REST_API_SERVER = "https://ipinfo.io/?token=dbf414e483f306";

  private MY_SEREVER = "https://workire.com/api/";

  constructor(private httpClient: HttpClient) {}

  public getCountry(){
    return this.httpClient.get(this.REST_API_SERVER)
  }

  public getAllCountries(){
    return this.httpClient.get(this.MY_SEREVER + "company/getAllCountries");
  }

  public getAllCategories(){
    return this.httpClient.get(this.MY_SEREVER + "company/getAllCategories");
  }

  public getAllCompanies(){
    return this.httpClient.get(this.MY_SEREVER + "company/getAllCompanies");
  }

  public getAllCompany(){
    return this.httpClient.get(this.MY_SEREVER + "company/getAllCompany");
  }

  public getAllJobs(s : string, count : string, cat : string, comp : string, day : number, page : any) {
    return this.httpClient.post<any>(this.MY_SEREVER + "company/search",{'search' : s,'Country' : count, 'category' : cat, 'companies' : comp,'day': day,'page': page})
  }

  public jobById(str : any) {
    return this.httpClient.get(this.MY_SEREVER + "company/job/" + str)
  }

  public getAllPosts() {
    return this.httpClient.get(this.MY_SEREVER + "company/getallposts");
  }

  public getPostByCat(str : string) {
    return this.httpClient.get(this.MY_SEREVER + "company/getBlogCat/" + str);
  }

  public getPost(str : string) {
    return this.httpClient.get(this.MY_SEREVER + "company/getBlogURL/" + str);
  }

  public searchBlog(str : string)
  {
    return this.httpClient.post(this.MY_SEREVER + 'company/searchPosts',{'search':str})
  }

  public featured(str : string)
  {
    return this.httpClient.post(this.MY_SEREVER +'company/featured',{'search':str})
  }

  public get(str : string)
  {
    return this.httpClient.get(this.MY_SEREVER + str);
  }

  public seoCatBySeo(str : string)
  {
    let temp = str.replace('-',' ')
    return this.httpClient.post(this.MY_SEREVER + 'company/seoCatBySeo',{'category':temp})
  }

  public getAllSeoCat()
  {
    return this.httpClient.get(this.MY_SEREVER + 'company/getAllSeoCat')
  }

  public seoCat(str : string)
  {
    let data = {
      'category' : str
    }
    return this.httpClient.post(this.MY_SEREVER + 'company/seoCat',data);
  }

  public jobTitle(str : string)
  {
    return this.httpClient.post(this.MY_SEREVER + 'company/getJobByTitle',{'title':str})
  }

  public getCustomCountries()
  {
    let t = {
      'Bahrain' : ['Manama','Busaiteen','Muharraq'],
      'Kuwait' : ['Ahmadi','Kuwait City','Al Asimah'],
      'Oman' : ['Muscat','Sohar','Salalah'],
      'Qatar' : ['Al Khor','Al Wakrah','Doha','Umm Salal'],
      'Suadi Arabia' : ['Jeddah','Al Khobar','Yanbu','Al Jubail','Dhahran','Riyadh'],
      'United Arab Emirates' : ['Abu Dhabi','Dubai','Ajman','Sharjah','Ras al-Khaimah','Fujairah'],
      'Jordan' : ['Amman'],
      'Iraq' : ['Baghdad'],
    }
    return t;
  }
}
