import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import the PivotViewModule for the pivot table component
import { PivotViewAllModule, PivotFieldListAllModule } from '@syncfusion/ej2-angular-pivotview';
import { AppComponent }  from './app.component';

@NgModule({
  //declaration of ej2-angular-pivotview module into NgModule
  imports:      [ BrowserModule, PivotViewAllModule, PivotFieldListAllModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }