import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetaServiceService {

  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  constructor(@Inject(DOCUMENT) private dom : any) { }
    
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
}
