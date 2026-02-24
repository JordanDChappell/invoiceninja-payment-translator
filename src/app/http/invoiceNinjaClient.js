export default class InvoiceNinjaClient {
  _invoiceStatusSent = 2;
  _paymentTypeBankTransfer = 1;

  Config;

  /**
   *
   * @param {Config} config
   */
  constructor(config) {
    this.Config = config;
  }

  GetFullUrl = (path) =>
    `${this.Config.InvoiceNinjaInstanceUrl}/api/${this.Config.InvoiceNinjaApiVersion}/${path}`;

  GetJsonAsync = async (url) => {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-API-TOKEN': this.Config.InvoiceNinjaApiKey,
      },
    });

    if (!response.ok)
      throw new Error('Error fetching data from invoiceninja API', response);

    return await response.json();
  };

  PostJsonAsync = async (url, data) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-API-TOKEN': this.Config.InvoiceNinjaApiKey,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok)
      throw new Error('Error sending data to invoiceninja API', response);

    return response;
  };

  GetUnpaidClientsAsync = async () => {
    const url = this.GetFullUrl('clients?status=active&balance_gt=0');
    const response = await this.GetJsonAsync(url);
    return { data: response.data.filter((c) => c.balance > 0) }; // Invoice Ninja API fail...
  };

  GetOpenInvoicesAsync = async () => {
    const url = this.GetFullUrl(
      `invoices?status=active&status_id=${this._invoiceStatusSent}`
    );
    return await this.GetJsonAsync(url);
  };

  CreatePaymentAsync = async (clientId, invoiceId, amount, date) => {
    const url = this.GetFullUrl('payments?email_receipt=true');
    return await this.PostJsonAsync(url, {
      client_id: clientId,
      type_id: this._paymentTypeBankTransfer,
      date: date,
      amount,
      invoices: [
        {
          invoice_id: invoiceId,
          amount,
        },
      ],
    });
  };
}
