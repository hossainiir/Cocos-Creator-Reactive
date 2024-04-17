export class SchemeBase{
  __SchemeName:string;
  constructor(schemeName:string){
    this.__SchemeName = schemeName;
  }

	MakeReactive():any{
		return makeReactive(this,this.__SchemeName);		
	}
	
  public static update(obj:any,newValue:any){
    if (typeof newValue !== 'object' || newValue === null || !obj) {
      return;
    }

    for (const key in newValue) {
        if (newValue.hasOwnProperty(key)) {
            if(Array.isArray(newValue[key])){
              obj[key].splice(0, obj[key].length)
              obj[key] = [...newValue[key]];
              continue;
            }
            if (typeof newValue[key] === 'object' && newValue[key] !== null) {
                this.update(obj[key], newValue[key]);
            } else {
                obj[key] = newValue[key];
            }
        }
    }  
  }
}
