import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DeafultLocService } from '../api-call.service';
import { UntypedFormControl } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { SeoServiceService } from '../seo-service.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {

  constructor(private loc: DeafultLocService,@Inject(PLATFORM_ID) private platformId: Object,private spinner: NgxSpinnerService, private seo : SeoServiceService) { }

  allCat : any[] = []
  cat : string = 'All';

  data : any = [];

  domain : string = environment.APIEndpoint;
  whole : any = []

  opened : boolean = false
  blogSearch: UntypedFormControl = new UntypedFormControl('')
  isMobile : boolean = false

  public parseObj = Object.keys

  ngOnInit(): void {

    let blogCat = new Set();

    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 786;
    }

    this.spinner.show();

    this.loc.getAllPosts().subscribe((res : any)=>{
      this.spinner.hide();
      this.whole = res.data;
      
      for(let k of res.data)
      {
        blogCat.add(k.category);
      }

      this.allCat = Array.from(blogCat);

      this.allCat.unshift('All')

      this.renderData();
    })
  }

  urlParse(str : string){
    return this.domain + str;
  }

  catgoryClick(btn : string)
  {
    this.cat = btn;
    this.renderData();
  }

  renderData()
  {
    if(this.cat!='All')
    {
      this.data = this.whole.filter((val : any)=>{
        return val.category===this.cat;
      })
    }
    else
    {
      this.data = this.whole;
    }

    let title = this.cat + ' | Career Advice | Workire'
    let descript = "Visit Wokrire's Advice & Resources and browse through our career tips. Our job tips are guaranteed to make you prepared and set for your next interview!"
    let keywords = `${this.cat},Blog Posts,Career Advice`
    let url = this.domain+'career-advice'

    this.seo.updateSeo(title,descript,keywords,'article',url);
  }
}
