# \<etools-currency-amount-input\>

A paper-input element that allows only currency amount values (US format). It accepts only digits, comma, a
a single floating point (period), and allows 2 decimals. The maximum number you can have 12 digits until floating point.
The value displayed it's paper-input's internal value. The `value` property of this element will update and format
the internal value and when internal value is changed, element's value will be updated with current float value.

![etools-currency-input-img](etools-currency-input.png)

To only display values as currency amounts you can use `EtoolsMixins.EtoolsCurrency`
`displayCurrencyAmount` method.

### Element properties

* autoValidate, Boolean, default: false
* currency, string
* disabled, Boolean, default: false
* errorMessage, String, default: 'This field is required'
* invalid, Boolean, default: false - notifies
* label, String
* placeholder, String, default: '—'
* readonly, Boolean, default: false
* required, Boolean, default: false
* value, String, notifies, converted to float value on internal value change

## Usage

```html
<etools-currency-amount-input label="Amount value"
    value="{{value}}" currency="$"></etools-currency-amount-input>
```

## Styling

Use CSS properties and mixin of paper-input to style the element or:

Custom property | Description | Default
----------------|-------------|----------
`--etools-currency-input` | Mixin applied to currency element | `{}`

## Install

```bash
$ bower install --save etools-currency-input
```

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
