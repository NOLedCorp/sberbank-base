import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { IDataOptions, IDataSet, GroupingBarService, FieldListService, CalculatedFieldService, CellEditSettings } from '@syncfusion/ej2-angular-pivotview';
import { GridSettings } from '@syncfusion/ej2-pivotview/src/pivotview/model/gridsettings';
import { enableRipple } from '@syncfusion/ej2-base';
import { HttpClient } from '@angular/common/http';
import { WebDataRocksPivot } from './webdatarocks/webdatarocks.angular4';
enableRipple(false);

@Component({
  selector: 'app-root',
  providers: [GroupingBarService, FieldListService, CalculatedFieldService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = 'sberbank-base';
  @ViewChild("pivot1", {static : false}) pivot1:WebDataRocksPivot
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

        //   this.obj = [{
        //     "Country": {
        //       type: "level",
        //       hierarchy: "Countries"
        //     },
        //     "Product": {
        //       type: "level",
        //       hierarchy: "Countries",
        //       level: "Products",
        //       parent: "Country"
        //     },
        //     "Year": {
        //       type: "level",
        //       hierarchy: "Years"
        //     },
        //     "Quarter": {
        //       type: "level",
        //       hierarchy: "Years",
        //       level: "Quarters",
        //       parent: "Year"
        //     },
        //     "Sold": {
        //       type: "number",
        //       caption: "Количество"
        //     },
        //     "Amount": {
        //       type: "number",
        //       caption: "Сумма"
        //     },
        //   },
        //   ...this.data
        // ]

          this.report = {
            dataSource: {
              data: this.data
            },
            formats:[
              {
                name: "Amount",
                decimalPlaces: 0,
                currencySymbol: "$",
                currencySymbolAlign: "right"
              }
            ],
            slice: {
              rows: [
                {
                  uniqueName: "Country",
                  caption: "Страна"
                },
                {
                  uniqueName: "Product",
                  caption: "Продукт"
                },
              ],
              columns: [
                {
                  uniqueName: "Year",
                  caption: "Год"
                },
                {
                  uniqueName: "Quarter",
                  caption: "Квартал"
                },
                // {
                //   uniqueName: "Measures"
                // }
              ],
              measures: [
                {
                  uniqueName: "Sold",
                  caption: "Количество"
                },
                {
                  uniqueName: "Amount",
                  caption: "Стоимость",
                  aggregation: "sum",
                  format: "Amount"
                },
              ]
            }
          }
      })
  }

  ngOnInit(): void {
      // this.gridSettings = {
      //     columnWidth: 140
      // } as GridSettings;
    
      this.getPivotData();
      
    }
    ngAfterViewChecked(){
      //console.log(this.pivot1);

      let cells = document.querySelectorAll(".wdr-cell");
      for(let i = 0; i<cells.length;i++){
        (<HTMLElement>cells[i]).onclick = function(event){
          console.dir(event.target)
        }
      }
    }
  onCellClick(event){
    //console.log(this.pivot1.webDataRocks.getSelectedCell());
  }
  customizeCellFunction(cellBuilder, cellData) {
    //console.log([cellBuilder, cellData])
  }
  // cons(event){
  //   console.log(event)
  // }

  getCell(){
    console.log(this.pivot1.webDataRocks)
    console.log(this.pivot1.webDataRocks.getReport())
    this.pivot1.webDataRocks.on('reportchange', 'onReportChange');
  }

  onReportChange(result) {
      alert('The report has been changed!');
  }  

}