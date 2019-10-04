import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import the PivotViewModule for the pivot table component
import { PivotViewAllModule, PivotFieldListAllModule } from '@syncfusion/ej2-angular-pivotview';
import { AppComponent }  from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { WebDataRocksPivot } from './webdatarocks/webdatarocks.angular4';

@NgModule({
  //declaration of ej2-angular-pivotview module into NgModule
  imports:      [ BrowserModule, PivotViewAllModule, PivotFieldListAllModule, HttpClientModule ],
  declarations: [ AppComponent, WebDataRocksPivot ],
  bootstrap:    [ AppComponent ],
  providers: [HttpClient]
})
export class AppModule { }