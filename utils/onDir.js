const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const readDir = async ({ del, base, dest }, onFile, onDir) => {
  try {
    let list = await readdir(base);

    for await (const it of list) {
      const targetPath = path.join(base, it);
      const stats = await stat(targetPath);

      if (stats && stats.isFile()) {
        await onFile(it, dest, targetPath, del);
      } else {
        const options = { base: targetPath, dest: dest, del: del };
        await readDir(options, onFile, onDir);
      }
    }

    await onDir(base, del);
  } catch (err) {
    throw new Error(err);
  }
};
module.exports = readDir;
