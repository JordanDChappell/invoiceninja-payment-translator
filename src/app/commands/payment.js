import chalk from 'chalk';
import InvoiceNinjaClient from '../http/invoiceNinjaClient.js';
import BaseCommand from './command.js';

export default class PaymentCommand extends BaseCommand {
  _fileSystem;
  _invoiceNinjaClient;
  _csvSplitRegex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;

  constructor(fileSystem, invoiceNinjaClient) {
    super(
      'payment',
      'transform incoming payment csv into the format expected by invoiceninja and submit',
      [],
      [],
      [
        {
          name: '-i, --input-file <string>',
          description: 'input csv file path',
          required: true,
        },
        {
          name: '--cba',
          description: 'input csv is in default CBA (Commonwealth Bank) format',
        },
      ]
    );

    this._fileSystem = fileSystem;
    this._invoiceNinjaClient = invoiceNinjaClient;
  }

  RunAsync = async (options) => {
    const { inputFile, cba } = options;

    const hasHeaderRow = !cba;

    if (!inputFile.endsWith('.csv'))
      throw new Error(
        `Provided 'input-file' argument is not a csv file (${inputFile})`
      );

    const entries = [];
    let hasSeenHeader = false;

    for await (const line of this._fileSystem.ReadLinesAsync(inputFile)) {
      if (hasHeaderRow && !hasSeenHeader) {
        hasSeenHeader = true;
        continue;
      }

      const [dateColumn, amountColumn, referenceColumn] = line
        .split(this._csvSplitRegex)
        .map((entry) => entry.replaceAll('"', ''));

      const [day, month, year] = dateColumn.split('/');

      entries.push({
        date: new Date(
          Number.parseInt(year, 10),
          Number.parseInt(month, 10) - 1,
          Number.parseInt(day, 10)
        ),
        amount: Number.parseFloat(amountColumn),
        reference: referenceColumn.toLowerCase(),
      });
    }

    const payments = entries.filter((entry) => entry.amount > 0);
    const unpaidClients =
      await this._invoiceNinjaClient.GetUnpaidClientsAsync();
    const openInvoices = await this._invoiceNinjaClient.GetOpenInvoicesAsync();

    const paymentsWithInvoiceAndClient = openInvoices.data.map((invoice) => {
      const invoiceDate = new Date(invoice.date);

      const client = unpaidClients.data.find(
        (client) => client.id === invoice.client_id
      );

      // TODO: client lookup table
      let payment = undefined;

      const candidatePayments = payments.filter(
        (payment) =>
          !payment.found &&
          payment.amount === invoice.balance &&
          payment.date > invoiceDate
      );

      const paymentIndex = candidatePayments.findIndex(
        (payment) =>
          payment.reference.includes(invoice.number) ||
          payment.reference.includes(client.name.toLowerCase()) ||
          client.contacts.some(
            (contact) =>
              payment.reference.includes(contact.first_name.toLowerCase()) ||
              payment.reference.includes(contact.last_name.toLowerCase())
          )
      );

      if (paymentIndex > -1) {
        payment = candidatePayments[paymentIndex];
        payment.found = true;
      }

      return {
        invoice,
        client,
        payment,
      };
    });

    for (const { client, invoice, payment } of paymentsWithInvoiceAndClient) {
      if (!payment) continue;

      console.info(
        chalk.yellow(
          `New payment fowund: #${invoice.number} - ${client.name} - \$${payment.amount}`
        )
      );

      await this._invoiceNinjaClient.CreatePaymentAsync(
        client.id,
        invoice.id,
        payment.amount,
        payment.date.toISOString().split('T')[0]
      );

      console.info(chalk.green('Payment marked as paid'));
    }
  };
}
