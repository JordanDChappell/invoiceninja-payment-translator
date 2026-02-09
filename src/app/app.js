import { Command } from 'commander';

export default class App {
  Program;
  Config;
  Commands = [];

  /**
   *
   * @param {Config} config
   * @param {Command} program
   * @param {BaseCommand[]} commands
   */
  constructor(config, program, commands) {
    this.Config = config;
    this.Program = program;
    this.Commands = commands;
  }

  Run = () => {
    this.Program.name('invoiceninja-payment-translator')
      .description(
        'A CLI tool to help translate bank transaction CSV files to Invoiceninja payments'
      )
      .version(this.Config.version);

    for (const command of this.Commands) {
      const cmd = this.Program.command(command.Name)
        .aliases(command.Aliases)
        .description(command.Description);

      for (const { name, description } of command.Arguments)
        cmd.argument(name, description);

      for (const { name, description, value } of command.Options)
        cmd.option(name, description, value);

      cmd.action(command.Run);
    }

    this.Program.parse();
  };
}
