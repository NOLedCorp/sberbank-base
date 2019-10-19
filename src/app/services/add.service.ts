import { Injectable, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

@Injectable()
export class AddService{
    private _item:any;
    @Input() public set item(item){
        this._item = item;
        this.update = {};
    };
    @Input() items:any;
    public update = {};
    private _addForm:FormGroup;
    public submitted = false;
    public files = {};
    private _checkUpdate;
    constructor(checkUpdate: boolean = true){
        this._checkUpdate = checkUpdate;
    }
    public get addForm(){
        return this._addForm;
    }

    public get item(){
        return this._item;
    }
    public set addForm(form:FormGroup){
        this._addForm = form;
        if(this._checkUpdate){
            this.setSubscriptions();
        }
        
    }
    setSubscriptions(){
        Object.keys(this.addForm.controls).forEach(controlName => {
            this._addForm.controls[controlName].valueChanges.subscribe(c => {
                if(this.item){
                    if(this.item[controlName]!=c){
                        if(this.addForm.controls[controlName] instanceof FormGroup){
                            if(JSON.stringify(this.item[controlName]) !== JSON.stringify(Object.values(c))){
                                this.update[controlName]=Object.values(c);
                            }else{
                                delete this.update[controlName]; 
                            }
                        }else{
                            this.update[controlName]=c;
                        }
                        
                    }else{
                        delete this.update[controlName];
                    }
                }
            })
        })
    }
    getValue(v){
        if(v){
            return v.split('\\')[2];
        }
        
    }
    setFile(e){
      this.files[e.target.id]=e.target.files[0];
    }

    updArray(name, arr){
        this.update[name]=arr;
    }

    deleteItem(parent, arr, name, id){
        parent[arr] = parent[arr].filter(x => x[name]!=id);
        return true;
    }

    generateUpdateRequest(): {data:any, files: FormData}{
        let out: {data:any, files: FormData} = {data:null, files:null};
        Object.keys(this.update).forEach(k => {
            if(this.update[k] instanceof File){
                if(!out.files){
                    out.files = new FormData();
                }
                out.files.set(k, this.update[k], this.update[k].name);
            }else{
                if(!out.data){
                    out.data = {};
                }
                out.data[k]=this.update[k];
            }
        })
        return out;
    }

    public _formatDate(date: Date): any {

        let formatted = date ? ((date.getFullYear()) + '-' + (date.getMonth()+1) + '-' + date.getDate()) : null;
      
        return formatted;
      
      }

    /**
     * Form controls
     */
    get f() { return this.addForm.controls; }

    /**
     * Form values
     */
    get v() { return this.addForm.value; }
    get upd_length() { return Object.keys(this.update).length }
}