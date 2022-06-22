/**
 * Format value as currency amount. Delimited used ', '
 */
export const addCurrencyAmountDelimiter = (value: any) => {
  if (!value) {
    return '';
  }
  value = value.toString();
  if (value === '') {
    return '';
  }
  return value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

/**
 * Format value as currency amount and return it to be displayed
 * Use this to display readonly currency amounts on interface
 */
export const displayCurrencyAmount = (value: any, placeholder: any, noOfDecimals: any) => {
  if (!placeholder) {
    placeholder = '—';
  }
  if (typeof noOfDecimals !== 'number') {
    noOfDecimals = 2;
  }
  if (!value) {
    return placeholder;
  }
  const floatValue = parseFloat(value).toFixed(noOfDecimals);
  if (isNaN(+floatValue)) {
    return placeholder;
  }

  return addCurrencyAmountDelimiter(floatValue);
};
