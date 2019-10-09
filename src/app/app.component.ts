import { Component, OnInit, ViewChild, AfterViewChecked, AfterViewInit } from '@angular/core';
import { IDataOptions, IDataSet, GroupingBarService, FieldListService, CalculatedFieldService, CellEditSettings } from '@syncfusion/ej2-angular-pivotview';
import { GridSettings } from '@syncfusion/ej2-pivotview/src/pivotview/model/gridsettings';
import { enableRipple } from '@syncfusion/ej2-base';
import { HttpClient } from '@angular/common/http';
import { WebDataRocksPivot } from './webdatarocks/webdatarocks.angular4';
import { ModalService } from './sevices/modal.service';
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

  cells = null;
  popUpContainer: HTMLDivElement = null;
  private _currentCells = null;
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
    if(!this.popUpContainer){
      this.popUpContainer = document.querySelector("#wdr-drillthrough-view");
      if(!this.popUpContainer){
        return;
      }
    }else{
      if(this.popUpContainer.style.display != 'none'){
        let btn = (<HTMLElement>this.popUpContainer.querySelector(".wdr-fields-view-wrap"));
        btn.style.display = "none"
        
        let headers = this.pivot1.webDataRocks.getAllHierarchies();
        let headersHTML = this.popUpContainer.querySelectorAll(".wdr-header:not(.wdr-empty)");
        let allCells = this.popUpContainer.querySelectorAll(".wdr-grid-container .wdr-cell:not(.wdr-total):not(.wdr-header):not(.wdr-sheet-header):not(.wdr-empty)");
        this.cells = [];
        for(let i = 0; i<allCells.length;i++){
          let j = Math.floor(i/headersHTML.length);
          if(!this.cells[j]) this.cells[j]={};
          this.cells[j][headers.find(x => x.caption == headersHTML[i%headersHTML.length].innerHTML).uniqueName] =  allCells[i].innerHTML;
          let vm = this;
          (<HTMLElement>allCells[i]).onclick = function(event){
            vm.onCellClick(event.target);
          }
        }
      }else{
        return;
      }
    }
    
    
    
    
  }
  ngAfterViewInit(){
    
  }
  updateData(data){
    this.ms.open(UpdateComponent, 'Изменение данных', {data: data});
  }

  onCellClick(event){
    
    let row = this.cells[event.dataset.r-1];
    let index = this._tableData.findIndex(x => {
      let res = true;
      for(let key of Object.keys(x)){
        if(/^[\d\s]+$/.test(row[key]) && typeof row[key] == 'string'){
          row[key] = parseInt(row[key].replace(/\D+/g,""));
        }
        if(x[key]!=row[key]){
          res = false;
          break;
        }
      }
      return res;
    })
    let headers = this.pivot1.webDataRocks.getAllHierarchies();
    let headersHTML = this.popUpContainer.querySelectorAll(".wdr-header:not(.wdr-empty)");
    let collumnName = headers.find(x => x.caption == headersHTML[event.dataset.c].innerHTML).uniqueName;
    if(typeof this.data[index][collumnName] == 'object'){
      this.updateData(this.data[index][collumnName]);
    }else{
      let res = {};
      res[collumnName]=this.data[index][collumnName];
      this.updateData(res);
    }
  }

}