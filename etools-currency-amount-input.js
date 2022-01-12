import {LitElement, html} from 'lit-element';
import '@polymer/paper-input/paper-input.js';
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
 *
 * @customElement
 * @polymer
 * @appliesMixin EtoolsCurrency
 * @demo demo/index.html
 */
class EtoolsCurrencyAmountInput extends EtoolsCurrency(LitElement) {
  render() {
    // language=HTML
    return html`
      <style>
        *[hidden] {
          display: none !important;
        }

        :host {
          display: block;
          width: 100%;
          @apply --etools-currency-input;

          --paper-input-prefix: {
            margin-right: 5px;
          }
        }
      </style>

      <paper-input
        id="currencyInput"
        label="${this.label}"
        .value="${this._internalValue}"
        @value-changed="${(e) => this._onInternalValueChange(e.detail.value)}"
        allowed-pattern="[0-9\\.\\,]"
        placeholder="${this.placeholder}"
        ?disabled="${this.disabled}"
        @keydown="${this._onKeyDown}"
        @blur="${this._onBlur}"
        ?readonly="${this.readonly}"
        ?required="${this.required}"
        ?invalid="${this.invalid}"
        @focus="${this._onFocus}"
        ?autoValidate="${this._computeAutovalidate(this.autoValidate, this.readonly)}"
        .errorMessage="${this.errorMessage}"
        ?noLabelFsloat="${this.noLabelFloat}"
      >
        <div slot="prefix" class="prefix" ?hidden="${!this.currency}">${this.currency}</div>
      </paper-input>
    `;
  }

  static get is() {
    return 'etools-currency-amount-input';
  }

  static get properties() {
    return {
      label: String,
      noLabelFloat: Boolean,
      _internalValue: {
        type: String
      },
      value: {
        type: String
      },
      placeholder: {
        type: String
      },
      readonly: {
        type: Boolean,
        reflect: true
      },
      disabled: {
        type: Boolean,
        reflect: true
      },
      required: {
        type: Boolean,
        reflect: true
      },
      autoValidate: {
        type: Boolean,
        reflect: true,
        attribute: 'auto-validate'
      },
      invalid: {
        type: Boolean,
        reflect: true
      },
      errorMessage: {
        type: String
      },
      currency: String,
      _currentKeyPressed: String,
      _charsLimit: {
        type: Number
      },
      noOfDecimals: {
        type: Number
      }
    };
  }

  set value(val) {
    this._value = val;
    this._onValueChange(val);
  }

  get value() {
    return this._value;
  }

  set readonly(val) {
    this._readonly = val;
    if (this._readonly) {
      this.invalid = false;
    }
  }

  constructor() {
    super();
    this._value = null;
    this._charsLimit = 12;
    this.placeholder = '—';
    this.autoValidate = false;
    this.noOfDecimals = 2;
    this.invalid = false;
    this.required = false;
    this.disabled = false;
    this._readonly = false;
    this.errorMessage = 'This field is required';
  }

  _computeAutovalidate(autoValidate, readonly) {
    return readonly ? false : autoValidate;
  }

  validate() {
    return this.shadowRoot.querySelector('#currencyInput').validate();
  }

  _getStrValue(value) {
    try {
      return value === 0 ? '0' : value.toString();
    } catch (error) {
      return '0';
    }
  }

  _onValueChange(value) {
    if (value === null && this._internalValue === '') {
      return;
    }
    let currentValue = value;
    if (currentValue === null || typeof currentValue === 'undefined') {
      this._internalValue = null;
    }
    currentValue = parseFloat(this._getValueWithoutFormat(value, this.noOfDecimals, true)).toFixed(this.noOfDecimals);
    if (isNaN(currentValue)) {
      currentValue = null;
    }
    let internalVal = this._internalValue;
    if (internalVal) {
      internalVal = parseFloat(this._getValueWithoutFormat(this._internalValue, this.noOfDecimals, true)).toFixed(
        this.noOfDecimals
      );
    }
    if (currentValue !== internalVal) {
      this._internalValue = currentValue;
    }
  }

  _restoreDamagedInternalValue(value, oldValue) {
    // search for wrong delimiters and repair value's format
    const formattedValue = this._formatValue(value);
    const currentValCurrencyDelimitersNr = value.split(',').length;
    const formattedValCurrencyDelimitersNr = formattedValue.split(',').length;

    if (currentValCurrencyDelimitersNr === formattedValCurrencyDelimitersNr) {
      // no change
      return;
    }

    // restore value and update cursor position
    this._updateElementInternalValue(formattedValue, oldValue);
  }

