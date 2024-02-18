import { Address } from "./Address.Code";
import { SchemeBase } from "../Core/SchemeBase.Code";
import { Reactive } from "../Core/ReactiveDecorator.Code";
import { makeReactive } from "../Core/Reactivity.Code";
import { ResourceModel } from "./ResourceModel.Code";

export interface IUserData{
  name: string;
  age: number;
  address: Address;
  progress:number;
  achievements:AchievementModel[];
  selectedAchievement:AchievementModel;
}

export class UserDataScheme extends SchemeBase implements IUserData {
  @Reactive('name')
  name: string = "Mahdi";
  
  @Reactive('age')
  age: number = 38;

  @Reactive('address')
  address: Address = new Address();

  @Reactive('progress')
  progress:number=0.3;

  @Reactive('achievements')
  achievements: AchievementModel[]=[];

  @Reactive('selectedAchievement')
  selectedAchievement: AchievementModel = new AchievementModel();

  @Reactive("resources")
  resources: ResourcesModel = new ResourcesModel();
  
  constructor(schemeName:string){
    super(schemeName);
  }

  override MakeReactive(): any {   
    this.resources.food = makeReactive(this.resources.food,this.__SchemeName,"resources.food.")
    this.resources.steel = makeReactive(this.resources.steel,this.__SchemeName,"resources.steel.")
    this.resources = makeReactive(this.resources,this.__SchemeName,"resources.")
    this.address = makeReactive(this.address,this.__SchemeName,"address.");
    this.selectedAchievement = makeReactive(this.selectedAchievement,this.__SchemeName,"selectedAchievement.");
    return makeReactive(this,this.__SchemeName);
  }

}

export class UserDataModel implements IUserData{
  achievements: AchievementModel[]=[];
  name: string;
  age: number;
  address: Address;
  progress: number;
  selectedAchievement: AchievementModel = new AchievementModel();  
}


export class AchievementModel{
  @Reactive('name')
  name:string;
  @Reactive('points')
  points:number;
}

export class ResourcesModel{
  @Reactive("food")
  food:ResourceModel=new ResourceModel();

  @Reactive("steel")
  steel:ResourceModel=new ResourceModel();
}