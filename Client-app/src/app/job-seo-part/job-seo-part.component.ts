import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeafultLocService } from '../api-call.service';
import { FilterValueService } from '../filter-value.service';
import { getPayloadByRoute, SearchPayload, getMonthAndYear, SeoObject, pathMatcher, SeoPaths, toProperCase } from '../Interfece'
import { environment } from '../../environments/environment';
import { SeoServiceService } from '../seo-service.service';

@Component({
  selector: 'app-job-seo-part',
  templateUrl: './job-seo-part.component.html',
  styleUrls: ['./job-seo-part.component.css']
})
export class JobSeoPartComponent implements OnInit {

  seoObject : SeoObject[] = []
  valid : boolean = false;

  FilterData : any = {}

  domain : string = environment.APIEndpoint;

  @Input() data : any = {};

  constructor(private route : Router,private filter : FilterValueService,private loc : DeafultLocService,private seo : SeoServiceService, private active : ActivatedRoute) { }

  ngOnInit(): void {
    this.active.paramMap
    .subscribe((params : any)=>{
      let payload = params.get("payload")!
      let variable = params.get("var")!

      if(this.data) this.valid = this.data.count;

      let values : SearchPayload = getPayloadByRoute(this.route.url,payload,variable)

      this.loc.getFilterSuggestions(values.search).subscribe(
        (data : any) =>{
          this.FilterData = data;
          this.dataGenerate(values, payload, variable);
        }
      )

      this.dataGenerate(values, payload, variable);
    })
  }

  dataGenerate(payload : SearchPayload, payload_from_url : string, variable : string)
  {
    this.seoObject = []
    let paths : SeoPaths = pathMatcher(this.route.url,payload_from_url);
    let main : string = ''
    let count : number = 0
    let category : string = ''
    let country : string = ''
    let company : string = ''
    let job : string = ''

    let JobsButCountrySelected = (paths.isJobs && payload.country.length)

    try {
      let len = this.data.data.length;
      let jobData = this.data.data.slice(len-2,len).map((job : any)=>{
        return job.Position;
      })
      job = this.reduceToLinks(jobData,'/Job')
    }
    catch {
      job = ''
    }

    if(this.data) {
      count = this.data.count;
    }

    if(Object.keys(this.FilterData).length) {
      let temp = Object.keys(this.FilterData['categorycount']).slice(0,5);
      category =  this.reduceToLinks(temp, '/Job-category')
      temp = Object.keys(this.FilterData['Countrycount']).slice(0,5);
      country =  this.reduceToLinks(temp, '/Job-country')
      temp = Object.keys(this.FilterData['companiescount']).slice(0,5);
      company =  this.reduceToLinks(temp, '/Job-company')
    }

    if (paths.isJobs) {
      let temp : string = payload.country.length ? `in ${payload.country}` : '';
      main = payload.search + ' Jobs ' + temp;
    }
    else {
      if(paths.isCountry) {
        let splited = variable.split("-");
        if(splited.length>1) {
          variable = splited[0]; 
        }
      }
      main = variable.toLowerCase().includes('jobs') ? variable : variable + ' Jobs';
    }

    main = toProperCase(main.replace(/-/g,' '))

    if(paths.isCategory || paths.isCompany || paths.isCountry || paths.isPosition || paths.isTrending) {
      let new_var : string = paths.isCountry ? payload.country : variable;
      this.loc.JobSeoObject(paths, new_var).toPromise()
      .then((res : any)=>{
        let data : any = res.data;
        if(data.show_seo) {
          this.HandleSpecialSeo(paths,main,payload, data);
        } else {
          this.setSeoForPage(paths,main,payload);
        }
      })
      .catch((err : any) => this.setSeoForPage(paths,main,payload))
    } else {
      this.setSeoForPage(paths,main,payload);
    }

    let seo_one : SeoObject = {
      header: `What should I search on Workire to find ${main}?`,
      description: `People who usually search for ${main} also look for ${category}. If you're getting few results, try a more general search term. Using a more generic term can help you land an advanced list of vacancies that suit your qualifications. If you're getting irrelevant result, try a more narrow and specific term.`,
      show: false
    }
    this.seoObject.push(seo_one);

    let seo_two : SeoObject = {
      header: `How many ${main} are available in Workire?`,
      description: `There are almost ${count} ${main} available on workire.com right now. We keep a fair database of various job vacancies and the list of specific ones can easily be searched by typing the keyword in the respective tabs.`,
      show: false
    }
    this.seoObject.push(seo_two);

    let seo_3 : SeoObject = {
      header: `Who are the top companies hiring for ${main}`,
      description: `There are many companies advertising ${main} including ${company}. Since, we post vacancies on our website daily, it’s necessary to be regularly updated with the list for the names of top companies that are hiring keep changing.`,
      show: false
    }
    if(!paths.isCompany) this.seoObject.push(seo_3);

    let seo_4 : SeoObject = {
      header: "Where are the majority of these jobs being advertised?",
      description: `You can find the majority of ${main} in ${country}. You can easily assess the list on each locations to finalize what you really have to choose to apply.`,
      show: false
    }
    if(!paths.isCountry && !JobsButCountrySelected)  this.seoObject.push(seo_4);
    
    // Removed for all on request
    // let seo_5 : SeoObject = {
    //   header: `What other similar jobs are there to ${main}?`,
    //   description: `As well as ${main} vacancies, you can find ${job} roles on workire.com, amongst many others. Although there might be slight changes in the names of positions, there can be a number of jobs that share the same responsibilities and qualifications. Hence, using a more general term as the keyword seems to be desirable in getting a long list of vacancies.`,
    //   show: false
    // }
    // if(!paths.isCompany && !paths.isCountry && !JobsButCountrySelected) this.seoObject.push(seo_5);

    let seo_6 : SeoObject = {
      header: "How to make an ATS resume?",
      description: "ATS or the Applicant Tracking System is the most commonly used software these days for the efficient management of the application process. Workire offers ATS friendly resume builder to help the job seekers get the perfect resume for the job hunt.",
      show: false
    }
    this.seoObject.push(seo_6);
  }

