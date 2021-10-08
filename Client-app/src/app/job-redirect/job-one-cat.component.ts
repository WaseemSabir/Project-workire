import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeafultLocService } from '../api-call.service';
import { FilterValueService } from '../filter-value.service';
import { valuesToPayload } from '../Interfece';
// Component Not being Used anymore 

@Component({
  selector: 'app-job-one-cat',
  templateUrl: './job-one-cat.component.html',
  styleUrls: ['./job-one-cat.component.css']
})
export class JobOneCatComponent implements OnInit {

  hedo : string = '';
  payload : string = '';

  constructor(private activatedRoute: ActivatedRoute,private route: Router,private filter : FilterValueService,private loc : DeafultLocService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let url = this.route.url;
      this.filter.refresh();
      if(url.includes('Job-country'))
      {
        this.payload = valuesToPayload('',params.get("count")!,'','',0,1);
        this.hedo = `Jobs in ${params.get("count")!}`
      }
      else if(url.includes('Job-company'))
      {
        this.payload = valuesToPayload('','','',params.get("comp")!,0,1);
        this.hedo = `Jobs in ${params.get("comp")!}`
      }
      else if(url.includes('Job-category'))
      {
        this.payload = valuesToPayload('','',this.unrep(params.get('cat')!.replace(' Jobs','').replace('Jobs','').replace(' jobs','').replace('jobs','')),'',0,1);
        this.hedo = this.unrep(params.get("cat")!)
      }
      else if(url.includes('Job-search'))
      {
        let k = params.get("search")!
        let b = k.toLowerCase().split('-in-')
        try{
          b[0] = b[0].toLowerCase().replace('-jobs','')
          this.payload = valuesToPayload(b[0],b[1],'','',0,1);
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
          this.payload = valuesToPayload(b[0],'','','',0,1);
          this.hedo = this.unrep(b[0])
        }
        else if(b.length==2)
        {
          this.payload = valuesToPayload(b[0],b[1],'','',0,1);
          this.hedo = this.unrep(b[0]) + ' in ' + b[1];
        }
      }
    })
  }

  unrep = (str: string) =>{
    return str.replace(/-/g,' ')
  }
}