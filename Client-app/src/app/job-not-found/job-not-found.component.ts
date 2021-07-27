import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-job-not-found',
  templateUrl: './job-not-found.component.html',
  styleUrls: []
})
export class JobNotFoundComponent implements OnInit {

  constructor(private title : Title,private meta : Meta) { }

  ngOnInit(): void {
    this.title.setTitle('Not Found | Workire');
    this.meta.addTags([
      {name: "description",content:"The page that you want to access deos not exist or has been moved !"},
      {name: 'keywords', content: "Not found, 404"},
      {name: 'robots', content: 'noindex, nofollow'}
    ]);
  }
}
