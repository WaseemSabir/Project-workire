import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'app-landingpage-category',
    templateUrl: './category.html',
    styleUrls: ['./category.css']
  })
export class LandingPageCategory implements OnInit {
    constructor () {}

    cats : any[] = [
        {category: "Finance &<br>Accounting",icon : "accounting.png", url : "Accounting-Jobs"},
        {category: "Real <br>Estate",icon : "realestate.png", url : "Real-Estate-Jobs"},
        {category: "Customer<br> Service",icon : "customerservice.png", url : "Customer-Service-Jobs"},
        {category: "Oil &<br>Gas Market",icon : "oilandgas.png", url : "Oil-and-Gas-Jobs"},
        {category: "Software &<br> Technology",icon : "technology.png", url : "IT-Jobs"},
        {category: "Sales &<br>Marketting",icon : "Marketting.png", url : "Sales-Jobs"},
        {category: "Operations &<br>Manufacturing",icon : "operations.png", url : "Manufacturing-Operations-Jobs"},
        {category: "Nursing &<br> Healthcare",icon : "heathcare.png", url : "Healthcare-Jobs"}
    ];

    ngOnInit() {
    }
}