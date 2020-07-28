import { Component, OnInit } from '@angular/core';
import { IStageDto, StageDto } from '../taplog-api';
import { MatSelectionListChange } from '@angular/material/list';

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
    // type StagePropsArray = Array<keyof IStageDto>;
    // const stageProps: StagePropsArray = Object.keys(new StageDto()) as StagePropsArray;
  }

  selectMenuItem(e: MatSelectionListChange) {
    this.selected = e.option.value;
  }
}
