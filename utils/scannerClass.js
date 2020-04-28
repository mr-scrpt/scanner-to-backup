const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const stats = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const chalk = require("chalk");

module.exports = class Scanner {
  list = {
    total: 0,
    base: "",
    path: [],
  };
  iteration = 0;
  stream = process.stderr;
  lastDraw = "";
  scann = async (start, exception) => {
    if (this.iteration === 0) {
      this.list.base = path.normalize(start);
    }

    return new Promise(async (resolve, reject) => {
      try {
        const list = await readdir(start);
        for await (const it of list) {
          this.iteration++;
          const item = path.join(start, it);
          const info = await stats(item);

          if (exception.includes(it)) {
            Promise.resolve();
          } else if (info && info.isFile()) {
            this.list.total++;

            const message =
              chalk.yellowBright(`Оценка файловой системы. Файлов найдено `) +
              chalk.greenBright(`${this.list.total}`);
            this.list.path.push(item);
            this.stream.clearLine();
            this.stream.cursorTo(0);
            this.stream.write(message);
          } else {
            await this.scann(item, exception);
          }
        }
        return resolve(this.list);
      } catch (err) {
        return reject(err);
      }
    });
  };
};
