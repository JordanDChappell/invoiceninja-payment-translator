/**
 * The basic structure for all commands in the application.
 */
export default class BaseCommand {
  Name = '';
  Description = '';
  Aliases = [];
  Arguments = [];
  Options = [];

  constructor(name, description, aliases = [], args = [], options = []) {
    this.Name = name;
    this.Description = description;
    this.Aliases = aliases;
    this.Arguments = args;
    this.Options = options;
  }

  Run = () => {
    throw new Error(
      `'Run' has not been implemented by ${this.constructor.name}`
    );
  };
}
