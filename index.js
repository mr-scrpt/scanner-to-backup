const path = require("path");
const program = require("commander");
const { zipper } = require("./utils/zipper");

program
  .option("-f, --from <from>", "расположение файлов", "")
  .option("-n, --name <name>", "Имя для архива", "backup")
  .option("-s, --serverFolder <serverFolder>", "Имя папки на сервере", "other")
  .option("-t, --temp <temp>", "Временная дериктория", "");
program.parse(process.argv);

/* const options = {
  from: path.resolve(program.from),
  to: path.resolve(program.to),
  exception: ["node_modules", "self-test", "Бэкапы"],
  name: program.name,
}; */

/* const options = {
  from: path.resolve("h:/solutions/node/scanner-to-backup/testfolder"),
  to: path.resolve("h:/solutions/node/scanner-to-backup"),
  exception: ["node_modules", "self-test", "Бэкапы"],
  name: "aaa",
}; */

/* const options = {
  from: path.resolve("h:/solutions/node/scanner-to-backup/testfolder"),
  to: path.resolve("f:/backup"),
  exception: ["node_modules", "self-test", "Бэкапы"],
  name: "bbb",
}; */

/* const options = {
  from: path.resolve("d:/Музыка"),
  to: path.resolve("f:/backup"),
  exception: ["node_modules", "self-test", "Бэкапы"],
  name: "музло",
}; */

/* const options = {
  from: path.resolve("w:/work-project/promSklad/"),
  to: path.resolve("f:/backup"),
  exception: ["node_modules", "self-test"],
  name: "promsklad",
}; */

/* const options = {
  from: path.resolve(program.from),
  to: path.resolve(program.to),
  exception: ["node_modules", "self-test", "Бэкапы"],
  name: program.name,
}; */
const from = path.normalize(program.from);
const temp =
  (program.temp && path.normalize(program.temp)) ||
  path.normalize(from.slice(0, from.lastIndexOf("\\")));

const options = {
  from: path.normalize(program.from),
  ftpFolder: path.normalize(program.serverFolder),
  temp: temp,
  exception: ["node_modules", "self-test", "Бэкапы"],
  name: program.name,
};

zipper(options);
