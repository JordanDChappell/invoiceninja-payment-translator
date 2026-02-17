import chalk from 'chalk';
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

  RunAsync = async () => {
    this.Program.name('invoiceninja-payment-translator')
      .description(
        'A CLI tool to help translate bank transaction csv files to the formats that Invoiceninja requires'
      )
      .version(this.Config.version);

    for (const command of this.Commands) {
      const cmd = this.Program.command(command.Name)
        .aliases(command.Aliases)
        .description(command.Description);

      for (const { name, description } of command.Arguments)
        cmd.argument(name, description);

      for (const { name, description, value, required } of command.Options) {
        if (required) cmd.requiredOption(name, description, value);
        else cmd.option(name, description, value);
      }

      if (command.RunAsync) cmd.action(command.RunAsync);
      else cmd.action(command.Run);
    }

    try {
      await this.Program.parseAsync();
    } catch (error) {
      console.error(chalk.red(error));
    }
  };
}
