import { _decorator, Component, Node, random } from 'cc';
import { SchemeBase } from '../Script3/Core/SchemeBase.Code';
import { Reactive } from '../Script3/Core/ReactiveDecorator.Code';
import { makeReactive, UnregisterScheme } from '../Script3/Core/Reactivity.Code';
import { DynamicBindBaseCode } from '../Script3/Core/DynamicBindBase.Code';
const { ccclass, property } = _decorator;

class ProfileScheme extends SchemeBase{
	@Reactive("firstName")
	firstName:string="Mahdi";

	@Reactive("lastName")
	lastName:string="Hosseini";
	
	@Reactive("age")
	age:number=38;

	@Reactive("schemeName")
	schemeName:string="";

	constructor(schemeName:string){
    super(schemeName);
  }

  override MakeReactive(): any {   
    return makeReactive(this,this.__SchemeName);
  }

} 


@ccclass('UserItemCode')
export class UserItemCode extends DynamicBindBaseCode {
	profile: ProfileScheme;
	profileSchemeName:string="";


	start() {
		this.profileSchemeName = `profile ${~~(random()*1000)}`;
		this.profile = new ProfileScheme(this.profileSchemeName).MakeReactive();
		this.profile.schemeName = this.profileSchemeName;
	}

	protected onDestroy(): void {
		UnregisterScheme(this.profileSchemeName);
	}

}


