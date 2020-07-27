import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StagesClient, StageDto } from 'src/app/taplog-api';

interface IStageRow {
  row: IStageCell[];
}
interface IStageCell {
  title: string;
  value: string | number | undefined;
}

@Component({
  selector: 'app-uchet',
  templateUrl: './uchet.component.html',
  styleUrls: ['./uchet.component.css']
})
export class UchetComponent implements OnInit {
  stage: string[] = ['id', 'name', 'isCurrent'];
  data: StageDto[];
  dataSource = {} as IStageRow[];
  headerText: string;
  // columnList: string[] = ['id', 'name', 'isCurrent', 'Edit'];
  wanted: string[] = ['name', 'isCurrent'];
  constructor(private stagesClient: StagesClient) {
    stagesClient.getAll().subscribe(
      result => {
        this.data = result;
        this.dataSource = new Array<IStageRow>();

        this.data.forEach(stageDto => {
          const stageRow = {} as IStageRow;
          this.wanted.forEach(element => {
            const newCell = {} as IStageCell;
            newCell.title = element;
            newCell.value = stageDto[element];
            stageRow.row.push(newCell);
          });
          this.dataSource.push(stageRow);
        });

      },
      error => console.error(error)
    );
  }

  ngOnInit() {


  }

}
