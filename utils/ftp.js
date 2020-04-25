const fs = require("fs");
const Ftp = require("ftp");
const { cleanerFtp } = require("./cleanerFtp");

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
        console.log("-> connect");
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
        console.log("-> disconnect");
        return resolve();
      });
    });
  };
  mkdir = (path) => {
    return new Promise((resolve, reject) => {
      this.c.mkdir(path, true, (err) => {
        if (err) return reject();
        console.log("-> Путь создан:", path);
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
      this.c.put(fs.createReadStream(from), dest, (err) => {
        if (err) {
          return reject();
        }
        console.log("-> Файл записан");
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
}
/* (async () => {
  try {
    const client = new FTPClient({
      host: "192.168.0.102",
      port: "21",
      user: "dolce",
      password: "101601630",
    });
    await client.connect();

   await client.upload(
      "test_21-4-2020.zip",
      "backups/add/new/file/",
      "test-new.zip"
    ); 
    await client.cleaner("backups/add/new/file/");
    
    await client.disconnect();
  } catch (error) {
    console.log("-> error", error);
  }
})(); */
module.exports = FTPClient;
