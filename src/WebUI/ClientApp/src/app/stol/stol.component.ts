import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { TapsClient, TapDataRowDto } from '../taplog-api';
import { TapQuery } from './zapros/zapros.component';


@Component({
  selector: 'app-stol',
  templateUrl: './stol.component.html',
  styleUrls: ['./stol.component.css']
})
export class StolComponent {
  displayedColumns: string[] = ['testExecutionId', 'jira', 'cardSupplierName',
                                'cardNumber', 'cardAlias', 'timeOf2', 'timeOf', 'action', 'deviceCode', 'deviceName', 'result', 'wasResultExpected',
                                'fare', 'balanceBefore', 'balanceAfter', 'notes',
                                'tester'];
  // displayedColumns: string[] = ['id', 'testExecutionId', 'testId', 'jira', 'stage',
  //                               'isCurrentStage', 'cardId', 'cardNumber', 'cardAlias',
  //                               'cardSupplierName', 'deviceId', 'deviceCode', 'deviceName',
  //                               'tester', 'result', 'wasResultExpected', 'timeOf',
  //                               'fare', 'balanceBefore', 'balanceAfter', 'notes'];
  data: TapDataRowDto[] = [];

  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;

  constructor(private tapsClient: TapsClient) { }

  submitForm(query: TapQuery) {
    console.log('submitForm(query: TapQuery)');
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.tapsClient.get(query.testId, query.startDate, query.endDate);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.resultsLength = data.totalCount;

          return data.tapDataRow;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => this.data = data);
  }

}
