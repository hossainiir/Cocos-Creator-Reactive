# Cocos Creator Reactive 
This repo will provide reactive features for Cocos Creator projects.
By using this lib you are able to bind data to the CC component in an easy way.

## Main features
- Easy to use in any project
- Will remove a lots of boilerplate codes
- Supporting 2 way binding
- Supporting in editor loops
- Nested Object Binding is supported
- Label, RichText, EditBox, Slider and ProgressBar are supported
- Formatting text is supported for Label and RichText
- Using ES6 Proxy features
- The code has been written as simple as possible  

## Limitations
- Arrays are stateless
- A few memomry managment is required 

## Instruction

To utilize reactivity in your projects, you just need copy/paste Core folder in your projects.

### *Core Files*
- `ReactiveDecorator.Code.ts` provides `@Reactive()` decorator for reactive properties.

- `Reactivity.Code.ts` this the heart of reactivity, place where all procedures related to reactivity are happening.

- `SchemeBase.Code.ts` all class which yopu need to be reactive must extend this class.

- `SchemeBinderComponent.Code.ts` this component must be added to the nodes which need to present data and binding.

### *Scheme Classes*
All classes that have the reactivity features are called ***Scheme***, to make a class Scheme you must extend `SchemeBase.Code.ts`. 
In fact Scheme Classes are responsible for binding data to view, like what ViewModel in MVVM design pattern.
To use Schemes you need to follow the instruction correctly.


## Let's check simplest example!
### 1. Define a scheme class 
```
import { makeReactive } from "../Core/Reactivity.Code";
import { SchemeBase } from "../Core/SchemeBase.Code";
class MySimplestScheme extends SchemeBase{
	@Reactive('name')
	name: string = "Mahdi";

	constructor(schemeName:string){
		super(schemeName);
	}

	override MakeReactive(): any { 
		return makeReactive(this,this.__SchemeName);
	}
}
```
`MySimplestScheme` now is ready to use!

### 2. Initiate and use `MySimplestScheme` in a component

```
import { SchemeBase } from './Core/SchemeBase.Code';
import { MySimplestScheme } from './MySimplestScheme';

@ccclass('BindTestComponentCode')
export class BindTestComponentCode extends Component {
	_mySimplestScheme:MySimplestScheme;

	protected onLoad(): void {
		this._mySimplestScheme = new MySimplestScheme("myFirstScheme").MakeReactive();
	}

	onButtonClick(){
		this._mySimplestScheme.name = "David";
		//The following code is same as top code
		//SchemeBase.update(this._mySimplestScheme,{name:"David"});
	}
}
```

### 3. Bind scheme to a Label component in CC editor
It is so simple, add `SchemeBinderComponent.Code.ts` to a label component like following image
![](images/label-bind.png?raw=true)

### That is it!!
Now anywhere in your entire project when `_mySimplestScheme.name` changed, the text of Lable will change!

## Advanced Usages
You can check full features by running this project!

### Important Notes
- If you use `$` at the begining the name of SchemeName which in our Simplest example was `myFirstScheme` will make the scheme permanent and you CANN'T destroy it when your app is running!

- `{{$$}}` use this in formatter section of `SchemeBinderComponent` to place the value of property.

- `Your score is <color=#ff0000>{{($$).toFixed(3)}}</color> !` this is an advanced sample of formatting

- Using nested objects is a little tricky, check the sample

- The sample is working properly and all features are implemented, however, I didn't have enough time to make better UI/UX for it!

