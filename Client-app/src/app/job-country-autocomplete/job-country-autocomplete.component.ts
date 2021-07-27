import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-job-country-autocomplete',
  templateUrl: './job-country-autocomplete.component.html',
  styleUrls: ['./job-country-autocomplete.component.css']
})
export class JobCountryAutocompleteComponent implements OnInit {
  
  myControl : FormControl = new FormControl('');
  private list: string[] = ['Iraq','Bahrain','Manama , Bahrain','Busaiteen , Bahrain','Muharraq , Bahrain','Kuwait','Ahmadi , Kuwait','Kuwait City , Kuwait','Al Asimah , Kuwait','Oman','Muscat , Oman','Sohar , Oman','Salalah , Oman','Qatar','Al Khor , Qatar','Al Wakrah , Qatar','Doha , Qatar','Umm Salal , Qatar','Suadi Arabia','Jeddah , Suadi Arabia','Al Khobar , Suadi Arabia','Yanbu , Suadi Arabia','Al Jubail , Suadi Arabia','Dhahran , Suadi Arabia','Riyadh , Suadi Arabia','United Arab Emirates','Abu Dhabi , United Arab Emirates','Dubai , United Arab Emirates','Ajman , United Arab Emirates','Sharjah , United Arab Emirates','Ras al-Khaimah , United Arab Emirates','Fujairah , United Arab Emirates','Jordan','Amman , Jordan'];
  public options: string[] = this.list;
  @Output() countryValue = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  inputGiven(ev: any) : void
  {
    this.countryValue.emit(this.myControl.value);
    if(this.myControl.value.length>1)
    {
      this.options = this.list.filter((val,ind)=>{
        return (val.toLowerCase().includes(this.myControl.value.toLowerCase()));
      })
    }
    else
    {
      this.options = this.list.filter((val,ind)=>{
        let temp = this.myControl.value.length;
        return (this.myControl.value.toLowerCase()===val.toLowerCase().slice(0,temp));
      })
    }
  }

}
