import { Command } from 'commander';

import App from './app/app.js';
import Config from './config/config.js';
import HelpCommand from './app/commands/help.js';
import HelloCommand from './app/commands/hello.js';

const config = new Config();
const program = new Command();
const helpCommand = new HelpCommand();
const helloCommand = new HelloCommand();

const app = new App(config, program, [helpCommand, helloCommand]);

app.Run();
