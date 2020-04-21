const path = require("path");
const program = require("commander");
const { zipper } = require("./utils/zipper");

program
  .option("-f, --from <from>", "расположение файлов", "")
  .option("-t, --to <to>", "куда перенести файлы?", "")
  .option("-n, --name <name>", "Удалять исходники?", "backup");
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

const options = {
  from: path.resolve("h:/solutions/node/scanner-to-backup/testfolder"),
  to: path.resolve("h:/solutions/node/scanner-to-backup/backup-folder"),
  exception: ["node_modules", "self-test", "Бэкапы"],
  name: "test",
};

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
zipper(options);
