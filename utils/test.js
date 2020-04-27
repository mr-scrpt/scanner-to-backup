const fs = require("fs");
const path = require("path");
const Archiver = require("archiver");
const { promisify } = require("util");
const stats = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const { pather } = require("./pather");
const chalk = require("chalk");
const ProgressBar = require("progress");
const { namer } = require("./namer"); //TODO преписать в класс

class Compresser {
  constructor({ from, temp, exception, name, ftpFolder }) {
    this.c = new Archiver("zip", {
      zlib: { level: 9 },
    });
    this.b;
    this.settings = {
      from: path.normalize(from),
      temp: path.normalize(temp),
      exception,
      name, //??
      ftpFolder, //??
    };
    this.archiveName = namer(name);
    this.remoteFolder = path.normalize(`backups/${ftpFolder}/`);
    this.localDest = path.normalize(`${temp}/${this.archiveName}`);
    this.counterFileTotal = 0;
    this.counterFolderTotal = 0;
    this.counterFileReady = 0;
    this.arrayPath = [];
  }

  compress = () =>
    new Promise(async (resolve, reject) => {
      try {
        const { from, exception } = this.settings;
        this.c.pipe(fs.createWriteStream(this.localDest));
        await this.scanner(from, exception);
        this.b = new ProgressBar(
          "Всего файлов :total. Завершено :percent [:bar] Прошло :elapsed секунд",
          {
            total: this.counterFileTotal,
          }
        );
        for await (const it of this.arrayPath) {
          const name = await pather(it, from);

          const readStream = fs.createReadStream(it);
          this.c.append(readStream, { name });

          await new Promise((resolve) => {
            readStream.on("close", () => {
              this.b.tick({
                name: name,
              });
              resolve();
            });
          });
        }
        this.c.finalize();
        return resolve();
      } catch (err) {
        return reject();
      }
    });

  scanner = async (start, exception) => {
    return new Promise(async (resolve, reject) => {
      try {
        const list = await readdir(start);
        for await (const it of list) {
          const item = path.join(start, it);
          const info = await stats(item);

          if (exception.includes(it)) {
            console.log(`Исключение ${chalk.redBright(item)}`);
            Promise.resolve();
          } else if (info && info.isFile()) {
            this.counterFileTotal++;
            this.arrayPath.push(item);
          } else {
            this.counterFolderTotal++;
            await this.scanner(item, exception);
          }
        }
        return resolve();
      } catch (err) {
        return reject(err);
      }
    });
  };
  /*  processStatus = (total, ready) => {
    return Math.round((ready / total) * 100);
  }; */
}

const options = {
  from: "h:/solutions/node/scanner-to-backup/testfolder",
  ftpFolder: "backup/folderToBackUp",
  temp: "h:/solutions/node/scanner-to-backup",
  exception: ["node_modules", "self-test", "Бэкапы"],
  name: "backup_name1",
};
const compressor = new Compresser(options);

compressor.compress();
//console.log("-> res", compressor.arrayPath);
