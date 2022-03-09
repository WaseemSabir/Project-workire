import { Component, OnInit, Optional, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RESPONSE, REQUEST } from '@nguniversal/express-engine/tokens';
import { isPlatformServer } from '@angular/common';
import { Request, Response } from 'express';

@Component({
  selector: 'app-job-not-found',
  templateUrl: './job-not-found.component.html',
  styleUrls: []
})
export class JobNotFoundComponent implements OnInit {

  constructor(private title : Title,private meta : Meta, @Optional() @Inject(REQUEST) private request: Request,
  @Optional() @Inject(RESPONSE) private response: Response,
  @Inject(PLATFORM_ID) private platformId: any) { }

  ngOnInit(): void {
    if(isPlatformServer(this.platformId)) {
      this.response.status(404);
    }
    this.title.setTitle('Not Found | Workire');
    this.meta.addTags([
      {name: "description",content:"The page that you want to access deos not exist or has been moved !"},
      {name: 'keywords', content: "Not found, 404"},
      {name: 'robots', content: 'noindex, nofollow'}
    ]);
  }
}
