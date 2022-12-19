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
  public currYear: number = new Date().getFullYear();

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
        this.isRoot = this.location.path()=="" ? true : false
        let link_1 : string = ''
        
        if(!this.isCustomBreadcrums()) {
          this.location.path().split('/').forEach((each : any)=>{
            if(this.should_add(each)) {
              let to_push_0 = decodeURI((each == '') ? 'home' : each)
              link_1 += link_1.slice(-1)=='/' ? each : '/'+each
              this.breadCrums.push([to_push_0,link_1])
            }
          })
        }
        else {
          this.customPush()
        }
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

  isCustomBreadcrums() {
    let path = this.location.path();
    if(path.toLowerCase().includes('/job/')) {
      return true;
    }
    return false;
  }

  customPush() {
    let path = this.location.path();
    if(path.toLowerCase().includes('/job/')) {
      this.breadCrums.push(['home','/'])
      this.breadCrums.push(['jobs','/jobs'])
    }
  }

  should_add(str : string) : boolean {
    // Checks all the each with certain conditions and returns whether they shuould be added
    if(str.toLocaleLowerCase().includes('days:') || str.toLocaleLowerCase().includes('page:'))
    {
      return false;
    }

    if(str.toLocaleLowerCase()=="job") {
      return false;
    }
    return true;
  }
}
