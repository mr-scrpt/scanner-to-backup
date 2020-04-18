const program = require("commander");

const readDir = require("./self_modules/readDir");
const onFile = require("./self_modules/onFile");
const onDir = require("./self_modules/onDir");

program
  .option("-f, --from <from>", "расположение файлов", "./testfolder")
  .option("-t, --to <to>", "куда перенести файлы?", "./result")
  .option("-d, --del <del>", "Удалять исходники?", false);
program.parse(process.argv);

const options = { base: program.from, dest: program.to, del: program.del };

readDir(options, onFile, onDir);
