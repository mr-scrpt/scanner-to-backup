const fs = require("fs");
const { promisify } = require("util");
const unlink = promisify(fs.unlink);
const chalk = require("chalk");
module.exports = class Cleaner {
  cleanTemp = async (path, name) => {
    await unlink(path);
    console.log(chalk.redBright(`Файл ${name} успешно удален! 🧺`));
  };
};
