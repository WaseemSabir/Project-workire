import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeafultLocService } from '../api-call.service';
import { FilterValueService } from '../filter-value.service';
import { SeoServiceService } from '../seo-service.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-job-single-page',
  templateUrl: './job-single-page.component.html',
  styleUrls: []
})
export class JobSinglePageComponent implements OnInit {

  domain : string = environment.APIEndpoint;

  constructor(private active : ActivatedRoute,private filter : FilterValueService,private loc : DeafultLocService,private seo : SeoServiceService,private route : Router) { }

  ngOnInit(): void {
    this.active.paramMap.subscribe((params : any)=>{
      this.filter.setSlug(params.get("slug")!);
    })
  }
}
