const fs = require("fs");
const path = require("path");
const Archiver = require("archiver");
const { namer } = require("./namer");
const { pather } = require("./pather");
const Bar = require("./progressBar");

module.exports = class Compressor {
  constructor(list, localDest, name) {
    this.c = new Archiver("zip", {
      zlib: { level: 9 },
    });

    this.bar;
    this.list = list.path;
    this.total = list.total;
    this.base = list.base;
    this.nameFinal = namer(name);
    this.localDest = path.normalize(`${localDest}/${this.nameFinal}`);
  }

  compress = () =>
    new Promise(async (resolve, reject) => {
      try {
        this.c.pipe(fs.createWriteStream(this.localDest));
        this.bar = new Bar(this.total);

        for await (const it of this.list) {
          const to = await pather(it, this.base);
          const readStream = fs.createReadStream(it);
          this.c.append(readStream, { name: to });

          await new Promise((resolve) => {
            readStream.on("close", () => {
              this.bar.tick(it);
              resolve();
            });
          });
        }
        this.c.finalize();
        return resolve({ path: this.localDest, name: this.nameFinal });
      } catch (err) {
        return reject();
      }
    });
};
