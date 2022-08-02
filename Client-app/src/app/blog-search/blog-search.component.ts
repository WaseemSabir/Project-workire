import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeafultLocService } from '../api-call.service';
import { NgxSpinnerService } from "ngx-spinner";
import { SeoServiceService } from '../seo-service.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-blog-search',
  templateUrl: './blog-search.component.html',
  styleUrls: ['./blog-search.component.css']
})
export class BlogSearchComponent implements OnInit {


  searchString : string = '';
  searchData : any = [];
  blogSearch : UntypedFormControl = new UntypedFormControl();
  loaded : boolean = false;
  domain : string = environment.APIEndpoint;
  isMobile : boolean = false;


  constructor(private activateroute : ActivatedRoute, private loc : DeafultLocService,private route : Router,@Inject(PLATFORM_ID) private platformId: Object,private spinner: NgxSpinnerService,private seo : SeoServiceService) { }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }
    this.activateroute.paramMap.subscribe(params=>{
      this.spinner.show();
      this.searchString = params.get('str')!

      let title = this.searchString + ' | Search Results | Career Advice | Workire'
      let desc = "Search Results for " + this.searchString + " Visit Workire's Advice & Resources and browse through our career tips. Our job tips are guaranteed to make you prepared and set for your next interview!"
      let keywords = "Search,Career Advice,Blog," + this.searchString
      let type = 'article'
      let url = this.domain + this.route.url

      this.seo.updateSeo(title,desc,keywords,type,url);
      this.seo.createCanonicalURL(this.domain + this.route.url);

      this.loc.searchBlog(this.searchString).subscribe((res:any)=>{
        this.spinner.hide();
        this.blogSearch.setValue(this.searchString);
        this.searchData = res.posts;
        this.loaded = true;
      })
    })
  }

  urlParse(str : string){
    return this.domain + str;
  }

  searchChange()
  {
    this.route.navigate(['/career-advice','search',this.blogSearch.value])
  }

  cap(str : string)
  {
    let temp='';
    for(let k of str.split(' '))
    {
      temp += k[0].toUpperCase() + k.slice(1,k.length) + ' '
    }
    return temp;
  }

}
