const fs = require("fs");
const { promisify } = require("util");
const stat = promisify(fs.stat);
const Ftp = require("ftp");
const { cleanerFtp } = require("./cleanerFtp");
const chalk = require("chalk");
const ProgressBar = require("progress");

class FTPClient {
  constructor({ host, port, user, password }) {
    this.c = new Ftp();
    this.cleanerFtp = cleanerFtp;
    this.settings = {
      host,
      port,
      user,
      password,
    };
  }
  connect = () => {
    return new Promise((resolve, reject) => {
      this.c.connect(this.settings);

      this.c.on("ready", () => {
        console.log(chalk.blueBright("⛓ Успешно подключен к FTP ⛓"));
        return resolve();
      });
      this.c.on("error", (err) => {
        return reject(err);
      });
    });
  };
  disconnect = () => {
    return new Promise((resolve) => {
      this.c.end();
      this.c.on("end", () => {
        console.log(chalk.magentaBright("⛓ Успешно отключен к FTP ⛓"));
        return resolve();
      });
    });
  };
  mkdir = (path) => {
    return new Promise((resolve, reject) => {
      this.c.mkdir(path, true, (err) => {
        if (err) return reject();

        console.log(chalk.cyanBright("Путь создан:", path));
        return resolve();
      });
    });
  };
  delete = (path) => {
    return new Promise((resolve, reject) => {
      if (!path) return null;
      console.log("-> path", path);
      this.c.delete(path, (err) => {
        if (err) {
          console.log("-> err", err);
          return reject(err);
        }
        console.log("-> Файл удален:", path);
        return resolve();
      });
    });
  };
  upload = (from, to, name) => {
    return new Promise(async (resolve, reject) => {
      const dest = to + name;
      await this.mkdir(to);
      const stream = fs.createReadStream(from);

      this.cheсkFile(from, stream);

      this.c.put(stream, dest, (err) => {
        if (err) {
          return reject();
        }
        console.log(chalk.greenBright("⚡⚡⚡Файл успешно отправлен!⚡⚡⚡"));
        return resolve();
      });
    });
  };
  cleaner = (path) => {
    return new Promise((resolve, reject) => {
      this.c.list(path, async (err, list) => {
        if (err) return reject(err);

        const toDeltetName = await this.cleanerFtp(list);

        if (toDeltetName) {
          const toDeletePath = `${path}${toDeltetName}`;
          await this.delete(toDeletePath);
        }

        resolve();
      });
    });
  };
  cheсkFile = async (file, stream) => {
    const stats = await stat(file);
    const len = parseInt(stats.size, 10);
    const sizeOnMb = (stats.size / 1024 ** 2).toFixed(0);
    let senden = 0;
    const bar = new ProgressBar(
      "⏩ Завершено :ready mb из :sizeOnMb mb (:percent) [:bar] Прошло :elapsed секунд.",
      {
        complete: "=",
        incomplete: " ",
        width: 40,
        total: len,
      }
    );
    stream.on("data", (chunk) => {
      senden += chunk.length / 1024 / 1024;
      bar.tick(chunk.length, {
        ready: senden.toFixed(0),
        sizeOnMb,
      });
    });
  };
}

module.exports = FTPClient;
