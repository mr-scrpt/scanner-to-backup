const fs = require("fs");
var Ftp = require("ftp");
const { resolve } = require("path");

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
(async () => {
  var c = new Ftp();
  /* const copyFile = async () => {
    try {
      await c.on("ready", function (err) {
        console.log("-> Redy");
        Promise.resolve();
      });
    } catch (error) {}
  }; */
  const connect = ({ host, port, user, password }) => {
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
  }
  /*  await connect({
    host: "192.168.0.102",
    port: "21",
    user: "dolce",
    password: "101601630",
  });
  await upload("test_21-4-2020.zip", "backups/add/new/file");
  await disconnect();
  console.log("-> then"); */
  /* c.put(

    fs.createReadStream("test_21-4-2020.zip"),
    "backups/1-test_21-4-2020.zip",
    function (err) {
      if (err) {
        Promise.reject();
      }
      c.end();
      Promise.resolve();
      console.log("-> Файл записан");
    }
  ); */

  /* c.on("error", function (err) {
    console.log("-> Redy");
    Promise.reject();
   
  });
   */
})();

/* "use strict"; */
/* const ftp = require("basic-ftp");
const fs = require("fs");

class FTPClient {
  constructor(
    host = "localhost",
    port = 21,
    username = "anonymous",
    password = "guest",
    secure = false
  ) {
    this.client = new ftp.Client();
    this.settings = {
      host: host,
      port: port,
      user: username,
      password: password,
      secure: secure,
    };
  }

  upload(sourcePath, remotePath, permissions) {
    let self = this;
    (async () => {
      try {
        let access = await self.client.access(self.settings);
        let upload = await self.client.upload(
          fs.createReadStream(sourcePath),
          remotePath
        );
        let permissions = await self.changePermissions(
          permissions.toString(),
          remotePath
        );
      } catch (err) {
        console.log(err);
      }
      self.client.close();
    })();
  }

  close() {
    this.client.close();
  }

  changePermissions(perms, filepath) {
    let cmd = "SITE CHMOD " + perms + " " + filepath;
    return this.client.send(cmd, false);
  }
}
 */
//module.exports = FTPClient;
