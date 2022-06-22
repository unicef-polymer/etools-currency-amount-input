import {addCurrencyAmountDelimiter, displayCurrencyAmount} from './etools-currency-module';
import {Constructor} from 'lit-element';

/**
 * Currency amount input. US format only.
 * @polymer
 * @mixinFunction
 */

export function EtoolsCurrency<T extends Constructor<any>>(baseClass: T) {
  return class extends baseClass {
    /**
     * Format value as currency amount. Delimited used ', '
     */
    addCurrencyAmountDelimiter(value: any) {
      return addCurrencyAmountDelimiter(value);
    }

    /**
     * Format value as currency amount and return it to be displayed
     * Use this to display readonly currency amounts on interface
     */
    displayCurrencyAmount(value: any, placeholder: any, noOfDecimals: any) {
      return displayCurrencyAmount(value, placeholder, noOfDecimals);
    }
  };
}
