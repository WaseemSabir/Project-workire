import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';
import { DeafultLocService } from '../deafult-loc.service';

@Component({
  selector: 'app-job-country-autocomplete',
  templateUrl: './job-country-autocomplete.component.html',
  styleUrls: ['./job-country-autocomplete.component.css']
})
export class JobCountryAutocompleteComponent implements OnInit {
  
  myControl : FormControl = new FormControl('');
  private list: string[] = [];
  public customCunt : any = {};
  public options: string[] = [];
  @Output() countryValue = new EventEmitter<string>();

  constructor(private loc : DeafultLocService) { }

  ngOnInit(): void {
    this.customCunt = this.loc.getCustomCountries();
    this.options = this.list = this.BendIt(this.customCunt);
  }

  BendIt(Countries : any)
  {
    let k : string[] = []
    for(let count of Object.keys(Countries))
    {
      k.push(count)
      for(let little of Countries[count])
      {
        let countryWithCity = little + ' , ' + count;
        k.push(countryWithCity)
      }
    }
    return k;
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
