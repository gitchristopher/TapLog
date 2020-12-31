import { Component, OnInit } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';

interface IMenuItem {
  title: string;
  icon: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  selected: string = null;

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

  columnList: string[] = ['id', 'name', 'isCurrent'];
  wanted: string[] = ['name', 'isCurrent'];
  constructor() { }

  ngOnInit() {
  }

  selectMenuItem(e: MatSelectionListChange) {
    this.selected = e.option.value;
  }
}
