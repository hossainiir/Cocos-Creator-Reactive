import { _decorator, Component, Label, Node } from 'cc';
import { UserDataModel, UserDataScheme } from './Models/UserDataReactive.Code';
import { SchemeBase } from './Core/SchemeBase.Code';
import { Address } from './Models/Address.Code';
import { UnregisterScheme } from './Core/Reactivity.Code';
const { ccclass, property } = _decorator;

@ccclass('BinderComponentCode')
export class BinderComponentCode extends Component {
	@property(Node)
	TempNode:Node=null;

	data:UserDataScheme;
	tempData:UserDataScheme;

	protected onLoad(): void {		
		this.data = new UserDataScheme("$UserData").MakeReactive();
		this.tempData = new UserDataScheme("UserData").MakeReactive();
		let r = [{name:"First Blood",points:100},{name:"Fast Kill",points:100}];
		// this.data.resources.food.amount = 200;
		this.data.achievements = r;
		SchemeBase.update(this.data,{
			resources:{
				food:{amount:300,storage:1500,production:0.2,safe:750},
				steel:{amount:251,storage:1500,production:0.31,safe:750},
			}
		});

		this.schedule(()=>{
			this.data.resources.food.amount += this.data.resources.food.production
			this.data.resources.steel.amount += this.data.resources.steel.production
		},1);
	}

	onUpdateResourceClick(){
		this.TempNode.active = false;
		this.TempNode.removeFromParent();
		this.TempNode.destroyAllChildren();
		UnregisterScheme("UserData")
	}

	start() {
	}

	onButtonClick(){
		
		//By following method scheme content can be updated

		//1.update scheme by direct property
		// this.data.address.country = "US";

		//2.Update scheme by an object
		// SchemeBase.update(this.data,{
		// 	address:{country:"UK"},
		// 	progress:0.85,
		// 	achievements:[
		// 		{name:"First Blood",points:100},
		// 		{name:"Fast Kill",points:100}]
		// 	}
		// );

		//3.Update scheme by related model
		var a = new UserDataModel();
		a.progress = 0.15;
		a.name = "San Davis";
		a.age = 27;
		let ad = new Address();
		ad.city="Meriland";
		ad.country = "US";
		a.address = ad;
		a.achievements.push({name:"First Blood",points:35});
		a.achievements.push({name:"Fast Kill",points:25});
		a.achievements.push({name:"Double Kill",points:18});
		a.achievements.push({name:"Rampage",points:1});
		SchemeBase.update(this.data,a);

		//NOTE: Arrays are Stateless!!!		
		//Array Usage
		// let r = [{name:"First Blood",points:100},{name:"Fast Kill",points:100}];
		// SchemeBase.update(this.data,{achievements:r});
		// this.data.achievements = r;
	}

	selectedAchievement:any;
	onAchievmentItemClick(a,b){
		console.log(a);
		
		if(a.target == this.selectedAchievement)
			return;
		if(this.selectedAchievement!=null){
			(this.selectedAchievement as Node).getChildByName("Selector").active = false;
		}
		(a.target as Node).getChildByName("Selector").active = true;
		this.selectedAchievement = a.target;

		SchemeBase.update(this.data,{selectedAchievement:a.target.data});
		// this.data.selectedAchievement.name = a.target.data.name;//a.target.data;
	}
}