  _getInputElement() {
    return this.shadowRoot.querySelector('#currencyInput').inputElement;
  }

  /**
   * Internal value changed, needs to be checked and changed to US currency format
   */
  _onInternalValueChange(value) {
    if (typeof value === 'undefined' || value === null) {
      return;
    }

    value = this._getStrValue(value);
    const oldValue = this._getStrValue(this._internalValue);

    if (value === oldValue) {
      return;
    }

    if (value.substr(0, 1) === '0' && value.substr(1, 1) !== '.' && value.length > 1) {
      this._updateElementInternalValue(oldValue, value);
      return;
    }

    if (value === '.') {
      this._internalValue = null;
      return;
    }

    // floating point/period can be added just one and only at the end of the string
    const floatingPointPos = value.indexOf('.');
    if (floatingPointPos > -1 && floatingPointPos + 1 < value.length - (oldValue.indexOf('.') > -1 ? 4 : 3)) {
      // floating point can be added only at the end of the string, starting with the last 2 digits
      this._updateElementInternalValue(value.replace('.', ''), oldValue);
      return;
    }

    let preserveFloatingPoint = false;
    if (value.slice(-1) === '.') {
      preserveFloatingPoint = true;
    }

    if (this._getValueWithoutFormat(value) === this._getValueWithoutFormat(oldValue) && !preserveFloatingPoint) {
      // restore damaged internal value
      this._restoreDamagedInternalValue(value, oldValue);
      return;
    }

    const valueWithoutDelimiter = value.replace(/,/g, '');
    const zeroValue = String(parseFloat(0).toFixed(this.noOfDecimals));
    // prevent having invalid numbers like 000,000.00, if number have only 0s, set value to 0.00
    if (!+valueWithoutDelimiter && valueWithoutDelimiter.length > zeroValue.length) {
      this._updateElementInternalValue(zeroValue, value);
      return;
    }

    if (value.substring(0, 1) === '.') {
      // no integer value, only floating point and decimals
      value = value.substring(0, 3);
    } else {
      // format new value
      value = this._formatValue(value);
      if (preserveFloatingPoint) {
        value = value + '.';
      }
    }

    this._updateElementInternalValue(value, oldValue);
    this._setExternalValue(value, preserveFloatingPoint);
  }

  /**
   * Update element value with the float value of _internalValue
   */
  _setExternalValue(value, preserveFloatingPoint) {
    let cleanValStr = this._getValueWithoutFormat(value, this.noOfDecimals);
    const valuePieces = cleanValStr.split('.');
    let limitExceeded = false;
    if (valuePieces[0].length > this._charsLimit) {
      // limit number integer part to max 12 digits
      valuePieces[0] = valuePieces[0].slice(0, this._charsLimit);
      limitExceeded = true;
    }
    cleanValStr = valuePieces.join('.');
    if (preserveFloatingPoint) {
      cleanValStr += '.';
    }
    if (limitExceeded) {
      this._internalValue = this.addCurrencyAmountDelimiter(cleanValStr);
      return;
    }
    const realFloatValue = this._getRealNumberValue(cleanValStr);
    if (realFloatValue !== this.value) {
      // update value only if needed
      this.value = realFloatValue;
    } else {
      // update internal value
      this._internalValue = this.addCurrencyAmountDelimiter(cleanValStr);
    }
  }

  _formatValue(value) {
    value = this._getValueWithoutFormat(value, this.noOfDecimals);
    // re-apply format
    value = this._applyCurrencyAmountFormat(value);
    return value.trim();
  }

  _getCaretPosition(oField) {
    if (!oField) {
      return -1;
    }
    let iCaretPos = 0;
    if (oField.selectionStart || oField.selectionStart == '0') {
      iCaretPos = oField.selectionDirection == 'backward' ? oField.selectionStart : oField.selectionEnd;
    }
    return iCaretPos;
  }

  _getUpdatedCursorPosition(value, oldValue, cursorPos) {
    const valueLength = (value || '').length;
    const oldValueLength = (oldValue || '').length;

    const diff = valueLength - oldValueLength;
    const numberAddedWithDelimiter = diff > 1;
    const numberRemovedWithDelimiter = diff < -1;
    const cursorIsNotFirst = cursorPos > 1;
    const cursorIsNotLast = cursorPos < valueLength;

    if (numberAddedWithDelimiter && cursorIsNotFirst) {
      cursorPos++;
    } else if (numberRemovedWithDelimiter && cursorIsNotLast) {
      cursorPos--;
    }
    return cursorPos;
  }

