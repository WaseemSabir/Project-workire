import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DeafultLocService } from '../deafult-loc.service';
import { environment } from '../../environments/environment';
import { SeoServiceService } from '../seo-service.service';

@Component({
  selector: 'app-job-trending-search',
  templateUrl: './job-trending-search.component.html',
  styleUrls: ['../Common-styles/jobs-by.styles.css']
})
export class JobTrendingSearchComponent implements OnInit {

  allCat : any = []
  domain : string = environment.APIEndpoint;
  loaded : boolean = false
  keys = Object.keys
  isMobile : boolean = false;

  constructor(private loc : DeafultLocService,@Inject(PLATFORM_ID) private platformId: Object,private seo : SeoServiceService) { }

  ngOnInit(): void {

    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }

    this.loc.getTrendingSearches().toPromise()
    .then((res : any)=>{
      this.allCat = res

      let date = new Date();
      const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

      let title = `Trending Searches (${monthNames[date.getMonth()]}-${date.getFullYear()}) | Workire`
      let desc = "Try out these trending seaches to find your dream job. Apply quickly to various job openings that are hiring near you."
      let keywords = Object.keys(this.allCat).toString()
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
