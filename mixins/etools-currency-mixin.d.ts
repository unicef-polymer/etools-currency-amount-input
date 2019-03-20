
import { PolymerElement } from '@polymer/polymer';
export {EtoolsCurrency};


interface Constructor<T = {}> {
  new (...args: any[]) : T;
 }
/**
* Currency amount input. US format only.
*/
declare function EtoolsCurrency(base: Constructor<PolymerElement>):
{
 new (...args: any[]): {
   addCurrencyAmountDelimiter(value: any): any;
   displayCurrencyAmount(value: any, placeholder?: any, noOfDecimals?: any): any;
 }
} & Constructor<PolymerElement>;
