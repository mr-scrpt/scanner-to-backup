const chalk = require("chalk");

module.exports.cleanerFtp = async (list) => {
  if (!list) return null;
  const limit = 5;
  const count = list.length + 1;
  if (count > limit) {
    console.log(
      chalk.redBright(
        `-> Папка содержиет больше файлов чем установленный лимит - ${limit}. Текущее количество файлов в каталоге - ${count}`
      )
    );
    return null;
  }
  if (count > 3) {
    const keys = [];
    const names = list.map((item) => {
      const date = item.name
        .slice(0, item.name.indexOf("."))
        .slice(item.name.indexOf("_") + 1, item.name.length);

      const [day, mounth, year] = date.split("-");
      const timeStamp = Date.parse(`${year}-${mounth}-${day}`);

      !isNaN(timeStamp) && keys.push(timeStamp);

      return { name: item.name, key: timeStamp };
    });

    const minIndex = Math.min.apply(null, keys);
    console.log("-> index", minIndex);
    let fileToDelete = "";
    for (const item of names) {
      if (item.key === minIndex) fileToDelete = item.name;
    }

    return fileToDelete;
  }
  return null;
};
