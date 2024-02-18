import { _decorator, CCString, Component, EditBox, Enum, instantiate, Label, Node, ProgressBar, RichText, Slider } from 'cc';
import { RegisterComponent, UnregisterComponent, UpdateScheme } from './Reactivity.Code';
const { ccclass, property } = _decorator;

export enum EnBinderType{
	Binder,
	Repeater,
	ItemBinder
}

@ccclass('SchemeBinderComponent')
export class SchemeBinderComponent extends Component {
	private _componentType:typeof Component|typeof Label|typeof RichText|typeof EditBox | typeof ProgressBar| typeof Slider | null = null;
	private static readonly _supportedComponents:typeof Component[]=[Label,EditBox,RichText,ProgressBar,Slider];

	@property({
		type:CCString,
		visible:function(this:SchemeBinderComponent){
			return this.BinderType != EnBinderType.ItemBinder
		}
	})
	SchemeName:string="";

	@property(CCString)
	PropertyName:string="";

	@property({
		type:CCString,
		multiline:true,
		visible:function( this: SchemeBinderComponent ) { 
			this._detectComponentType();
			return this._componentType == Label || this._componentType == RichText; 
		}
	})
	FormatterText:string="";

	@property({type:Enum(EnBinderType)})
	BinderType:EnBinderType=EnBinderType.Binder;

	@property({
		type:Node,
		visible:function( this: SchemeBinderComponent ) { 
			return this.BinderType == EnBinderType.Repeater; 
		}
	})
	ItemTemplate:Node=null;

	@property({
		type:Node,
		visible:function( this: SchemeBinderComponent ) { 
			return this.BinderType == EnBinderType.Repeater; 
		}
	})
	ItemContainer:Node=null;


	protected onLoad(): void {
		switch(this.BinderType){
			case EnBinderType.Binder:
				this._initBinder();
				break;
			case EnBinderType.Repeater:
				this._initRepeater();
				break;
			case EnBinderType.ItemBinder:
				this._initItemBinder();
				break;
		}
	}

	private _initBinder(){
		this._detectComponentType();

		switch(this._componentType){
			case EditBox:
				this.node.on(EditBox.EventType.TEXT_CHANGED,this.onTextChanged, this);
				break;
			case Slider:
				this.node.on("slide",this.onSlide, this);
				break
		}
	}

	private _initRepeater(){
		if(!this.ItemTemplate || !this.ItemContainer)
			throw "ItemTemplate and ItemContainer must have value!";
		this.ItemTemplate.active = false;
	}

	private _initItemBinder(){
		this._detectComponentType();
		switch(this._componentType){
			case EditBox:
				this.node.on(EditBox.EventType.TEXT_CHANGED,this.onTextChanged, this);
				break;
			case Slider:
				this.node.on("slide",this.onSlide, this);
				break
		}
	}

	private _detectComponentType(){
		SchemeBinderComponent._supportedComponents.forEach((c)=>{
			let a = this.getComponent(c);
			if(a)
				this._componentType = c;
		});
	}

	start() {
		if(this.BinderType != EnBinderType.ItemBinder)
			RegisterComponent(this);		
	}

	private onTextChanged() {
		UpdateScheme(this.SchemeName,this.PropertyName,this.getComponent(EditBox).string);
	}

	private onSlide(){
		UpdateScheme(this.SchemeName,this.PropertyName,this.getComponent(Slider).progress);
	}

	Update(value:any){
		switch(this.BinderType){
			case EnBinderType.Binder:
			case EnBinderType.ItemBinder:
				this._updateBinder(value);
				break
			case EnBinderType.Repeater:
				this._updateRepeater(value);
				break;
		}
	}

	private _updateBinder(value:any){
		if(!this._componentType)
			this._detectComponentType();

		let a = this._manipulate(value);
		switch(this._componentType){
			case Label:
				this.node.getComponent(Label).string = a;
				break;
			case RichText:
				this.node.getComponent(RichText).string = a.toString();
				break;
			case EditBox:
				this.node.getComponent(EditBox).string = a;      
				break;
			case ProgressBar:
				this.node.getComponent(ProgressBar).progress = a;
				break;
			case Slider:
				this.node.getComponent(Slider).progress = a;
				break;
		}
	}

	private _manipulate(value:any):any{
		if(!this.FormatterText || this._componentType == ProgressBar || this._componentType == ProgressBar)
			return value;
		try {
			const regex = /(.*){{(.*?)}}(.*)/;
			const match = regex.exec(this.FormatterText);

			let inner = match[2].replace("$$",value.toString());
			const regexForEval = /\.(\w+)\((.*?)\)/;
			const matchForEval = regexForEval.exec(inner);
			if(matchForEval){
				 inner = eval(inner);
			}
	
			return `${match[1]}${inner}${match[3]}`;				
		} catch (error) {
			throw `Mainpulation Error=> ${error}, ${this.FormatterText}, ${value}`
		}
	}

	private _updateRepeater(value:any|Array<any>){
		this.ItemContainer.removeAllChildren();
		value.forEach(element => {
			let a = instantiate(this.ItemTemplate);
			a["data"] = element;
			a.children.forEach(el=>{
				let sc = el.getComponent(SchemeBinderComponent);
				if(sc)
					sc.Update(element[sc.PropertyName]);
			});
			a.active = true;
			this.ItemContainer.addChild(a);      
		});
	}

	onDestroy(): void {
		if(this.BinderType != EnBinderType.ItemBinder)
			UnregisterComponent(this);
	}
}

