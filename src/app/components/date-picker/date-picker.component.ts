import { Component, OnInit } from '@angular/core';
import { DateService } from '../../services/date.service'; 
@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {

  
  month_keys: any;   
  months: any;
  week: any; 
  newHourDate: string = "";

  current_date: any;
  current_event: any
  cont: number = 0; 
  notice: string;
  past: number = 0;  
  month_names: string[] = [
    "Enero", 
    "Febrero", 
    "Marzo", 
    "Abril", 
    "Mayo", 
    "Junio", 
    "Julio", 
    "Agosto", 
    "Septiembre",
    "Octubre", 
    "Noviembre", 
    "Diciembre"
  ];
  day_names:  string[] = [
    "Dom",
    "Lun", 
    "Mar", 
    "Mie", 
    "Jue", 
    "Vie", 
    "Sab"  
  ];  

  constructor(
  	public dateService: DateService) {
  }
  
  ngOnInit() {
    var current_date = new Date().toISOString();
    this.past = 0;
    this.getWeekDays(this.dateService.date);        
  }

  setDate($event, date) {
  	this.dateService.date = date; 
    this.current_date = this.dateService.formattedDate;   	
    var dates = Array.from(document.querySelectorAll('.date')); 
    dates.forEach((date)=>{
      date.classList.remove('selected'); 
    });
    this.current_event = $event;
    if ($event) {
      console.log('$event.target: ', $event.target);
      $event.target.classList.add('selected'); 
    }       
  }
  formatDate(date) {
    if (date) {
      var d = new Date(date.toString().replace(/\s/g, "T")),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [year, month, day].join('-');
    }   
  }


  getPastWeekStartDate(date) {
    this.notice = null;
    var d = date; 
    d.setDate(date.getDate() - 6); 
    this.getWeekDays(d); 
  }

  getWeekDays(date) {
    // console.log("getWeekDays DATE");
    //Current day
    var current_date = new Date().toISOString()
    this.week = [new Date(date)]; 
    var diff =  Math.floor(( Date.parse(this.week[0]) - Date.parse(current_date ) ) / 86400000);
    if (diff < -1) {
      this.past = 1;
    } else{
      this.past = 0;
    }
    if (diff < 11) {
      this.notice = null;
    } else {
      this.notice = "La fecha es muy lejana."
    }
    for (var i = 0; i < 6; i++) {
      var curr_date = date.setDate(date.getDate() + 1);
      var new_date = new Date(curr_date);   
      this.week.push(new_date); 
    }
    //use in html
    this.months = this.groupDaysByMonth(this.week); 
    this.cont = this.cont + 1; 
    this.dateService.date = this.week[0]; 
  }


  groupDaysByMonth(week){
    var months = {}; 
    var current_month;
    for (var i = 0; i < week.length; i++) {
      current_month = week[i].getMonth();
      if (months[current_month]) {
        months[current_month].push(week[i]); 
      } else {
        months[current_month] = []; 
        months[current_month].push(week[i]); 
      }
    }
    //use in html 
    this.month_keys = Object.keys(months);  
    return months; 
  }

  formatCurrentDate(date) {
    if (date) {
      var d = date,
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [year, month, day].join('-');
    }  
  }  
}
