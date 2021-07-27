import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DeafultLocService } from '../deafult-loc.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {

  constructor(private loc: DeafultLocService,private activatedRoute: ActivatedRoute,private route: Router,private title : Title,private meta : Meta,@Inject(PLATFORM_ID) private platformId: Object,private spinner: NgxSpinnerService) { }

  allCat : any[] = []
  cat : string = 'All';

  data : any = {};
  catState : any = {}

  domain : string = "https://workire.com"
  recent : any = []

  isAll : boolean = false

  loaded : boolean = false
  opened : boolean = false
  blogSearch: FormControl = new FormControl('')
  catego: string = '';
  isMobile : boolean = false

  public parseObj = Object.keys

  ngOnInit(): void {

    let blogCat = new Set()
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 786;
    }

    this.activatedRoute.paramMap.subscribe(params => {
      this.spinner.show();

      this.cat = params.get('category')!
      this.catego = this.cat;

      this.title.setTitle(this.cat + ' | Career Advice | Workire');
      this.meta.updateTag({name: "description",content:"Visit Wokrire's Advice & Resources and browse through our career tips. Our job tips are guaranteed to make you prepared and set for your next interview!"})
      this.meta.updateTag({name: 'keywords', content: this.cat + ' ' + 'Blog Posts ' + 'Career Advice'})
      this.meta.updateTag({name: 'robots', content: 'index, follow'})
      this.meta.updateTag({property: 'og:type',content:'article'})
      this.meta.updateTag({property: 'og:title',content: 'Career Advice | ' + this.cat +' | Blog Posts | Workire'})
      this.meta.updateTag({property: 'og:description',content:"Visit Wokrire's Advice & Resources and browse through our career tips. Our job tips are guaranteed to make you prepared and set for your next interview!"})
      this.meta.updateTag({property: 'og:url',content:this.domain+'blog/'+this.cat})
      this.meta.updateTag({name: 'og:site_name',content: 'Workire'})
      this.meta.updateTag({name: 'twitter:title',content: 'Career Advice | ' + this.cat +' | Blog Posts | Workire'})
      this.meta.updateTag({name: 'twitter:description',content:"Visit Wokrire's Advice & Resources and browse through our career tips. Our job tips are guaranteed to make you prepared and set for your next interview!"})
      this.meta.updateTag({name: 'twitter:site',content: '@Workire'})
      this.meta.updateTag({name: 'twitter:creator',content: '@WaseemSabir01'})

      if(!this.cat)
      {
        this.cat = 'All';
      }

      this.loaded = false;

      this.isAll = this.cat === 'All'

      this.catState = {}
      this.data = {}

      this.loc.getAllPosts().subscribe((res : any)=>{
        this.spinner.hide();
        this.data = res.data
        
        if(this.data.length>3)
        {
          this.recent = this.data.slice(0,3)
        }
        for(let k of res.data)
        {
          blogCat.add(k.category);
        }

        this.allCat= Array.from(blogCat);


        if(this.isAll)
        {
          for(let k of this.allCat)
          {
            this.loc.getPostByCat(k).subscribe((res: any)=>
            {
              if(res.data.length>3)
              {
                this.catState[k] = res.data.slice(0,3);
              }
              else
              {
                this.catState[k] = res.data
              }
              this.loaded = true;
            })
          }
        }
        else
        {
          this.catState = {}
          this.loc.getPostByCat(this.cat).subscribe((res: any)=>
          {
            this.catState[this.cat] = res.data;
            this.loaded = true;
          })
        }

        this.allCat.unshift('All')

        if(!this.allCat.includes(this.cat))
        {
          this.route.navigate(['/some-thing-not-correct'])
        }
      })

    })
  }

  urlParse(str : string){
    return this.domain + str;
  }

  searchChange(ev : any)
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

  catChnage()
  {
    this.route.navigate(['/career-advice',this.catego])
  }

}
