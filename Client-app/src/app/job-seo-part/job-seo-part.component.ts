import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeafultLocService } from '../api-call.service';
import { FilterValueService } from '../filter-value.service';
import { getPayloadByRoute, SearchPayload, getMonthAndYear } from '../Interfece'
import { environment } from '../../environments/environment';
import { SeoServiceService } from '../seo-service.service';

@Component({
  selector: 'app-job-seo-part',
  templateUrl: './job-seo-part.component.html',
  styleUrls: ['./job-seo-part.component.css']
})
export class JobSeoPartComponent implements OnInit {

  header : string = ''
  headerDesc : string = ''
  header2 : string = ''
  list2 : any[] = []
  header3 : string = ''
  list3 : any[] = []
  firstTime : boolean = true;
  show : boolean[] = [false,false,false]
  valid : boolean = false

  domain : string = environment.APIEndpoint;

  @Input() data : any = {};

  constructor(private route : Router,private filter : FilterValueService,private loc : DeafultLocService,private seo : SeoServiceService, private active : ActivatedRoute) { }

  ngOnInit(): void {
    this.active.paramMap
    .subscribe((params : any)=>{
      let payload = params.get("payload")!
      let variable = params.get("var")!

      let values : SearchPayload = getPayloadByRoute(this.route.url,payload,variable)
    })
  }

  dataGenerate(fil : SearchPayload)
  {
    let checking = false;
    if(!this.firstTime || this.route.url=='/Jobs' || this.route.url.includes('Job-search'))
    {
      let SeoLoc = (fil.country.length!=0) ? ("in " + fil.country.split(',').join(' , ')) : '';
      let search = fil.search;
      this.header =  `More about ${search} Jobs ${SeoLoc}`
      this.headerDesc = `Many ${search} jobs ${SeoLoc} are available in many fields, by top employers.`
      this.header2 = `What type of ${search} jobs in ${SeoLoc} are available?`
      this.header3 = `Who are the top companies hiring for ${search} Jobs in ${fil.country}?`
      let desc = "Top " + search + 'Jobs' + SeoLoc + ".  Many new " + search + 'Jobs' + SeoLoc + " are updated daily. Get one step closer to your dream job by easily browsing and applying to various jobs on platform."
      this.updatePageSeo(`Find latest ${search} Jobs ${SeoLoc}`,desc,fil)
      checking = true
    }
    else
    {
      if(this.route.url.includes('Job-country'))
      {
        this.header = `More About jobs in ${fil.country}`;
        this.headerDesc = `There are many open jobs offered by different companies in ${fil.country}.`
        this.header2 = `What type of  jobs in ${fil.country} are available?`
        this.header3 = `Who are the top companies hiring for Jobs in ${fil.country}?`
        checking = true;

        this.updatePageSeo(`Jobs in ${fil.country}`,this.headerDesc,fil);
      }
      else if(this.route.url.includes('Job-category'))
      {
        let k = this.route.url.split('/');
        let p = k.slice(k.length-1,k.length)[0].replace(/-/g,' ')
        this.header = `More about ${p}`;
        this.headerDesc = `Many ${p} are being offered in different locations by different employers.Browse and apply easily`
        this.header2 = `Similar Categories to ${p}`
        this.header3 = `Who are the top companies hiring for ${p}? `
        checking = true;

        this.updatePageSeo(`${p}`,this.headerDesc,fil);
      }
      else if(this.route.url.includes('Job-company'))
      {
        let p = fil.company;
        this.header = `More about ${p}`;
        this.headerDesc = `Jobs in many differnt categories are being offered by ${p}. Easily browse and apply!`
        this.header2 = `People looking for jobs in ${p} also search for `
        this.header3 = `Other top companies hiring? `
        checking = true;

        this.updatePageSeo(`${p}`,this.headerDesc,fil);
      }
      else if(this.route.url.includes('Job-by-position'))
      {
        let k = this.route.url.split('/');
        let p = k.slice(k.length-1,k.length)[0].replace(/-/g,' ')
        this.header = `More about ${p}`;
        this.headerDesc = `Many ${p} jobs are being offered in different locations by different employers. Browse and apply easily!`
        this.header2 = `People looking for ${p} jobs also search for `
        this.header3 = `Who are the top companies hiring for ${p} jobs? `
        checking = true;

        this.updatePageSeo(`${p} Jobs`,this.headerDesc,fil);
      }
      else
      {
        checking = false;
      }
    }

    let check = false
    try {
      check = checking && this.data.count
      this.valid = this.data.count
    }
    catch{}

    if(check)
    {
      let country = ''
      let c_within = '' 
      let c_3 = ''

      if(this.route.url.includes('Job-country'))
      {
        country = fil.country;
        c_within = `-in-${fil.country}`
        c_3 = ` in ${fil.country}`
      }

      let temp = this.data.categorycount
      temp = Object.keys(temp).sort((a : any,b : any)=>{
        return (temp[b]-temp[a]);
      })

      this.list2=[]
      for(let cat of temp.slice(0,5))
      {
        this.loc.seoCat(cat).toPromise()
        .then((seoData : any)=>{
          seoData = seoData.category[0]
          this.list2.push([seoData.SEO_NAME + c_3,'/Job-search/'+seoData.SEO_NAME.replace(/ /g,'-')+c_within])
        })
        .catch()
      }
      
      temp = this.data.companiescount;
      temp = Object.keys(temp).sort((a : any,b : any)=>{
        return (temp[b]-temp[a]);
      })

      this.list3=temp.slice(0,5).map((val : any)=>{
        return [val,'/Job-company/'+val];
      })
    }

    this.firstTime = false;
  }

  updatePageSeo(header : string,desc : string,fil : SearchPayload)
  {
    let SeoLoc = (fil.country.length!=0) ? ("in " + fil.country.split(',').join(' , ')) : ''

    let keywords = `${header},new ${header},${fil.search} Job ${SeoLoc},${fil.search} Job opportunity ${SeoLoc},${fil.search} Job openings ${SeoLoc}`
    let url = this.domain + this.route.url
    let type = 'job'

    let title = `${header} (with Salaries) ${getMonthAndYear()} | Workire`

    this.seo.updateSeo(title,desc,keywords,type,url);
    this.seo.createCanonicalURL(url);
  }

  showClick(i : number)
  {
    this.show[i] = !this.show[i];
  }
}