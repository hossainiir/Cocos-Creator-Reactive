import { Reactive } from "../Core/ReactiveDecorator.Code";

export class ResourceModel{
  @Reactive("amount")
  amount:number=0;
  @Reactive("production")
  production:number=0;
  @Reactive("storage")
  storage:number=0;
  @Reactive("safe")
  safe:number=0;
}