import BaseCommand from './command.js';

export default class HelloCommand extends BaseCommand {
  constructor() {
    super(
      'hello',
      'Test command',
      [],
      [{ name: '<string>', description: 'input string' }],
      [
        {
          name: '-a, --argument <char>',
          description: 'test option',
          value: 'a',
        },
        { name: '-b, --banana', description: 'flag option' },
      ]
    );
  }

  Run = (input, options) => {
    console.info('Hello, args are: ', input);
    console.info('options are: ', options);
  };
}
