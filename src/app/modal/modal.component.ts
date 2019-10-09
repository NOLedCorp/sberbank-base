import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef, AfterViewInit } from '@angular/core';
import { ModalService } from '../sevices/modal.service';

@Component({
  selector: 'sberbank-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.less']
})
export class ModalComponent implements AfterViewInit {
  @ViewChild("body", {read: ViewContainerRef, static: false}) body: ViewContainerRef;

  constructor(public ms:ModalService) { }

  ngAfterViewInit() {
    this.ms.modal = this.body;
  }

}