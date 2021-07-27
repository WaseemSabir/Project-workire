import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-share-buttons',
  templateUrl: './share-buttons.component.html',
  styleUrls: ['./share-buttons.component.css']
})
export class ShareButtonsComponent implements OnInit {


  domain : string = "https://workire.com"
  href : string = "";
  fb : string = "";
  twitter : string = "";
  in : string = "";
  @Input() t : string = '' 
  constructor(private router : Router) { }

  ngOnInit(): void {
    this.href = this.domain + this.router.url;
    this.fb = "https://www.facebook.com/sharer/sharer.php?u=" + this.href;
    this.twitter = `https://twitter.com/intent/tweet?url=${this.href}&text=${this.t}`
    this.in = "https://www.linkedin.com/shareArticle?mini=true&url=" + this.href;
  }
}
