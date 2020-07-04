import { Component, OnInit, Input } from '@angular/core';
import { TestExecutionDto2 } from 'src/app/taplog-api';

@Component({
  selector: 'app-tap-list',
  templateUrl: './tap-list.component.html',
  styleUrls: ['./tap-list.component.css']
})

export class TapListComponent implements OnInit {

  @Input() selectedExecution: TestExecutionDto2;

  constructor() { }

  ngOnInit() {
  }

}
