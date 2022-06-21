import {addCurrencyAmountDelimiter, displayCurrencyAmount} from './etools-currency-module';

/**
 * Currency amount input. US format only.
 * @polymer
 * @mixinFunction
 */
export const EtoolsCurrency = (superClass) =>
  class extends superClass {
    /**
     * Format value as currency amount. Delimited used ', '
     */
    addCurrencyAmountDelimiter(value) {
      return addCurrencyAmountDelimiter(value);
    }

    /**
     * Format value as currency amount and return it to be displayed
     * Use this to display readonly currency amounts on interface
     */
    displayCurrencyAmount(value, placeholder, noOfDecimals) {
      return displayCurrencyAmount(value, placeholder, noOfDecimals);
    }
  };
