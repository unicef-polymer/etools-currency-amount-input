# \<etools-currency-amount-input\>

A paper-input element that allows only currency amount values (US format). It accepts only digits, comma, a
a single floating point (period), and allows 2 decimals. The maximum number you can have 12 digits until floating point.
The value displayed it's paper-input's internal value. The `value` property of this element will update and format
the internal value and when internal value is changed, element's value will be updated with current float value.

![etools-currency-input-img](etools-currency-input.png)

To only display values as currency amounts you can use `EtoolsCurrency` mixin,
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
TODO: create npm package
```bash
$ npm i --save unicef-polymer/etools-currency-amount-input#branch_name
```

## Linting the code

Install local npm packages (run `npm install`)
Then just run the linting task

```bash
$ npm run lint
```

## Preview element locally
Install needed dependencies by running: `$ npm install`.
Make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `$ polymer serve` to serve your element application locally.

## Running Tests
TODO: improve and add more tests
```
$ polymer test
```
