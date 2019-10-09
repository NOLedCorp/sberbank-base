import { ElementRef, ViewContainerRef, ComponentFactoryResolver, Type, Injectable } from '@angular/core';

@Injectable()
export class ModalService{
    public header:string;
    public modal:ViewContainerRef;
    private _show:boolean = false;

    get show() {return this._show};

    constructor(private componentFactoryResolver:ComponentFactoryResolver){}

    open(component: Type<any>, header = 'Заголовок модального окна', input?){
        this.modal.clear();
        let newComponent = this.componentFactoryResolver.resolveComponentFactory(component);
        let newComponentRef = this.modal.createComponent(newComponent);
        this._show=true;
        this.header = header;
        document.querySelector('body').style.overflow='hidden';
        if(input){
            (<any>newComponentRef.instance) = Object.assign(newComponentRef.instance, input);
        }
        
    }

    close(){
        this._show=false;
        document.querySelector('body').style.overflow='unset';
        this.modal.clear();
    }
}