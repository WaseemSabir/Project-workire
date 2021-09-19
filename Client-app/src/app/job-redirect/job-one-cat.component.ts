import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeafultLocService } from '../deafult-loc.service';
import { FilterValueService } from '../filter-value.service';

@Component({
  selector: 'app-job-one-cat',
  templateUrl: './job-one-cat.component.html',
  styleUrls: ['./job-one-cat.component.css']
})
export class JobOneCatComponent implements OnInit {

  hedo : string = '';

  constructor(private activatedRoute: ActivatedRoute,private route: Router,private filter : FilterValueService,private loc : DeafultLocService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let url = this.route.url;
      this.filter.refresh();
      if(url.includes('Job-country'))
      {
        this.filter.addCountry(params.get("count")!);
        this.hedo = `Jobs in ${params.get("count")!}`
      }
      else if(url.includes('Job-company'))
      {
        this.filter.addCompany(params.get("comp")!);
        this.hedo = `Jobs in ${params.get("comp")!}`
      }
      else if(url.includes('Job-category'))
      {
        this.loc.seoCatBySeo(this.unrep(params.get('cat')!)).subscribe((res : any)=>{
          this.filter.addCategory(res.category[0].Name)
        })
        this.hedo = this.unrep(params.get("cat")!)
      }
      else if(url.includes('Job-search'))
      {
        let k = params.get("search")!
        let b = k.toLowerCase().split('-in-')
        try{
          b[0] = b[0].toLowerCase().replace('-jobs','')
          this.filter.addSearch(b[0])
          this.filter.addCountry(b[1])
          this.hedo = this.unrep(b[0]) + ' in ' + b[1];
        }
        catch{}
      }
      else if(url.includes('Job-by-position'))
      {
        let j = params.get("position")!
        let b = j.split('-in-')
        if(b.length==1)
        {
          this.filter.addSearch(b[0])
          this.hedo = this.unrep(b[0])
        }
        else if(b.length==2)
        {
          this.filter.addSearch(b[0])
          this.filter.addCountry(b[1])
          this.hedo = this.unrep(b[0]) + ' in ' + b[1];
        }
      }
    })
  }

  unrep = (str: string) =>{
    return str.replace(/-/g,' ')
  }
}