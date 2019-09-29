import { Component, OnInit } from '@angular/core';
import { IDataOptions, IDataSet, GroupingBarService, FieldListService, CalculatedFieldService, CellEditSettings } from '@syncfusion/ej2-angular-pivotview';
import { GridSettings } from '@syncfusion/ej2-pivotview/src/pivotview/model/gridsettings';
import { enableRipple } from '@syncfusion/ej2-base';
import { HttpClient } from '@angular/common/http';
enableRipple(false);

declare var require: any;
let Pivot_Data: IDataSet[] = require('./datasource.ts');

@Component({
  selector: 'app-root',
  providers: [GroupingBarService, FieldListService, CalculatedFieldService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'sberbank-base';

  public editSettings: CellEditSettings;
  public dataSourceSettings: IDataOptions;
  public gridSettings: GridSettings;
  data:IDataSet[] = [];

  constructor(private _http: HttpClient){}

  getPivotData(): void {
      this._http.get<any>("../../assets/data.json").subscribe(data => {
        this.data = data;
        this.dataSourceSettings = {
          dataSource: this.data,
          expandAll: false,
          enableSorting: true,
          columns: [{ name: 'Year', caption: 'Production Year' }, { name: 'Quarter' }],
          values: [{ name: 'Sold', caption: 'Units Sold' }, { name: 'Amount', caption: 'Sold Amount' }],
          rows: [{ name: 'Country' }, { name: 'Products' }],
          formatSettings: [{ name: 'Amount', format: 'C0' }],
          filters: [],
          //calculatedFieldSettings: [{ name: 'Total', formula: "Sum(Amount)"+"Sum(Sold)"}]
          };
          
          this.editSettings = {
            allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', allowCommandColumns: false,
            allowEditOnDblClick: true, showConfirmDialog: true, showDeleteConfirmDialog: false
        } as CellEditSettings;
          this.editSettings = {
            allowAdding: true,
            allowDeleting: true,
            allowEditing: true,
            mode: 'Batch'
          } as CellEditSettings;
      })
  }

  ngOnInit(): void {
      this.gridSettings = {
          columnWidth: 140
      } as GridSettings;

      this.getPivotData();

      
    }
}