const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const stat = promisify(fs.stat);
const chalk = require("chalk");

module.exports.cleaner = async (dest) => {
  if (!dest) return null;
  const list = await readdir(dest);
  const count = list.length + 1;
  if (count > 3 && count < 5) {
    const keys = [];
    const names = list.map((item) => {
      const date = item
        .slice(0, item.indexOf("."))
        .slice(item.indexOf("_") + 1, item.length);

      const [day, mounth, year] = date.split("-");
      const timeStamp = Date.parse(`${year}-${mounth}-${day}`);

      keys.push(timeStamp);
      return { name: item, key: timeStamp };
    });

    const minIndex = Math.min.apply(null, keys);
    let fileToDelete = "";
    for (const item of names) {
      if (item.key === minIndex) fileToDelete = item.name;
    }

    const pathToRemoveFile = path.resolve(dest, fileToDelete);
    const stats = await stat(pathToRemoveFile);
    if (stats && stats.isFile()) {
      await unlink(pathToRemoveFile);
      console.log(
        chalk.redBright(`♻ ♻ ♻ Файл ${fileToDelete} успешно удален! ♻ ♻ ♻`)
      );
    }
  }
};