  setSeoForPage(paths : SeoPaths, main : string, payload : SearchPayload) {
    let title = '', desc = ''
    if(paths.isCountry) {
      main = main.replace('Jobs','').replace('Job','').replace('jobs','').replace('job','')
      title = `Jobs in ${main} (${getMonthAndYear()}) | Workire`
      desc = `Apply for the best jobs in ${main}.New careers in ${main} are added daily on Workire.com. Apply quickly to various ${main} job openings that are hiring near you`
    }
    else if(paths.isTrending) {
      title = `${main} (with Salaries) ${getMonthAndYear()} | Workire`
      desc = `Top ${main}. Many new job vacancies updated daily. Get one step closer to your dream job by easily browsing and applying to various jobs on platform.`
    }
    else {
      title = `${main} (with Salaries) ${getMonthAndYear()} | Workire`
      desc = `Check out best ${main} vacancies with eligibility, location, salary etc. ${main} vacancies & careers in top companies`
    }
    this.updatePageSeo(title,main,desc,payload);
  }

  updatePageSeo(title : string, header : string,desc : string,fil : SearchPayload)
  {
    let SeoLoc = (fil.country.length!=0) ? ("in " + fil.country.split(',').join(' , ')) : ''

    let keywords = `${header},new ${header},${fil.search} Job ${SeoLoc},${fil.search} Job opportunity ${SeoLoc},${fil.search} Job openings ${SeoLoc}`
    let url = this.domain + this.route.url
    let type = 'job'

    this.seo.updateSeo(title,desc,keywords,type,url);
    this.seo.createCanonicalURL(url);
  }

  reduceToLinks(arr : any[], linkStart: string) {
    let reduced : string = '';
    for(let i of arr)
    {
      if(i==arr[arr.length-1])
      {
        reduced += `and <a href='${linkStart}/${i}'>${i}</a>`
      }
      else
      {
        reduced += ` <a href='${linkStart}/${i}'>${i}</a>, `
      }
    }
    return reduced;
  }

  HandleSpecialSeo(paths : SeoPaths, main : string, payload : SearchPayload, data : any) {
    let title = '', desc = ''
    if(paths.isCountry) {
      main = main.replace('Jobs','').replace('Job','').replace('jobs','').replace('job','')
      title = `Jobs in ${main} (${getMonthAndYear()}) | Workire`
      desc = `Apply for the best jobs in ${main}.New careers in ${main} are added daily on Workire.com. Apply quickly to various ${main} job openings that are hiring near you`
    }
    else if(paths.isTrending) {
      title = `${main} (with Salaries) ${getMonthAndYear()} | Workire`
      desc = `Top ${main}. Many new job vacancies updated daily. Get one step closer to your dream job by easily browsing and applying to various jobs on platform.`
    }
    else {
      title = `${main} (with Salaries) ${getMonthAndYear()} | Workire`
      desc = `Check out best ${main} vacancies with eligibility, location, salary etc. ${main} vacancies & careers in top companies`
    }

    let SeoLoc = (payload.country.length!=0) ? ("in " + payload.country.split(',').join(' , ')) : ''

    let keywords = `${main},new ${main},${payload.search} Job ${SeoLoc},${payload.search} Job opportunity ${SeoLoc},${payload.search} Job openings ${SeoLoc}`
    let url = this.domain + this.route.url
    let type = 'job'

    title = data.seo_title ? data.seo_title : title;
    desc = data.seo_description ? data.seo_description : desc;
    keywords = data.seo_keywords ? data.seo_keywords : keywords;

    this.seo.updateSeo(title,desc,keywords,type,url);
    this.seo.createCanonicalURL(url);
  }

  showClick(i : number)
  {
    this.seoObject[i].show = !this.seoObject[i].show;
  }
}