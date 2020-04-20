const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const { pather } = require("./pather");

module.exports.scanner = async (from, archive, exception) => {
  let i = 0;
  let t = 0;
  const cylceDir = async (start, archive, exception) => {
    try {
      const list = await readdir(start);

      for await (const it of list) {
        const targetPath = path.join(start, it);

        const nameForArchive = await pather(targetPath, from);
        const stats = await stat(targetPath);
        console.log("-> Итераций!", ++t);
        if (!exception.includes(it)) {
          if (stats && stats.isFile()) {
            const stream = fs.createReadStream(targetPath);

            archive.append(stream, {
              name: nameForArchive,
            });

            await new Promise((resolve) => {
              stream.on("close", () => {
                console.log("-> Файлов обработано!", ++i);
                resolve();
              });
            });
          } else {
            await cylceDir(targetPath, archive, exception);
          }
        }
      }
    } catch (err) {
      console.log("-> Error", err);
    }
  };
  await cylceDir(from, archive, exception);
};
