import BaseCommand from './command.js';

export default class HelpCommand extends BaseCommand {
  constructor() {
    super(
      'help',
      'Retrieve help information for invoiceninja-payment-translator',
      ['h']
    );
  }

  Run = () => {
    console.info('Help command');
  };
}
