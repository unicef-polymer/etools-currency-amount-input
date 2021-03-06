import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

/**
 * Currency amount input. US format only.
 * @polymer
 * @mixinFunction
 */
export const EtoolsCurrency = dedupingMixin(superClass => class extends superClass {
  /**
   * Format value as currency amount. Delimited used ', '
   */
  addCurrencyAmountDelimiter(value) {
    if (!value) {
      return '';
    }
    value = value.toString();
    if (value === '') {
      return '';
    }
    return value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  /**
   * Format value as currency amount and return it to be displayed
   * Use this to display readonly currency amounts on interface
   */
  displayCurrencyAmount(value, placeholder, noOfDecimals) {
    if (!placeholder) {
      placeholder = '—';
    }
    if (typeof noOfDecimals !== 'number') {
      noOfDecimals = 2;
    }
    if (!value) {
      return placeholder;
    }
    let floatValue = parseFloat(value).toFixed(noOfDecimals);
    if (isNaN(floatValue)) {
      return placeholder;
    }

    return this.addCurrencyAmountDelimiter(floatValue);
  }
});
