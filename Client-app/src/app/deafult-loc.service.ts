import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeafultLocService {

  constructor(private httpClient: HttpClient) {}
  
  private MY_SEREVER = environment.APIEndpoint + "/api/";

  _countries = new BehaviorSubject<any>({});
  countries = this._countries.asObservable();

  _categories : any;

  _positions = new BehaviorSubject<any>({});
  positions = this._positions.asObservable();

  public getAllCompanies(){
    return this.httpClient.get(this.MY_SEREVER + "company/getAllCompanies");
  }

  public getFeaturedCompanies(){
    return this.httpClient.get(this.MY_SEREVER + "company/getFeaturedCompanies");
  }

  public getAllCompany(){
    return this.httpClient.get(this.MY_SEREVER + "company/getAllCompany");
  }

  public seoCatBySeo(str : string)
  {
    let temp = str.replace('-',' ')
    return this.httpClient.post(this.MY_SEREVER + 'company/seoCatBySeo',{'category':temp})
  }

  public getAllSeoCat()
  {
    return this.httpClient.get(this.MY_SEREVER + 'company/getAllSeoCat');
  }

  public seoCat(str : string)
  {
    let data = {
      'category' : str
    }
    return this.httpClient.post(this.MY_SEREVER + 'company/seoCat',data);
  }

  public getCustomCountries()
  {
    return this.httpClient.get(this.MY_SEREVER + 'company/getCountries');
  }

  public getPositions()
  {
    return this.httpClient.get(this.MY_SEREVER + 'company/getDesignation')
  }

  public getTrendingSearches()
  {
    return this.httpClient.get(this.MY_SEREVER + 'company/getTrendingSearch')
  }

  // Job related Reterival from Server
  public getAllJobs(s : string, count : string, cat : string, comp : string, day : number, page : any) {
    return this.httpClient.post<any>(this.MY_SEREVER + "company/search",{'search' : s,'Country' : count, 'category' : cat, 'companies' : comp,'day': day,'page': page})
  }

  public getFilterSuggestions(search : string) {
    return this.httpClient.post<any>(this.MY_SEREVER + "company/getFilterSuggestions",{'search' : search})
  }

  public jobById(str : any) {
    return this.httpClient.get(this.MY_SEREVER + "company/job/" + str)
  }

  public jobTitle(str : string)
  {
    return this.httpClient.post(this.MY_SEREVER + 'company/getJobByTitle',{'title':str})
  }

  public featured(str : string)
  {
    return this.httpClient.post(this.MY_SEREVER +'company/featured',{'search':str})
  }

  // To get the Blog Posts
  public getAllPosts() {
    return this.httpClient.get(this.MY_SEREVER + "company/getallposts");
  }

  public getPost(str : string) {
    return this.httpClient.get(this.MY_SEREVER + "company/getBlogURL/" + str);
  }

  public searchBlog(str : string)
  {
    return this.httpClient.post(this.MY_SEREVER + 'company/searchPosts',{'search':str})
  }

  // To get the users location via reverse ip, not used anymore
  // private REST_API_SERVER = "https://ipinfo.io/?token=dbf414e483f306";
  // public getCountry(){
  //   return this.httpClient.get(this.REST_API_SERVER)
  // }

  // To get posts in a category, not used any more
  // public getPostByCat(str : string) {
  //   return this.httpClient.get(this.MY_SEREVER + "company/getBlogCat/" + str);
  // }

  // To get countries with jobs in each country
  // public getAllCountries() {
  //   return this.httpClient.get(this.MY_SEREVER + "company/getAllCountries");
  // }

  // public getAllCategories(){
  //   return this.httpClient.get(this.MY_SEREVER + "company/getAllCategories");
  // }
}
