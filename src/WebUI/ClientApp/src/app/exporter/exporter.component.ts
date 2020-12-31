import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { TapsClient, TapDataRowDto } from '../taplog-api';
import { TapQuery } from './querier/querier.component';


@Component({
  selector: 'app-exporter',
  templateUrl: './exporter.component.html',
  styleUrls: ['./exporter.component.css']
})
export class ExporterComponent {
  displayedColumns: string[] = ['testExecutionId', 'jira', 'cardSupplierName',
                                'cardNumber', 'cardAlias', 'timeOf2', 'timeOf', 'action', 'deviceCode', 'deviceName', 'result', 'wasResultExpected',
                                'fare', 'balanceBefore', 'balanceAfter', 'notes',
                                'tester'];
  data: TapDataRowDto[] = [];

  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;

  constructor(private tapsClient: TapsClient) { }

  submitForm(query: TapQuery) {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.tapsClient.get(query.stageId, query.testId, query.startDate, query.endDate);
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
