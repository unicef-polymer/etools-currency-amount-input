
import { PolymerElement } from '@polymer/polymer';
export {EtoolsCurrency};


interface Constructor<T = {}> {
  new (...args: any[]) : T;
 }
/**
* Currency amount input. US format only.
*/
declare function EtoolsCurrency<T extends Constructor<PolymerElement>>(base: T):
{
 new (...args: any[]): {
   addCurrencyAmountDelimiter(value: any): any;
   displayCurrencyAmount(value: any, placeholder?: any, noOfDecimals?: any): any;
 }
} & T & Constructor<PolymerElement>;
