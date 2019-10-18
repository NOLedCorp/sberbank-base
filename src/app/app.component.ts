import { Component, OnInit, ViewChild, AfterViewChecked, AfterViewInit } from '@angular/core';
import { IDataOptions, IDataSet, GroupingBarService, FieldListService, CalculatedFieldService, CellEditSettings } from '@syncfusion/ej2-angular-pivotview';
import { GridSettings } from '@syncfusion/ej2-pivotview/src/pivotview/model/gridsettings';
import { enableRipple } from '@syncfusion/ej2-base';
import { HttpClient } from '@angular/common/http';
import { WebDataRocksPivot } from './webdatarocks/webdatarocks.angular4';
import { ModalService } from './services/modal.service';
import { UpdateComponent } from './update/update.component';
enableRipple(false);

@Component({
  selector: 'app-root',
  providers: [GroupingBarService, FieldListService, CalculatedFieldService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, AfterViewChecked, AfterViewInit {
  title = 'sberbank-base';
  @ViewChild("pivot1", {static : false}) pivot1:WebDataRocksPivot
  public editSettings: CellEditSettings;
  public dataSourceSettings: IDataOptions;
  public gridSettings: GridSettings;
  
  data:any;
  obj:any;
  report: any;

  drilledThrought: boolean = false;
  dCells = [];
  dHeaders = [];
  private _tableData = null;

  constructor(private _http: HttpClient, private ms:ModalService){}

  getPivotData(): void {
      this._http.get<any>("../../assets/data.json").subscribe(data => {
      this.data = data;
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
        data: this.readyData(this.data)
      },
      formats:[
        // {
        //   name: "Amount",
        //   decimalPlaces: 0,
        //   currencySymbol: "$",
        //   currencySymbolAlign: "right"
        // }
      ],
      slice: {
        rows: [
          {
            uniqueName: "Country",
            caption: "Страна"
          },
          {
            name: "Amount",
            decimalPlaces: 0,
            currencySymbolAlign: "right"
          }
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
          {
            uniqueName: "Product",
            caption: "Продукт"
          }
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
            // format: "Amount"
          },
        ]
      }
    }
  })

}

  ngOnInit(): void {
      this.getPivotData();
      document['vm'] = this;
  }

  readyData(data){
    this._tableData = [];
    data.forEach(row => {
      let r = {};
      Object.keys(row).forEach(key => {
        if( typeof row[key] == 'object'){
          r[key] = row[key].Caption;
        }else{
          r[key] = row[key];
        }
      })
      this._tableData.push(r);
    })
    return this._tableData;
  }

  ngAfterViewChecked(){
  }

  ngAfterViewInit(){
    
  }

  updateData(data){
    this.ms.open(UpdateComponent, 'Изменение данных', {data: data});
  }

  show(){
    console.log([this.dHeaders, this.dCells])
  }

  customizeCellFunction(cellBuilder, cellData) {
    let vm = document['vm'];
    if(!cellData.isDrillThrough){
      vm.dCells = [];
      vm.dHeaders = [];
      vm.drilledThrought = false;
    }else{
      vm.drilledThrought = true;
      if(cellData.type == 'header'){
        
        vm.dHeaders[cellData.columnIndex]= cellData.label;
      }else{
        cellBuilder.attr['onclick'] = 'document.vm.onCellClick(this)';
        if(!vm.dCells[cellData.rowIndex]){
          vm.dCells[cellData.rowIndex] = [];
        }
        
        vm.dCells[cellData.rowIndex][cellData.columnIndex] = {
          hierarchy: {
            uniqueName: cellData.hierarchy.uniqueName,
            caption: cellData.hierarchy.caption
          },
          value: !cellData.value? cellData.label : cellData.value,
          row: cellData.rowIndex,
          column: cellData.columnIndex
        };
      }
    }
  }

  onCellClick(event){
    let row = this.mapRow(this.dCells[event.dataset.r]);
    let column = this.dCells[event.dataset.r][event.dataset.c].hierarchy.uniqueName;
    let dataset = this.data.find(r => {
      let res = true;
      for(let key in row){
        if(typeof r[key] == 'object'){
          if(r[key].Caption != row[key]){
            res = false;
            break;
          }
        }else{
          if(r[key] != row[key]){
            res = false;
            break;
          }
        }
      }
      return res;
    })

    if(typeof dataset[column] == 'object'){
      this.updateData(dataset[column]);
    }else{
      let res = {};
      res[column]=dataset[column];
      this.updateData(res);
    }
  }

  mapRow(row: Array<any>){
    let res = {};
    row.forEach(c => {
      res[c.hierarchy.uniqueName] = c.value;
    })
    return res;
  }
}