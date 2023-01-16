import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DeafultLocService } from '../api-call.service';
import { UntypedFormControl } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { SeoServiceService } from '../seo-service.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-job-blog-list',
  templateUrl: './job-blog-list.component.html',
  styleUrls: ['./job-blog-list.component.css']
})
export class JobBlogListComponent implements OnInit {

  constructor(private loc: DeafultLocService, @Inject(PLATFORM_ID) private platformId: Object, private spinner: NgxSpinnerService, private seo: SeoServiceService) { }

  allCat: any[] = []
  cat: string = 'All';

  data: any = [];

  domain: string = environment.APIEndpoint;
  whole: any = []

  opened: boolean = false
  blogSearch: UntypedFormControl = new UntypedFormControl('')
  isMobile: boolean = false

  public parseObj = Object.keys

  ngOnInit(): void {

    let blogCat = new Set();

    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = screen.width < 786;
    }

    this.spinner.show();

    this.loc.getAllJobBlogs().subscribe((res: any) => {
      this.spinner.hide();
      this.whole = res.data;

      for (let k of res.data) {
        blogCat.add(k.category);
      }

      this.allCat = Array.from(blogCat);

      this.allCat.unshift('All')

      this.renderData();
    })
  }

  urlParse(str: string) {
    return this.domain + str;
  }

  catgoryClick(btn: string) {
    this.cat = btn;
    this.renderData();
  }

  renderData() {
    if (this.cat != 'All') {
      this.data = this.whole.filter((val: any) => {
        return val.category === this.cat;
      })
    }
    else {
      this.data = this.whole;
    }

    let title = this.cat + ' | Latest Jobs | Workire'
    let description = "Explore workire for latest jobs & career opportunities."
    let keywords = `${this.cat},Blog Posts,latest jobs`
    let url = this.domain + 'latest-jobs'

    this.seo.updateSeo(title, description, keywords, 'article', url);
  }
}
