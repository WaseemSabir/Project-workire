import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DeafultLocService } from '../deafult-loc.service';
import { MetaServiceService } from '../meta-service.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-blog-search',
  templateUrl: './blog-search.component.html',
  styleUrls: ['./blog-search.component.css']
})
export class BlogSearchComponent implements OnInit {


  searchString : string = '';
  searchData : any = [];
  blogSearch : FormControl = new FormControl();
  loaded : boolean = false;
  domain : string = "https://workire.com"
  isMobile : boolean = false;


  constructor(private activateroute : ActivatedRoute, private loc : DeafultLocService,private route : Router,private title : Title,private meta : Meta,private link : MetaServiceService,@Inject(PLATFORM_ID) private platformId: Object,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }
    this.activateroute.paramMap.subscribe(params=>{
      this.spinner.show();
      this.searchString = params.get('str')!
      this.title.setTitle(this.searchString + ' | Search Results | Career Advice | Workire');
        this.meta.updateTag({name: "description",content:"Search Results for " + this.searchString + " Visit Workire's Advice & Resources and browse through our career tips. Our job tips are guaranteed to make you prepared and set for your next interview!"})
        this.meta.updateTag({name: 'keywords', content: "Search,Career Advice,Blog," + this.searchString})
        this.meta.updateTag({property: 'og:type',content:'article'})
        this.meta.updateTag({property: 'og:title',content: this.searchString + ' | Search Results | Career Advice | Workire'})
        this.meta.updateTag({property: 'og:description',content:"Search Results for " + this.searchString + " Visit Workire's Advice & Resources and browse through our career tips. Our job tips are guaranteed to make you prepared and set for your next interview!"})
        this.meta.updateTag({property: 'og:url',content:this.domain+'blog/search'+this.searchString})
        this.meta.updateTag({name: 'og:site_name',content: 'Workire'})
        this.meta.updateTag({name: 'twitter:title',content: this.searchString + ' | Search Results | Career Advice | Workire'})
        this.meta.updateTag({name: 'twitter:description',content: "Search Results for " + this.searchString + " Visit Workire's Advice & Resources and browse through our career tips. Our job tips are guaranteed to make you prepared and set for your next interview!"})
        this.meta.updateTag({name: 'twitter:site',content: '@Workire'})
        this.meta.updateTag({name: 'twitter:creator',content: '@WaseemSabir01'})
        this.link.createCanonicalURL(this.domain + this.route.url)

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
