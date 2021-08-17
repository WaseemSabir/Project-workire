import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MetaServiceService } from '../meta-service.service';

@Component({
  selector: 'app-custom-resume-page',
  templateUrl: './custom-resume-page.component.html',
  styleUrls: ['./custom-resume-page.component.css']
})
export class CustomResumePageComponent implements OnInit {

  domain : string = "https://workire.com"

  service : any[] = [
    {
      title : "Professional Growth",
      svg : ['<svg viewBox="0 0 24 24" id="icon-document" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"></path></svg>'],
      price : "$134",
      regular : "179",
      desc : "An expertly written and keyword-optimized resume that sets you apart",
      color : "bg-info",
      link : "https://www.topresume.com/purchase/NTOPym5?pid=&pt=fhtsVLxOYDCkW&utm_medium=partner&utm_source=workire&utm_content=tr-purchase&utm_term=pg",
      show : true,
      popular : false,
      Benefits : [["text-dark","Professionally written","   By experts that know your industry."],["text-dark","Formatted for success","   Formatting that will get an employer's attention."],["text-dark","Keyword optimized","   Your resume will be optimized to pass through Applicant Tracking Systems."]]
    },
    {
      title : "Career Evolution",
      svg : ['<svg viewBox="0 0 24 24" id="icon-document" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"></path></svg>','<svg viewBox="0 0 24 24" id="icon-mail" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>'],
      price : "$197",
      regular : "219",
      desc : "Everything you need to apply to jobs, including a professional resume and cover letter",
      color : "bg-primary",
      link : "https://www.topresume.com/purchase/qdy2PCi?pid=&pt=fhtsVLxOYDCkW&utm_medium=partner&utm_source=workire&utm_content=tr-purchase&utm_term=ce",
      show : true,
      popular : true,
      Benefits : [["text-dark","Professionally written","   By experts that know your industry."],["text-dark","Formatted for success","   Formatting that will get an employer's attention."],["text-dark","Keyword optimized","   Your resume will be optimized to pass through Applicant Tracking Systems."],["text-dark","Cover letter","   Employers are 40% more likely to read a resume with a cover letter."],["text-dark","60-day interview guarantee.",""]]
    },
    {
      title : "Executive Priority",
      svg : ['<svg viewBox="0 0 24 24" id="icon-document" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"></path></svg>','<svg viewBox="0 0 24 24" id="icon-mail" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>','<svg viewBox="0 0 24 24" id="icon-linkedin" xmlns="http://www.w3.org/2000/svg"><path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path></svg>'],
      price : "$314",
      regular : "349",
      desc : "Resume, cover letter, and LinkedIn profile, created by an executive writer",
      color : "bg-secondary",
      link : "https://www.topresume.com/purchase/frukH0N?pid=&pt=fhtsVLxOYDCkW&utm_medium=partner&utm_source=workire&utm_content=tr-purchase&utm_term=ep",
      show : true,
      popular : false,
      Benefits : [["text-success","Executive writer","   Top 10% of our network."],["text-dark","Formatted for success","   Formatting that will get an employer's attention"],["text-dark","Keyword optimized","   Your resume will be optimized to pass through Applicant Tracking Systems"],["text-dark","Cover letter","   Employers are 40% more likely to read a resume with a cover letter."],["text-dark","60-day interview guarantee.",""],["text-success","LinkedIn Makeover","   97% of employers use LinkedIn; we'll rewrite your profile."]]
    }
  ]

  invest : any[] = [
    {
      logo : "/assets/chart.png",
      title : "Get noticed more",
      desc : "Job seekers using TopResume Professional resume writing services are 3x more likely to be hear back and interviewed than those using self-written resume."
    },
    {
      logo : "./assets/hired.png",
      title : "Get hired faster",
      desc : "Candidates using Professional resume writing services by TopResume have proven to be 3 times more likely to secure a new job than those using a self-written resume."
    },
    {
      logo : "./assets/checked.png",
      title : "Guaranteed results",
      desc : "With TopResume Professional resume writing services you get a 60-day interview guarantee – Get 2x more interviews or get your resume rewritten for free."
    }
  ]

  cust : any[] = [
    {
      name : "HILARY H.",
      say : "I was hesitant to pay for these services, but my resume needed some serious help. It wasn't a week after I received my updated resume, and I was offered a position. The staff was extremely helpful and responsive-- they were thorough in asking what I wanted and the goals I was hoping to achieve. 10/10-- would recommend to anyone.",
      logo : "assets/google.png"
    },
    {
      name : "JULIE N.",
      say : "TopResume's price was more than reasonable, the turnaround time was rapid, the service was exemplary, and the product was top-notch. I don't have any concerns about recommending TopResume to anyone, regardless of where you're at in your career.",
      logo : "assets/site.png"
    },
    {
      name : "GARY T.",
      say : "Excellent service. My writer was able to take a jumbled mess that eventually became 6 un-edited pages of job duties and responsibilities and turned it into a two-page concise document that represents me in a professional manner.",
      logo : "assets/trustpilot.png"
    }
  ]

  isMobile : boolean = false

  constructor(private title : Title,private meta : Meta,private link : MetaServiceService,private route : Router,@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId))
    {
      this.isMobile = screen.width < 768;
    }
    if(this.isMobile)
    {
      for(let i of this.service)
      {
        i.show = false;
      }
    }
    this.title.setTitle('Professional Resume Writing Serices | Workire');
    this.meta.updateTag({name: "description",content:"Looking for professional resume writing service? TopResume's expert resume writers can help you build a resume that gets more interviews, guaranteed."},'name=description')
    this.meta.updateTag({name: 'keywords', content: "Resume help, Workire resume,Professional Resume,Resume writting,Top resume"},'name=keywords')
    this.meta.updateTag({property: 'og:type',content:'article'})
    this.meta.updateTag({property: 'og:title',content: 'Professional Resume Writing Serices | Workire'})
    this.meta.updateTag({property: 'og:description',content:"Looking for professional resume writing service? TopResume's expert resume writers can help you build a resume that gets more interviews, guaranteed."})
    this.meta.updateTag({property: 'og:image',content:this.domain+ "/assets/resume.jpg"})
    this.meta.updateTag({property: 'og:url',content:this.domain+'/professional-resume-writing-service'})
    this.meta.updateTag({name: 'og:site_name',content: 'Workire'})
    this.meta.updateTag({name: 'twitter:title',content: 'Professional Resume Writing Serices | Workire'})
    this.meta.updateTag({name: 'twitter:description',content: "Looking for professional resume writing service? TopResume's expert resume writers can help you build a resume that gets more interviews, guaranteed."})
    this.meta.updateTag({name: 'twitter:image',content: this.domain + "/assets/resume.jpg"})
    this.meta.updateTag({name: 'twitter:site',content: '@Workire'})
    this.meta.updateTag({name: 'twitter:creator',content: '@WaseemSabir01'})
    this.link.createCanonicalURL(this.domain + this.route.url)
  }

  showClick (s : number) 
  {
    if(this.isMobile)
    {
      this.service[s].show =!this.service[s].show
    }
  }

}
