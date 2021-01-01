import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpectedEnumPipe } from 'src/_pipes/ExpectedEnumPipe';
import { TapActionEnumPipe } from 'src/_pipes/TapActionEnum.pipe';
import { TapActionToArrayPipe } from 'src/_pipes/TapActionToArray.pipe';
import { TesterNamePipe } from 'src/_pipes/TesterName.pipe';
import { ResultEnumPipe } from 'src/_pipes/ResultEnumPipe';



@NgModule({
  declarations: [
    ExpectedEnumPipe,
    ResultEnumPipe,
    TapActionEnumPipe,
    TapActionToArrayPipe,
    TesterNamePipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    ExpectedEnumPipe,
    ResultEnumPipe,
    TapActionEnumPipe,
    TapActionToArrayPipe,
    TesterNamePipe
  ]
})
export class PipeModule { }
