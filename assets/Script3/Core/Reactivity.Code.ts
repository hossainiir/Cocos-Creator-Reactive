import { SchemeBinderComponent } from "./SchemeBinderComponent.Code";

const schemes:Map<string,typeof Proxy>=new Map<string,typeof Proxy>();
const SchemeBinderComponents : Map<string,SchemeBinderComponentHolder> = new Map<string,SchemeBinderComponentHolder>();

export function RegisterComponent(component:SchemeBinderComponent){
  let key = `${component.SchemeName}.${component.PropertyName}`;
  let r = SchemeBinderComponents.get(key);
  if(!r){
    SchemeBinderComponents.set(key,new SchemeBinderComponentHolder());
  }
  r = SchemeBinderComponents.get(key);
  let c = r.components.get(component.uuid);
  if(!c){
    r.components.set(component.uuid,component);
  }

  let rc = schemes.get(component.SchemeName);
  let path = component.PropertyName.split(".");
  let a = rc;
  path.forEach((ch)=>a = a[ch]);
  component.Update(a);
}

export function UnregisterComponent(component:SchemeBinderComponent){
  let key = `${component.SchemeName}.${component.PropertyName}`;
  SchemeBinderComponents.delete(key);
}

export function UnregisterScheme(SchemeName:string){
  if(SchemeName[0] == "$")
    throw `${SchemeName} is defined as permanent, it is not destroyable!`

  schemes.delete(SchemeName);
  console.log(schemes);
  
  for (const key of SchemeBinderComponents.keys()) {
    // Check if the key starts with "UserData"
    if (key.startsWith(SchemeName)) {
        // Delete the entry from the map
        // SchemeBinderComponents.delete(key);
        SchemeBinderComponents.get(key).components.forEach(c=>{
          c.node.destroy();
        });
    }
  }  
}

export function UpdateScheme(SchemeName:string,property:string,value:any){
  let r = schemes.get(SchemeName);
  let keys = property.split(".");
  let nestedObj = r;

  // Traverse the object based on the keys in the path
  for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      nestedObj = nestedObj[key];
      if (!nestedObj) {
          // Handle cases where the intermediate keys do not exist
          return;
      }
  }

  // Update the nested property
  const lastKey = keys[keys.length - 1];
  nestedObj[lastKey] = value;
}

function Update(SchemeName:string,propertyName:string,value:any){
  let key = `${SchemeName}.${propertyName}`;
  let cs = SchemeBinderComponents.get(key);
  if(cs)
    cs.components.forEach((c)=>{c.Update(value);})
}

// Define a function to recursively make an object reactive
export function makeReactive<T extends object>(obj: any,SchemeName:string,decoratorPrefix:string=""): T {

  // Get the map of reactive properties
  const reactiveProperties = obj._reactiveProperties;
  // Create a Proxy for the object
  let pr = new Proxy(obj, {
      // get(target,property,receiver){
      //   console.log("GET",target);
      //   return Reflect.get(target, property, receiver);
      // },
      set(target, key, value) {
          // Check if the property being set is marked as reactive
          if (reactiveProperties && reactiveProperties[key]) {
              // updateCallback(reactiveProperties[key]); // Trigger update callback with the path              
              Update(SchemeName,decoratorPrefix+reactiveProperties[key],value);
          }
          // If the new value is an object, make it reactive as well
          if (typeof value === 'object' && value !== null) {
              // Get the map of reactive properties for nested objects
              const nestedReactiveProperties = value._reactiveProperties;
              // If nested reactive properties exist, make the nested object reactive
              if (nestedReactiveProperties) {
                  // target[key] = makeReactive(value, updateCallback);
              } else {
                  // Otherwise, set the value directly
                  target[key] = value;
              }
          } else {
              target[key] = value;
          }
          return true;
      }
  });

  schemes.set(SchemeName,pr);
  return pr;
}

class SchemeBinderComponentHolder{
  components:Map<string,SchemeBinderComponent>=new Map<string,SchemeBinderComponent>();
}