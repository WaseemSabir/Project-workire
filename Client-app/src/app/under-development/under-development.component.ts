import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-under-development',
  templateUrl: './under-development.component.html',
  styleUrls: ['./under-development.component.css']
})
export class UnderDevelopmentComponent implements OnInit {

  isMobile : boolean = false;

  constructor(private title : Title,private meta : Meta,@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }
    this.title.setTitle('Page is Under Development | Workire');
    this.meta.addTags([
      {name: "description",content:"We are currently building this page !"},
      {name: 'keywords', content: "Under Construction"},
      {name: 'robots', content: 'noindex, nofollow'}
    ]);
  }

}
