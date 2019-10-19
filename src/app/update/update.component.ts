import { Component, OnInit } from '@angular/core';
import { AddService } from '../services/add.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'sberbank-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.less']
})
export class UpdateComponent extends AddService implements OnInit {
  public data:any;
  constructor() { super() }

  ngOnInit() {
    // console.log(this.data);
    this.item = this.data;
    this.addForm = new FormGroup({});
    Object.keys(this.data).forEach(x=>{
      // console.log(x)
      // console.log(this.data[x])
      this.addForm.addControl(x, new FormControl(this.data[x]));
    })
    // console.log(this.addForm);
    this.setSubscriptions();
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

  getControls(){
    return Object.keys(this.addForm.controls);
  }

  updateData(){
    if(this.addForm.invalid){
      return;
    }
    console.log(this.update)
  }
}
