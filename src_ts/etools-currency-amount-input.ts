import {LitElement, html, property} from 'lit-element';
import '@polymer/paper-input/paper-input.js';
import {EtoolsCurrency} from './mixins/etools-currency-mixin';

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
  static get template() {
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
        value="{{internalValue}}"
        allowed-pattern="[0-9\\.\\,]"
        placeholder="[[placeholder]]"
        disabled$="[[disabled]]"
        on-keydown="_onKeyDown"
        on-blur="_onBlur"
        readonly$="[[readonly]]"
        required$="[[required]]"
        invalid="{{invalid}}"
        on-focus="_onFocus"
        auto-validate$="[[_computeAutovalidate(autoValidate, readonly)]]"
        error-message="[[errorMessage]]"
        no-label-float="[[noLabelFloat]]"
      >
        <div slot="prefix" class="prefix" hidden$="[[!currency]]">[[currency]]</div>
      </paper-input>
    `;
  }

  @property({type: String, reflect: true, attribute: true}) label = '';
  @property({type: String, reflect: true, attribute: true}) placeholder = '—';
  @property({type: String, reflect: true, attribute: 'error-message'}) errorMessage = 'This field is required';
  @property({type: String, reflect: true, attribute: true}) currency = '';
  @property({type: Boolean, reflect: true, attribute: 'no-label-float'}) noLabelFloat = false;
  @property({type: Boolean, reflect: true, attribute: true}) readonly = false;
  @property({type: Boolean, reflect: true, attribute: true}) disabled = false;
  @property({type: Boolean, reflect: true, attribute: true}) required = false;
  @property({type: Boolean, reflect: true, attribute: 'auto-validate'}) autoValidate = false;
  @property({type: Boolean, reflect: true, attribute: true}) invalid = false; // was with notify
  @property({type: Number, reflect: true, attribute: 'no-of-decimals'}) noOfDecimals = 2;

  @property({reflect: true, attribute: true}) value = null; // was with notify

  @property() private internalValue!: string;

  charsLimit = 12;

  protected updated(_changedProperties: any): void {
    if (_changedProperties.has('value')) {
      this._onValueChange(this.value);
    }
    if (_changedProperties.has('internalValue')) {
      this._onInternalValueChange(this.value, _changedProperties.get('internalValue'));
    }
  }

  static get observers() {
    return ['_updateStyles(readonly, disabled, invalid)'];
  }

  _updateStyles(readonly, disabled, invalid) {
    if (readonly === undefined && disabled === undefined && invalid === undefined) {
      return;
    }
    if (readonly) {
      this.set('invalid', false);
    }
    this.updateStyles();
  }

  _computeAutovalidate(autoValidate, readonly) {
    return readonly ? false : autoValidate;
  }

  validate() {
    return this.$.currencyInput.validate();
  }

  _getStrValue(value) {
    try {
      return value === 0 ? '0' : value.toString();
    } catch (error) {
      return '0';
    }
  }

  _onValueChange(value) {
    if (value === null && this.internalValue === '') {
      return;
    }
    let currentValue = value;
    if (currentValue === null || typeof currentValue === 'undefined') {
      this.set('internalValue', null);
    }
    currentValue = parseFloat(this._getValueWithoutFormat(value, this.noOfDecimals, true)).toFixed(this.noOfDecimals);
    if (isNaN(currentValue)) {
      currentValue = null;
    }
    let internalVal = this.internalValue;
    if (internalVal) {
      internalVal = parseFloat(this._getValueWithoutFormat(this.internalValue, this.noOfDecimals, true)).toFixed(
        this.noOfDecimals
      );
    }
    if (currentValue !== internalVal) {
      this.set('internalValue', currentValue);
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
    return this.$.currencyInput.inputElement;
  }

  /**
   * Internal value changed, needs to be checked and changed to US currency format
   */
  _onInternalValueChange(value, oldValue) {
    if (typeof value === 'undefined' || value === null) {
      return;
    }

    value = this._getStrValue(value);
    oldValue = this._getStrValue(oldValue);

    if (value.substr(0, 1) === '0' && value.substr(1, 1) !== '.' && value.length > 1) {
      this._updateElementInternalValue(oldValue, value);
      return;
    }

    if (value === '.') {
      this.set('internalValue', null);
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
   * Update element value with the float value of internalValue
   */
  _setExternalValue(value, preserveFloatingPoint) {
    let cleanValStr = this._getValueWithoutFormat(value, this.noOfDecimals);
    const valuePieces = cleanValStr.split('.');
    let limitExceeded = false;
    if (valuePieces[0].length > this.charsLimit) {
      // limit number integer part to max 12 digits
      valuePieces[0] = valuePieces[0].slice(0, this.charsLimit);
      limitExceeded = true;
    }
    cleanValStr = valuePieces.join('.');
    if (preserveFloatingPoint) {
      cleanValStr += '.';
    }
    if (limitExceeded) {
      this.set('internalValue', this.addCurrencyAmountDelimiter(cleanValStr));
      return;
    }
    const realFloatValue = this._getRealNumberValue(cleanValStr);
    if (realFloatValue !== this.value) {
      // update value only if needed
      this.set('value', realFloatValue);
    } else {
      // update internal value
      this.set('internalValue', this.addCurrencyAmountDelimiter(cleanValStr));
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
    const currencyInput = this.$.currencyInput;
    const inputElement = currencyInput.$.nativeInput;
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
    if (e.which === 190) {
      // do not allow more then one period char ('.')
      const currentInternalValue = this.internalValue ? this.internalValue.toString() : '';
      const floatingPtsNr = currentInternalValue.split('.').length - 1;
      if (floatingPtsNr === 1) {
        // stop, we already have a period
        e.preventDefault();
      }
    }
  }

  _onBlur(e) {
    if (this.internalValue) {
      // adjust decimals on focus lost
      if (this.internalValue.substr(-1) === '.') {
        this.set('internalValue', this.internalValue + '00');
      }
      const _floatingPointPos = this.internalValue.indexOf('.');
      if (_floatingPointPos === -1) {
        this.set('internalValue', this.internalValue + '.00');
      } else {
        if (this.internalValue.slice(_floatingPointPos + 1).length == 1) {
          // add second missing decimal
          this.set('internalValue', this.internalValue + '0');
        }
      }
      if (this.internalValue.substr(0, 1) === '.') {
        this.set('internalValue', '0' + this.internalValue);
      }
    }
  }

  _onFocus(e) {
    e.target.$.nativeInput.select();
  }
}

window.customElements.define('etools-currency-amount-input', EtoolsCurrencyAmountInput);
