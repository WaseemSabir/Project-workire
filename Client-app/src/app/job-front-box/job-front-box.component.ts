import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-job-front-box',
  templateUrl: './job-front-box.component.html',
  styleUrls: ['./job-front-box.component.css']
})
export class JobFrontBoxComponent implements OnInit {

  isMobile : boolean = false;
  str : string = 'Get Started'
  font : string = '3vw'

  @Input() showBtn : boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }

    if(this.isMobile)
    {
      this.font = '6vw'
      this.str = 'Explore'
    }
  }

}
