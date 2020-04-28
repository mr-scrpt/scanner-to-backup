const FTPClient = require("./ftp");
const Scanner = require("./scannerClass");
const Compressor = require("./compressor");

module.exports.backupper = async ({
  from,
  ftpFolder,
  temp,
  exception,
  name,
}) => {
  const client = new FTPClient({
    host: "192.168.0.102",
    port: "21",
    user: "dolce",
    password: "101601630",
  });

  /* const options= {
    from: "h:/solutions/node/scanner-to-backup/testfolder",
    ftpFolder: "backups/promsklad/",
    temp: "h:/solutions/node/scanner-to-backup",
    exception: ["node_modules", "self-test", "Бэкапы"],
    name: "backup_name1",
  }; */

  const scanner = new Scanner(from, exception);

  const list = await scanner.scann(from, exception);

  const compressor = new Compressor(list, temp, name);

  const file = await compressor.compress();
  await client.connect();
  await client.upload(file.path, ftpFolder, file.name);
  await client.cleaner(ftpFolder);
  await client.disconnect();
};
/* const FTPClient = require("./ftp");
const client = new FTPClient({
  host: "192.168.0.102",
  port: "21",
  user: "dolce",
  password: "101601630",
});


const Scanner = require("./scannerClass");
const Compressor = require("./compressor");
const = {
  from: "h:/solutions/node/scanner-to-backup/testfolder",
  ftpFolder: "backups/promsklad/",
  temp: "h:/solutions/node/scanner-to-backup",
  exception: ["node_modules", "self-test", "Бэкапы"],
  name: "backup_name1",
};

(async () => {
  const scanner = new Scanner(from, exception);

  const list = await scanner.scann(from, exception);
 
  const compressor = new Compressor(
    list,
    "h:/solutions/node/scanner-to-backup",
    "test-b"
  );

  const file = await compressor.compress();
  await client.connect();
  await client.upload(file.path, ftpFolder, file.name);
  await client.cleaner(ftpFolder);
  await client.disconnect();
})();

 */
