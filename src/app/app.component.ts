import { Component, OnInit } from '@angular/core';
import { IDataOptions, IDataSet, GroupingBarService, FieldListService, CalculatedFieldService, CellEditSettings } from '@syncfusion/ej2-angular-pivotview';
import { GridSettings } from '@syncfusion/ej2-pivotview/src/pivotview/model/gridsettings';
import { enableRipple } from '@syncfusion/ej2-base';
import { HttpClient } from '@angular/common/http';
enableRipple(false);

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
  
  data:any;
  obj:any;
  report: any;

  constructor(private _http: HttpClient){}

  getPivotData(): void {
      this._http.get<any>("../../assets/data.json").subscribe(data => {
        this.data = data;
        // this.dataSourceSettings = {
        //   dataSource: this.data,
        //   expandAll: false,
        //   enableSorting: true,
        //   columns: [{ name: 'Year', caption: 'Production Year' }, { name: 'Quarter' }],
        //   values: [{ name: 'Sold', caption: 'Units Sold' }, { name: 'Amount', caption: 'Sold Amount' }],
        //   rows: [{ name: 'Country' }, { name: 'Products' }],
        //   formatSettings: [{ name: 'Amount', format: 'C0' }],
        //   filters: [],
        //   //calculatedFieldSettings: [{ name: 'Total', formula: "Sum(Amount)"+"Sum(Sold)"}]
        //   };
          
        //   this.editSettings = {
        //     allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', allowCommandColumns: false,
        //     allowEditOnDblClick: true, showConfirmDialog: true, showDeleteConfirmDialog: false
        // } as CellEditSettings;
          // this.editSettings = {
          //   allowAdding: true,
          //   allowDeleting: true,
          //   allowEditing: true,
          //   mode: 'Batch'
          // } as CellEditSettings;

          this.obj = [{
            "Country": {
              type: "level",
              hierarchy: "Countries"
            },
            "Product": {
              type: "level",
              hierarchy: "Countries",
              level: "Products",
              parent: "Country"
            },
            "Year": {
              type: "level",
              hierarchy: "Years"
            },
            "Quarter": {
              type: "level",
              hierarchy: "Years",
              level: "Quarters",
              parent: "Year"
            },
            "Sold": {
              type: "number"
            },
            "Amount": {
              type: "number"
            },
          },
          ...this.data
        ]

          this.report = {
            dataSource: {
              data: this.obj
            },
            slice: {
              rows: [
                {
                  uniqueName: "Countries",
                },
                // {
                //   uniqueName: "Product",
                // },
              ],
              columns: [
                {
                  uniqueName: "Years"
                },
                // {
                //   uniqueName: "Quarter"
                // },
                // {
                //   uniqueName: "Measures"
                // }
              ],
              measures: [
                {
                  uniqueName: "Sold"
                },
                {
                  uniqueName: "Amount"
                },
              ]
            }
          }
      })
  }

  ngOnInit(): void {
      this.gridSettings = {
          columnWidth: 140
      } as GridSettings;

      this.getPivotData();
    }
}