import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-job-parallel',
  templateUrl: './job-parallel.component.html',
  styleUrls: ['./job-parallel.component.css']
})
export class JobParallelComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  service : any[] = [
    {
      logo : "/assets/interview.png",
      title : "Build interview confidence",
      desc : "We give you everything you need to master your interview skills in less time than any other option, so you can walk into your interview with confidence.",
      btn : "Interview Help >",
      link : "https://track.myinterviewpractice.net/go/693cf4fc-f0d9-4fbe-9e46-b54ce0fb41a0?workire=%7bworkire%7d"
    },
    {
      logo : "/assets/resume.png",
      title : "Need help with your CV?",
      desc : "Have it written by Workire resume writing partner; Certified resume/CV writers,100% satisfaction guaranteed,4-6 business day turnaround",
      btn : "Get Your Resume Written >",
      link : "/professional-resume-writing-service"
    },
    {
      logo : "/assets/build.png",
      title : "Build Your Resume",
      desc : "Our AI powered system will make the process easier and get noticed more using ATS optimizations and AI suggestions to approve your resume",
      btn : "Resume Builder > ",
      link : "/building"
    }

  ]

  isMobile : boolean = false

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }
  }

}
