// Define a decorator function to mark properties as reactive
export function Reactive(path: string) {
  return function (target: any, key: string) {
      // Initialize the reactive properties if not already initialized
      if (!target._reactiveProperties) {
          target._reactiveProperties = {};
      }
      // Add the property key to the map of reactive properties along with the path
      target._reactiveProperties[key] = path;
  }
}