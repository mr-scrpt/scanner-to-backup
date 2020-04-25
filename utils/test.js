const fs = require("fs");
const path = require("path");
const Archiver = require("archiver");
const { promisify } = require("util");
const stats = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const { pather } = require("./pather");
const chalk = require("chalk");

const { scanner } = require("./scanner"); //TODO преписать в класс
const { namer } = require("./namer"); //TODO преписать в класс
class Compresser {
  constructor({ from, temp, exception, name, ftpFolder }) {
    this.c = new Archiver("zip", {
      zlib: { level: 9 },
    });
    this.settings = {
      from,
      temp,
      exception,
      name, //??
      ftpFolder, //??
    };
    this.archiveName = namer(name);
    this.remoteFolder = path.normalize(`backups/${ftpFolder}/`);
    this.localDest = path.normalize(`${temp}/${this.archiveName}`);
    this.counterFile = 0;
    this.counterFolder = 0;
  }

  //remoteFolder = path.normalize(`backups/${ftpFolder}/`);

  compress = () =>
    new Promise(async (resolve, reject) => {
      const { from, archive, exception } = this.settings;
      this.c.pipe(fs.createWriteStream(this.localDest));
      await this.scanner(from, this.c, exception);
      this.c.finalize();
    });
  scanner = (start, compressor, exception) => {
    return new Promise(async (resolve, reject) => {
      try {
        await this.cylceDir(start, compressor, exception);
        return resolve();
      } catch (error) {
        return reject(error);
      }
    });
  };
  cylceDir = async (start, compressor, exception) => {
    return new Promise(async (resolve, reject) => {
      try {
        const list = await readdir(start);
        for await (const it of list) {
          const item = path.join(start, it);
          const name = await pather(item, start);
          const info = await stats(item);

          if (exception.includes(it)) {
            console.log(`Исключение ${chalk.redBright(item)}`);
            Promise.resolve();
          } else if (info && info.isFile()) {
            const readStream = fs.createReadStream(item);

            compressor.append(readStream, { name });

            await new Promise((resolve) => {
              readStream.on("close", () => {
                this.counterFile++;
                console.log(
                  `Файл ${chalk.yellowBright(
                    item
                  )} добавлен в архив. Всего файлов обработано ${chalk.greenBright(
                    this.counterFile
                  )}`
                );
                resolve();
              });
            });
          } else {
            this.counterFolder++;
            console.log(
              `Обработка папки ${chalk.yellowBright(
                item
              )}. Всего папок обработано ${chalk.greenBright(
                this.counterFolder
              )}`
            );
            await this.cylceDir(item, compressor, exception);
          }
        }
        return resolve();
      } catch (err) {
        return reject(err);
      }
    });
  };
}
const options = {
  from: "h:/solutions/node/scanner-to-backup/testfolder",
  ftpFolder: "backup/folderToBackUp",
  temp: "h:/solutions/node/scanner-to-backup",
  exception: ["node_modules", "self-test", "Бэкапы"],
  name: "backup_name",
};
const compressor = new Compresser(options);

compressor.compress();
