import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { TestExecutionDto2, TapDto2 } from 'src/app/taplog-api';

@Component({
  selector: 'app-tap-list',
  templateUrl: './tap-list.component.html',
  styleUrls: ['./tap-list.component.css']
})

export class TapListComponent implements OnInit, OnChanges {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() selectedExecution: TestExecutionDto2;
  isChecked = false;
  isDisabled = this.selectedExecution ? false : true;


  constructor() {
    this.isChecked = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (this.selectedExecution !== undefined) {
      console.log('on changes tap-list');
      for (const propName in changes) {
        if (changes.hasOwnProperty(propName)) {
          switch (propName) {
            case 'selectedExecution': {
              this.isChecked = false;
              if (this.selectedExecution == null) {
                this.isDisabled = true;
                console.log('isDisabled' + this.isDisabled);
              } else {
                this.isDisabled = false;
                console.log('isDisabled' + this.isDisabled);
              }
            }
          }
        }
      }
    // }
  }

  ngOnInit() {
  }

  deleteTap(id: number) {
    console.log(id);
  }

  editTap(id: number) {
    console.log(id);
  }

  toggleChanged(e: Event) {
    this.isChecked = !this.isChecked;
    this.isChecked ? this.accordion.openAll() : this.accordion.closeAll();
  }
}
