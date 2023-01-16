import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { two_letter_to_full, SearchPayload, SeoPaths } from './Interfece';

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

  public getAllCompanyMore(more : number){
    return this.httpClient.post(this.MY_SEREVER + "company/getAllCompanyMore", {"more":more});
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

  public getAllJobsSearchPayload(payload : SearchPayload) {
    return this.httpClient.post<any>(this.MY_SEREVER + "company/search",payload)
  }

  public getFilterSuggestions(search : string) {
    if(search.length)
    {
      return this.httpClient.get(this.MY_SEREVER + "company/getFilterSuggestions/"+ search)
    }
    else
    {
      return this.httpClient.get(this.MY_SEREVER + "company/getFilterSuggestions")
    }
  }

  public JobSeoObject(paths : SeoPaths, variable : string) {
    let data = {
      ...paths,
      'variable' : variable
    }
    return this.httpClient.post(this.MY_SEREVER + "company/JobSeoObject",data)
  }

  public jobById(jobID : number) {
    return this.httpClient.get(this.MY_SEREVER + `company/job/${jobID}`)
  }

  public jobTitle(str : string)
  {
    return this.httpClient.post(this.MY_SEREVER + 'company/getJobByTitle',{'title':str})
  }

  public featured(str : string)
  {
    return this.httpClient.post(this.MY_SEREVER +'company/featured',{'search':str})
  }

  public getAllJobBlogs() {
    return this.httpClient.get(this.MY_SEREVER + "company/jobBlogs");
  }

  public getJobBlogPost(slug : string) {
    return this.httpClient.get(this.MY_SEREVER + "company/getJobBlogBySlug/" + slug);
  }

  public searchJobBlog(search : string) {
    return this.httpClient.get(this.MY_SEREVER + "company/searchJobBlogs/" + search);
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

  public totalJobCount()
  {
    return this.httpClient.get(this.MY_SEREVER + 'company/TotalJobCount')
  }

  // Handling Featured
  _featued = new BehaviorSubject<any>({
    country : "",
    company : [],
    data : [],
    count : 50000
  })

  featued$ = this._featued.asObservable();

  get featued(): any {
    return this._featued.getValue();
  }

  set featued(val: any) {
    this._featued.next(val);
  }

  initFeatured_and_Country_and_count() {
    if(!this.featued.data.length) {
      this.httpClient.get("https://ipinfo.io/?token=dbf414e483f306").toPromise()
      .then((res : any)=>{
        try {
          let country = "",count = 50000, data = []
          country = two_letter_to_full(res.country)
          this.httpClient.get(this.MY_SEREVER + `company/FeaturedJobFrontPage/${country}`).toPromise()
          .then((feature : any)=>{
            count = feature.count;
            data = feature.data
            this.featued = {
              country : country,
              data : data,
              count : count
            }
          })
          .catch()
        }
        catch(err){

        }
      })
      .catch()
    }
  }
}
