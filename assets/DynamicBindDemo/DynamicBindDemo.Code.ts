import { _decorator, Component, Node } from 'cc';
import { DynamicBindBaseCode } from '../Script3/Core/DynamicBindBase.Code';
import { SchemeBase } from '../Script3/Core/SchemeBase.Code';
import { Reactive } from '../Script3/Core/ReactiveDecorator.Code';
import { makeReactive, UnregisterScheme } from '../Script3/Core/Reactivity.Code';
const { ccclass, property } = _decorator;

class ProfileScheme extends SchemeBase{
	@Reactive("firstName")
	firstName:string="Mahdi";

	@Reactive("lastName")
	lastName:string="Mahdi";
	
	@Reactive("age")
	age:number=38;

	constructor(schemeName:string){
    super(schemeName);
  }

  override MakeReactive(): any {   
    return makeReactive(this,this.__SchemeName);
  }

} 

@ccclass('DynamicBindDemoCode')
export class DynamicBindDemoCode extends DynamicBindBaseCode {

	profile: ProfileScheme;
	profileSchemeName:string="";

	protected onLoad(): void {
		this.profileSchemeName = "profile";
		this.profile = new ProfileScheme(this.profileSchemeName).MakeReactive();
	}

	protected onDestroy(): void {
		UnregisterScheme(this.profileSchemeName);
	}
}


