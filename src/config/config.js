/**
 * Holds configuration for the application.
 */
export default class Config {
  /**
   * Current application version.
   */
  Version = '0.0.0';
  /**
   * The base URL to the invoice ninja instance.
   */
  InvoiceNinjaInstanceUrl = '';
  /**
   * The API key for invoice ninja.
   */
  InvoiceNinjaApiKey = '';
  /**
   * The invoice ninja API version, e.g. v1.
   */
  InvoiceNinjaApiVersion = '';

  constructor(json) {
    this.InvoiceNinjaInstanceUrl = json.instanceUrl;
    this.InvoiceNinjaApiKey = json.apiKey;
    this.InvoiceNinjaApiVersion = json.apiVersion;
  }
}
