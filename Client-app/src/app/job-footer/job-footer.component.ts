import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, Location } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: 'app-job-footer',
  templateUrl: './job-footer.component.html',
  styles: []
})
export class JobFooterComponent implements OnInit {

  public breadCrums: any[] = [];

  public isRoot: boolean = true;
  isMobile : boolean = false;

  constructor(private router : Router,@Inject(PLATFORM_ID) private platformId: Object,private location : Location) {}

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }

    this.router.events
    .subscribe(
      event =>{
        this.breadCrums = []
        this.isRoot = this.location.path().split('/').length ? false : true
        let link_1 : string = ''
        this.location.path().split('/').forEach((each : any)=>{
          let to_push_0 = decodeURI((each == '') ? 'home' : each)
          link_1 += link_1.slice(-1)=='/' ? each : '/'+each
          this.breadCrums.push([to_push_0,link_1])
        })
      }
    )
    
  }


  strRepDash(str : string) {
    return str.replace(/-/g,' ');
  }

  arrowOrNot(index : number) : string {
    let arrow : string = index ? '&nbsp;&gt;' : ''
    return arrow;
  }
}
