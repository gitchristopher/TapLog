import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { TestExecutionDto2, TapDto2, TapsClient } from 'src/app/taplog-api';
import {style, state, animate, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-tap-list',
  templateUrl: './tap-list.component.html',
  styleUrls: ['./tap-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [ style({opacity: 0 }), animate('500ms 100ms ease-in', style({opacity: 1 })) ]),
      transition(':leave', [ animate('500ms ease-out', style({opacity: 0 })) ])
    ])
  ]
})

export class TapListComponent implements OnInit, OnChanges {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() selectedExecution: TestExecutionDto2;

  isChecked = false;
  isDisabled = this.selectedExecution ? false : true;

  constructor(private tapsClient: TapsClient) {
    this.isChecked = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'selectedExecution': {
            this.isChecked = false;
            if (this.selectedExecution == null) {
              this.isDisabled = true;
            } else {
              this.isDisabled = false;
            }
          }
        }
      }
    }
  }

  ngOnInit() {
  }

  deleteTap(id: number) {
    if (confirm('Are you sure to delete the tap? ' + id)) {
      const index = this.selectedExecution.taps.findIndex(x => x.id === id);
      this.selectedExecution.taps.splice(index, 1);
      this.tapsClient.delete(id).subscribe(response => {
        // TODO: What to do with NoContent response?
      }, error => {
        console.error('Error deleting tap id: ' + id + ' ' + error);
      });
    }
  }

  editTap(id: number) {
    // TODO
    console.log(id);
  }

  toggleChanged(e: Event) {
    this.isChecked = !this.isChecked;
    this.isChecked ? this.accordion.openAll() : this.accordion.closeAll();
  }
}
