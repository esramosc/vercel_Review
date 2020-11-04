import { Component, OnInit, Input, Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs'; 
@Injectable({
	providedIn: 'root', 
})
export class DateService { 

	private _date: Date = new Date(); 
	public dateChange = new BehaviorSubject<any>(this._date);

	get date(): Date{
		return this._date; 
	}
	set date(theDate: Date) {
		this._date = theDate; 
		this.dateChange.next(this._date);
	}
  get formattedDate() {
    var d = this._date,
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  } 
  get previousDate() {
    var d = new Date(this._date);
  	d.setDate(d.getDate() - 1);
    var month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');  	
  }
}
