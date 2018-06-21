import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '../etools-currency-amount-input.js';

/**
 * @polymer
 * @customElement
 */
class DemoElement extends PolymerElement {
  static get template() {
    // language=HTML
    return html`
      <style>
        :host {
          /* host CSS */
        }
      </style>

      <p>The value will change to \`13876533.5678\` in 10 seconds. The field should format the new value.</p>

      <etools-currency-amount-input label="Currency amount example with value provided" value="{{inputValue}}"
                                    currency="\$"></etools-currency-amount-input>
    `;
  }

  static get is() {
    return 'demo-element';
  }

  static get properties() {
    return {
      inputValue: {
        type: String,
        value: '',
        notify: true
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.set('inputValue', 123);
    setTimeout(() => {
      this.set('inputValue', 13876533.5678);
    }, 10000);
  }
}

window.customElements.define(DemoElement.is, DemoElement);
