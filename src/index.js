import path from 'path';
import { fileURLToPath } from 'url';
import { Command } from 'commander';

import App from './app/app.js';
import Config from './config/config.js';
import FileSystem from './app/utils/fileSystem.js';
import InvoiceNinjaClient from './app/http/invoiceNinjaClient.js';
import PaymentCommand from './app/commands/payment.js';

const fileSystem = new FileSystem();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configDirectory = path.join(__dirname, 'config');
const configSearchPaths = [
  path.join(configDirectory, 'prod.json'),
  path.join(configDirectory, 'default.json'),
];

const configJson = JSON.parse(
  fileSystem.ReadAllContent(
    configSearchPaths.find((path) => fileSystem.FileExists(path))
  )
);

const config = new Config(configJson);
const program = new Command();

const client = new InvoiceNinjaClient(config);

const app = new App(config, program, [new PaymentCommand(fileSystem, client)]);

await app.RunAsync();
