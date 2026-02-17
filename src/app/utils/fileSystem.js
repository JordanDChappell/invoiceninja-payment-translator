import fs from 'fs';
import readline from 'readline';

export default class FileSystem {
  /**
   * Determine if a file exists.
   * @param {string} filePath Path to the file.
   * @returns {boolean} True if the file exists, else false.
   */
  FileExists = (filePath) => fs.existsSync(filePath);
  /**
   * Open a file stream for reading.
   * @param {string} filePath Path to the file that will be read from.
   * @returns {fs.ReadStream}
   */
  OpenReadStream = (filePath) => fs.createReadStream(filePath);
  /**
   * Open a file stream for writing.
   * @param {string} filePath Path to the file that will be written to.
   * @returns {fs.WriteStream}
   */
  OpenWriteStream = (filePath) => fs.createWriteStream(filePath);
  /**
   * Read all content as a single string from a file.
   * @param {string} filePath Path to the file that will be read from.
   * @returns {string}
   */
  ReadAllContent = (filePath) => fs.readFileSync(filePath);
  /**
   * Asynchronously read all lines from a file.
   * @param {string} filePath Path to the file that will be read from.
   * @yields {string}
   */
  async *ReadLinesAsync(filePath) {
    const inputFileStream = this.OpenReadStream(filePath);

    const rl = readline.createInterface({
      input: inputFileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      yield line;
    }
  }
}