  _updateElementInternalValue(value, oldValue) {
    const currencyInput = this.shadowRoot.querySelector('#currencyInput');
    const inputElement = currencyInput.shadowRoot.querySelector('input');
    let cursorPos = this._getCaretPosition(inputElement);

    currencyInput.updateValueAndPreserveCaret(value);

    try {
      if (inputElement && cursorPos >= 0) {
        cursorPos = this._getUpdatedCursorPosition(value, oldValue, cursorPos);
        inputElement.selectionStart = cursorPos;
        inputElement.selectionEnd = cursorPos;
      }
    } catch (err) {
      console.log(err);
    }

    if (!this.readonly && this.autoValidate) {
      currencyInput._handleAutoValidate();
    }
  }

  _applyCurrencyAmountFormat(value) {
    value = this._getStrValue(value);
    let formattedValue = '';
    const _valueParts = value.split('.');
    /**
     * _valueParts[0] - integer part
     * _valueParts[1] - decimals, if any
     */
    if (_valueParts[0] !== '') {
      const decimalsPart = _valueParts[1];
      formattedValue = this.addCurrencyAmountDelimiter(_valueParts[0]);

      if (!this._emptyValue(decimalsPart)) {
        formattedValue += '.' + decimalsPart;
      }
    }
    return formattedValue;
  }

  // Get number without ',' and with the set number of decimals
  _getValueWithoutFormat(value, decimalsNr, needsStrValue) {
    if (!decimalsNr) {
      decimalsNr = 0;
    }
    if (needsStrValue) {
      value = this._getStrValue(value);
    }
    let _values = value.split('.');
    let _decimals = '';
    const _floatingPoints = _values.length - 1;
    if (_floatingPoints === 1) {
      _decimals = _values[_values.length - 1];
      _values = _values.slice(0, _values.length - 1);
    }
    value = _values.join('');
    if (_decimals !== '') {
      if (decimalsNr > 0) {
        _decimals = _decimals.slice(0, decimalsNr);
      }
      value += '.' + _decimals;
    }
    // remove commas and spaces and return value
    return value.split(',').join('').split(' ').join('');
  }

  _emptyValue(value) {
    if (value === null || typeof value === 'undefined') {
      return true;
    }
    value = value.toString();
    return value === '' ? true : false;
  }

  _getRealNumberValue(value, decimals) {
    if (!decimals) {
      decimals = false;
    }
    if (this._emptyValue(value)) {
      return null;
    }
    value = this._getValueWithoutFormat(value, this.noOfDecimals);
    const floatVal = parseFloat(value);
    if (isNaN(floatVal)) {
      return null;
    }
    if (decimals) {
      return parseFloat(floatVal.toFixed(decimals));
    }
    return floatVal;
  }

  _onKeyDown(e) {
    e.stopImmediatePropagation();
    let currentKey = null;
    if (e.which === 46) {
      currentKey = 'delete';
    }
    if (e.which === 190) {
      // do not allow more then one period char ('.')
      const currentInternalValue = this._internalValue ? this._internalValue.toString() : '';
      const floatingPtsNr = currentInternalValue.split('.').length - 1;
      if (floatingPtsNr === 1) {
        // stop, we already have a period
        e.preventDefault();
      }
    }
    this._currentKeyPressed = currentKey;
  }

  _onBlur(e) {
    if (this._internalValue) {
      // adjust decimals on focus lost
      if (this._internalValue.substr(-1) === '.') {
        this._internalValue = this._internalValue + '00';
      }
      const _floatingPointPos = this._internalValue.indexOf('.');
      if (_floatingPointPos === -1) {
        this._internalValue = this._internalValue + '.00';
      } else {
        if (this._internalValue.slice(_floatingPointPos + 1).length == 1) {
          // add second missing decimal
          this._internalValue = this._internalValue + '0';
        }
      }
      if (this._internalValue.substr(0, 1) === '.') {
        this._internalValue = '0' + this._internalValue;
      }
    }
  }

  _onFocus(e) {
    e.target.shadowRoot.querySelector('input').select();
  }
}

window.customElements.define(EtoolsCurrencyAmountInput.is, EtoolsCurrencyAmountInput);
