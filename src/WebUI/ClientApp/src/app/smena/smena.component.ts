import { Component, OnInit } from '@angular/core';

interface IMenuItem {
  title: string;
  icon: string;
}

@Component({
  selector: 'app-smena',
  templateUrl: './smena.component.html',
  styleUrls: ['./smena.component.css']
})
export class SmenaComponent implements OnInit {

  sections: IMenuItem[] = [
    {title: 'Cards', icon: 'payment'},
    {title: 'Devices', icon: 'settings_remote'},
    {title: 'Passes', icon: 'confirmation_number'},
    {title: 'Products', icon: 'category'},
    {title: 'Stages', icon: 'event_note'},
    {title: 'Suppliers', icon: 'business'},
    {title: 'Taps', icon: 'tap_and_play'},
    {title: 'Executions', icon: 'subscriptions'},
    {title: 'Tests', icon: 'assignment'}
  ];

  constructor() { }

  ngOnInit() {
  }

}
