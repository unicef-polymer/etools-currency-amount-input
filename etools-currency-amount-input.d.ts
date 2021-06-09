/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   etools-currency-amount-input.js
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

import {EtoolsCurrency} from './mixins/etools-currency-mixin.js';

/**
 * `etools-currency-amount-input`
 *
 * A paper-input element that allows only currency amount values (US format). It accepts only digits, comma, a
 * a single floating point (period), and allows 2 decimals. The maximum number you can have 12 digits until
 * floating point.
 * The value displayed it's paper-input's internal value. The `value` property of this element will update and format
 * the internal value and when internal value is changed, element's value will be updated with current float value.
 *
 * ### Usage
 * ```html
 * <etools-currency-amount-input label="Amount value"
 * value="{{value}}" currency="$"></etools-currency-amount-input>
 * ```
 *
 * ### Style
 *
 * Use CSS properties and mixin of paper-input to style the element or:
 *
 * `--etools-currency-input` | Mixin applied to currency element | `{}`
 */
declare class EtoolsCurrencyAmountInput extends EtoolsCurrency(PolymerElement) {
  label: string|null|undefined;
  noLabelFloat: boolean|null|undefined;
  _internalValue: string|null|undefined;
  value: any;
  placeholder: string|null|undefined;
  readonly: boolean|null|undefined;
  disabled: boolean|null|undefined;
  required: boolean|null|undefined;
  autoValidate: boolean|null|undefined;
  invalid: boolean|null|undefined;
  errorMessage: string|null|undefined;
  currency: string|null|undefined;
  _currentKeyPressed: string|null|undefined;
  _charsLimit: number|null|undefined;
  fractionalDigits: number;
  _updateStyles(readonly: any, disabled: any, invalid: any): void;
  _computeAutovalidate(autoValidate: any, readonly: any): any;
  validate(): any;
  _getStrValue(value: any): any;
  _onValueChange(value: any): void;
  _restoreDamagedInternalValue(value: any, ironInput: any, currentCursorPossition: any): void;
  _getInputElement(): any;

  /**
   * Internal value changed, needs to be checked and changed to US currency format
   */
  _onInternalValueChange(value: any, oldValue: any): void;
  _getUpdatedCursorPosition(value: any, charsAfterCursor: any, oldValue: any): any;

  /**
   * Update element value with the float value of _internalValue
   */
  _setExternalValue(value: any, preserveFloatingPoint: any): void;
  _formatValue(value: any): any;
  _updateElementInternalValue(value: any, ironInput: any, cursorPos: any): void;
  _applyCurrencyAmountFormat(value: any): any;
  _getValueWithoutFormat(value: any, decimalsNr: any, needsStrValue: any): any;
  _emptyValue(value: any): any;
  _getRealNumberValue(value: any, decimals: any): any;
  _onKeyDown(e: any): void;
  _onBlur(e: any): void;
}

declare global {

  interface HTMLElementTagNameMap {
    "etools-currency-amount-input": EtoolsCurrencyAmountInput;
  }
}
