import { Component, Input, OnInit } from '@angular/core';
import { DeafultLocService } from '../../api-call.service';
import { environment } from '../../../environments/environment';
import { urlParseCommon } from 'src/app/Interfece';

@Component({
    selector: 'app-landingpage-featured',
    templateUrl: './featured.html',
    styleUrls: ['./featured.css']
  })
export class LandingPageFeatured implements OnInit {

  featured : any[] = this.loc.featued
  domain : string = environment.APIEndpoint
  domain2 : string = environment.APIEndpoint + '/'

  constructor (private loc : DeafultLocService) {}

  ngOnInit() {
    this.featured = this.loc.featued
    this.loc.featued$.subscribe(
      res =>{
        this.featured = res.data;
      },
      err =>{}
    )
  }
  
  cap(str : string)
  {
    let temp='';
    for(let k of str.split(' '))
    {
      temp += k[0].toUpperCase() + k.slice(1,k.length).toLowerCase() + ' '
    }
    return temp;
  } 

  urlParse(str : string,comp : string) {
    return urlParseCommon(str,comp);
  }
}