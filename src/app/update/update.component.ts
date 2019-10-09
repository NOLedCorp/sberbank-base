import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sberbank-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.less']
})
export class UpdateComponent implements OnInit {
  public data:any;
  constructor() { }

  ngOnInit() {
    console.log(this.data);
  }

  get objects() {
    return Object.keys(this.data).map(k => {
      if(typeof this.data[k] != 'object'){
        return {name: k, value: this.data[k]}
      }else{
        return {name: k, value: this.data[k].Caption, object: this.data[k]}
      }
      
    })
  }

  getObject(data){
    return Object.keys(data).map(k => {
      if(typeof this.data[k] != 'object'){
        return {name: k, value: this.data[k]}
      }else{
        return {name: k, value: this.data[k].Caption, object: this.data[k]}
      }
    })
  }
}
