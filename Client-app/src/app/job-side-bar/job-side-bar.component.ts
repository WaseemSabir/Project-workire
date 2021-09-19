import { Component, Input, OnInit } from '@angular/core';
import { FilterValueService } from '../filter-value.service';
import { Filters } from '../Interfece'

@Component({
  selector: 'app-job-side-bar',
  templateUrl: './job-side-bar.component.html',
  styleUrls: ['./job-side-bar.component.css']
})
export class JobSideBarComponent implements OnInit {


  time : string = '0';
  toCheck : string = '0';
  input : string = '';
  showErr : boolean = false;

  @Input() head1 : string = '';
  @Input() head2 : string = '';

  constructor(private filter : FilterValueService) { }

  ngOnInit(): void {
    this.filter.filter$.subscribe((res : Filters)=>{
      this.time = res.days.toString();
      this.toCheck = this.time;
    })
  }

  handleTime() {
    let t = 0;
    this.showErr = false;
    if(this.time=='Custom')
    {
      try {
        t = parseInt(this.input);
        if(!t)
        {
          throw "err";
        }
      }
      catch
      {
        this.showErr = true;
      }
    }
    else
    {
      t = parseInt(this.time);
    }
    if(!this.showErr)
    {
      this.filter.setTime(t);
    }
  }
}


// alert box component
@Component({
  selector: 'app-job-alert-box',
  templateUrl: './alertBox/alertbox.html',
  styleUrls: ['./job-side-bar.component.css']
})
export class AlterBox implements OnInit {
  ngOnInit(): void {

  }
}