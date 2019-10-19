import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import the PivotViewModule for the pivot table component
import { PivotViewAllModule, PivotFieldListAllModule } from '@syncfusion/ej2-angular-pivotview';
import { AppComponent }  from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { WebDataRocksPivot } from './webdatarocks/webdatarocks.angular4';
import { ModalComponent } from './modal/modal.component';
import { UpdateComponent } from './update/update.component';
import { ModalService } from './services/modal.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  //declaration of ej2-angular-pivotview module into NgModule
  imports:      [ BrowserModule, 
    PivotViewAllModule, 
    PivotFieldListAllModule, 
    HttpClientModule, 
    FormsModule,
    ReactiveFormsModule],
  declarations: [ AppComponent, WebDataRocksPivot, ModalComponent, UpdateComponent ],
  bootstrap:    [ AppComponent ],
  providers: [HttpClient, ModalService],
  entryComponents: [UpdateComponent]
})
export class AppModule { }