import { Reactive } from "../Core/ReactiveDecorator.Code";

export class Address{
  @Reactive('city')
  city: string="Tehran";
  @Reactive('country')
  country: string="Iran";
}