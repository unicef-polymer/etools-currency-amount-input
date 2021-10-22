import {LitElement, html} from 'lit-element';
import '../etools-currency-amount-input.js';

/**
 * @polymer
 * @customElement
 */
class DemoElement extends LitElement {
  render() {
    // language=HTML
    return html`
      <style>
        :host {
          /* host CSS */
        }
      </style>

      <etools-currency-amount-input
        label="Enter value"
        .value="${this.inputValue}"
        @value-changed="${(e) => {
          if (this.inputValue != e.detail.value) {
            this.inputValue = value;
          }
        }}"
      ></etools-currency-amount-input>
    `;
  }

  static get is() {
    return 'demo-element';
  }

  static get properties() {
    return {
      inputValue: {
        type: String
      }
    };
  }
  constructor() {
    super();
    this.inputValue = 1;
  }

  connectedCallback() {
    super.connectedCallback();
  }
}

window.customElements.define(DemoElement.is, DemoElement);
