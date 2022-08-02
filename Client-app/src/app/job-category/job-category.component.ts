import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DeafultLocService } from '../api-call.service';
import { SeoServiceService } from '../seo-service.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-job-category',
  templateUrl: './job-category.component.html',
  styleUrls: ['../Common-styles/jobs-by.styles.css']
})
export class JobCategoryComponent implements OnInit {

  allCat : any = []
  domain : string = environment.APIEndpoint;
  loaded : boolean = false
  keys = Object.keys
  check : any[] = []
  isMobile : boolean = false;

  constructor(private seo : SeoServiceService,private loc : DeafultLocService,@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }
    this.loc.getAllSeoCat().toPromise()
    .then((res : any)=>{
      this.allCat = res.category

      let date = new Date();
      const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

      let title = `Find  latest Jobs by Category (${monthNames[date.getMonth()]}-${date.getFullYear()}) | Workire`
      let desc = "Apply for the best jobs in all Categories.New careers in all categories are added daily on Workire.com. Apply quickly to various job openings that are hiring near you."
      let keywords = ''
      for (let i = 0; i < this.allCat.length; i++) {
        keywords += this.allCat[i].SEO_NAME + ','
      }

      let url = this.domain + '/Jobs/All-Categories'
      let type = 'job'

      this.seo.updateSeo(title,desc,keywords,type,url);
      this.seo.createCanonicalURL(this.domain + '/Jobs/All-Categories');
    })
    .catch()
  }

  rep(str : string)
  {
    return str.replace(/ /g,'-')
  }
}
