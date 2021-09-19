import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class SeoServiceService {

  constructor(private title : Title,private meta : Meta,@Inject(DOCUMENT) private dom : any) { }

  // Creating Cronical link
  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();
    
  createCanonicalURL(u : string) {
    let oldlink: HTMLLinkElement = this.dom.querySelector('link[rel=canonical]');
    if (oldlink) {
      oldlink.remove();
    }
    let link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.dom.head.appendChild(link);
    link.setAttribute('href', u);
  }

  changeMessage() {
    this.messageSource.next('next');
  }

  // for updating seo
  updateSeo(title : string, desc : string,keywords : string,type : string, url : string)
  {
    this.title.setTitle(title);
    this.meta.updateTag({name: "description",content:desc})
    this.meta.updateTag({name: 'keywords', content: keywords})
    this.meta.updateTag({name: 'robots', content: 'index, follow'})
    this.meta.updateTag({property: 'og:type',content:type})
    this.meta.updateTag({property: 'og:title',content:title})
    this.meta.updateTag({property: 'og:description',content:desc})
    this.meta.updateTag({property: 'og:url',content:url})
    this.meta.updateTag({name: 'og:site_name',content: 'Workire'})
    this.meta.updateTag({name: 'twitter:title',content:title})
    this.meta.updateTag({name: 'twitter:description',content:desc})
    this.meta.updateTag({name: 'twitter:site',content: '@Workire'})
    this.meta.updateTag({name: 'twitter:creator',content: '@WaseemSabir01'})
  }

  updateSeoWithImage(title : string,desc : string,keywords : string, image : string, type : string,url : string)
  {
    this.title.setTitle(title);
    this.meta.updateTag({name: "description",content:desc})
    this.meta.updateTag({name: 'keywords', content:keywords})
    this.meta.updateTag({property: 'og:type',content:type})
    this.meta.updateTag({property: 'og:title',content:title})
    this.meta.updateTag({property: 'og:description',content:desc})
    this.meta.updateTag({property: 'og:image',content:image})
    this.meta.updateTag({property: 'og:url',content:url})
    this.meta.updateTag({name: 'og:site_name',content: 'Workire'})
    this.meta.updateTag({name: 'twitter:title',content:title})
    this.meta.updateTag({name: 'twitter:description',content:desc})
    this.meta.updateTag({name: 'twitter:image',content:image})
    this.meta.updateTag({name: 'twitter:site',content: '@Workire'})
    this.meta.updateTag({name: 'twitter:creator',content: '@WaseemSabir01'})
  }
}
