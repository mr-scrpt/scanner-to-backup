const path = require("path");
const program = require("commander");
const { backupper } = require("./utils/backupper");

program
  .option("-f, --from <from>", "расположение файлов", "")
  .option("-n, --name <name>", "Имя для архива", "backup")
  .option("-s, --serverFolder <serverFolder>", "Имя папки на сервере", "other")
  .option("-t, --temp <temp>", "Временная дериктория", "");
program.parse(process.argv);

// ============
const from = path.normalize(program.from);
const temp =
  (program.temp && path.normalize(program.temp)) ||
  path.normalize(from.slice(0, from.lastIndexOf("\\")));

const options = {
  from: path.normalize(program.from),
  ftpFolder: program.serverFolder,
  temp: temp,
  exception: ["node_modules", "self-test", "Бэкапы"],
  name: program.name,
};
// =========

/* const options = {
  from: "h:/solutions/node/scanner-to-backup/testfolder",
  ftpFolder: "backup/folderToBackUp/",
  temp: "h:/solutions/node/scanner-to-backup",
  exception: ["node_modules", "self-test", "Бэкапы"],
  name: "backup_name1",
}; */

backupper(options);
