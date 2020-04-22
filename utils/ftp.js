const fs = require("fs");
var Ftp = require("ftp");
const { resolve } = require("path");
class FTPClient {
  constructor({ host, port, user, password }) {
    this.c = new Ftp();
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
}
(async () => {
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
  await client.disconnect();
})();
module.exports = FTPClient;
/* const ftpClient = new Ftp();
ftpClient.connect({
  host: "192.168.0.102",
  port: "21",
  user: "dolce",
  password: "101601630",
}); */
/* class FTPClient {
  constructor(
    host = "192.168.0.102",
    port = 21,
    username = "dolce",
    password = "101601630",
    secure = false
  ) {
    this.client = new Ftp();
    this.settings = {
      host: host,
      port: port,
      user: username,
      password: password,
      secure: secure,
    };
  }

  upload(from, to) {
    let self = this;
    async () => {
      try {
        self.put(from, to, (err) => {
          if (err) {
            return Promise.reject(err);
          }
          Promise.resolve(err);
        });
      } catch (error) {}
    };
  }
} */
//(async () => {})
//var c = new Ftp();
/* const copyFile = async () => {
    try {
      await c.on("ready", function (err) {
        console.log("-> Redy");
        Promise.resolve();
      });
    } catch (error) {}
  }; */
/*  const connect = ({ host, port, user, password }) => {
    return new Promise((resolve, reject) => {
      c.connect({
        host,
        port,
        user,
        password,
      });

      c.on("ready", () => {
        console.log("-> connect");
        return resolve();
      });
      c.on("error", (err) => {
        return reject(err);
      });
    });
  };
  const disconnect = () => {
    return new Promise((resolve) => {
      c.end();
      c.on("end", () => {
        console.log("-> disconnect");
        return resolve();
      });
    });
  };
  const mkdir = (path) => {
    return new Promise((resolve, reject) => {
      c.mkdir(path, true, (err) => {
        if (err) return reject();
        console.log("-> Путь создан:", path);
        return resolve();
      });
    });
  };
  const upload = (from, to, name) => {
    return new Promise(async (resolve, reject) => {
      const dest = to + name;
      await mkdir(to);
      c.put(fs.createReadStream(from), dest, (err) => {
        if (err) {
          return reject();
        }
        console.log("-> Файл записан");
        return resolve();
      });
    });
  };
  try {
    await connect({
      host: "192.168.0.102",
      port: "21",
      user: "dolce",
      password: "101601630",
    });
    await upload("test_21-4-2020.zip", "backups/add/new/file/", "test-new.zip");
    await disconnect();
    console.log("-> then");
  } catch (error) {
    console.log("-> error", error);
  } */
