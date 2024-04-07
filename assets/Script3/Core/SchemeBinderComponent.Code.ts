import { _decorator, CCString, Component, EditBox, Enum, instantiate, Label, Node, ProgressBar, RichText, Slider, Toggle, Sprite, Color } from 'cc';
import { RegisterComponent, UnregisterComponent, UpdateScheme } from './Reactivity.Code';
import { DynamicBindBaseCode } from './DynamicBindBase.Code';
const { ccclass, property } = _decorator;

export enum EnBinderType{
	Binder,
	Repeater,
	ItemBinder,
	Visibility,
	Color
}

export enum EnBindMode{
	Static,
	Dynamic
}

@ccclass('SchemeBinderComponent')
export class SchemeBinderComponent extends Component {
	private _componentType:typeof Component|typeof Label|typeof RichText|typeof EditBox | typeof ProgressBar| typeof Slider | typeof Toggle | typeof Sprite | null = null;
	private static readonly _supportedComponents:typeof Component[]=[Label,EditBox,RichText,ProgressBar,Slider,Toggle];

	@property({type:Enum(EnBindMode)})
	BindMode:EnBindMode=EnBindMode.Static;

	@property({type:DynamicBindBaseCode,
		visible:function(this:SchemeBinderComponent){
			return this.BindMode == EnBindMode.Dynamic;
		}
	})
	Target:DynamicBindBaseCode|null=null;

	@property({type:Enum(EnBinderType)})
	BinderType:EnBinderType=EnBinderType.Binder;

	@property({
		type:CCString,
		visible:function(this:SchemeBinderComponent){
			return (this.BinderType != EnBinderType.ItemBinder) && this.BindMode == EnBindMode.Static;
		}
	})
	public get SchemeName() : string {
		return this.BindMode == EnBindMode.Static ? this._schemeName : this.Target[this.SchemeNameHolder];
	}
	public set SchemeName(v : string) {
		this._schemeName = v;
	}
	@property
	_schemeName:string="";
	
	@property({
		type:CCString,
		visible:function(this:SchemeBinderComponent){
			return (this.BinderType != EnBinderType.ItemBinder) && this.BindMode == EnBindMode.Dynamic;
		}
	})
	SchemeNameHolder:string="";

	@property(CCString)
	PropertyName:string="";

	@property({
		type:CCString,
		multiline:true,
		visible:function( this: SchemeBinderComponent ) { 
			this._detectComponentType();
			return (this._componentType == Label || this._componentType == RichText) && this.BinderType != EnBinderType.Color; 
		}
	})
	FormatterText:string="";

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
			case EnBinderType.Color:
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
			case Toggle:
				this.node.on("toggle",this.onToggle,this);
				break;
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
				break;
		}
	}

	private _detectComponentType(){
		SchemeBinderComponent._supportedComponents.forEach((c)=>{
			let a = this.getComponent(c);
			if(a)
				this._componentType = c;
		});
		//Most of ui component such as EditBox, Toggle, ProgressBar and Slider have Sprite Component, so here we must check for Sprite component.
		if(!this._componentType){
			this._componentType = Sprite;
		}
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
			case EnBinderType.Visibility:
				this._updateVisibility(value);
				break;
			case EnBinderType.Color:
				this._updateColor(value);
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
			case Toggle:
				this.node.getComponent(Toggle).isChecked = a;
				break;
		}
	}

	private onToggle(toggle: Toggle){
		UpdateScheme(this.SchemeName,this.PropertyName,toggle.isChecked);
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

	private _updateVisibility(value:any){
		this.node.active = value;
	}

	private _updateColor(value:string|Color){
		let color = value instanceof Color ? value : new Color().fromHEX(value);
		if(this._componentType == Sprite)
			this.node.getComponent(Sprite).color = color;
		else if(this._componentType == Label)
			this.node.getComponent(Label).color = color;
	}

	onDestroy(): void {
		if(this.BinderType != EnBinderType.ItemBinder)
			UnregisterComponent(this);
	}
}

