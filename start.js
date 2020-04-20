const path = require("path");
const fs = require("fs");
const archiver = require("archiver");
const { promisify } = require("util");
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const readDir = async (from, archive, exception) => {
  const cylceDir = async (start, archive, exception) => {
    try {
      let list = await readdir(start);

      for await (const it of list) {
        const targetPath = path.join(start, it);

        const nameForArchive = await pather(targetPath, from);
        const stats = await stat(targetPath);
        if (exception.includes(it)) return null;
        if (stats && stats.isFile()) {
          archive.append(fs.createReadStream(targetPath), {
            name: nameForArchive,
          });
        } else {
          await cylceDir(targetPath, archive, exception);
        }
      }
    } catch (err) {
      console.log("-> Error", err);
    }
  };

  await cylceDir(from, archive, exception);
};

const zipper = async (from, to, exception) => {
  if (!from || !to) return null;
  const output = fs.createWriteStream(to);
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  archive.pipe(output);

  await readDir(from, archive, exception);
  console.log("-> end");
  archive.on("error", function (err) {
    throw err;
  });

  archive.on("warning", function (err) {
    if (err.code === "ENOENT") {
      console.log("-> Warning", err);
    } else {
      // throw error
      throw err;
    }
  });

  output.on("close", function () {
    console.log(archive.pointer() + " total bytes");
    console.log(
      "archiver has been finalized and the output file descriptor has closed."
    );
  });
  output.on("end", function () {
    console.log("Data has been drained");
  });

  archive.finalize();
};

const pather = async (target, subtrahend) => {
  let res = target.replace(subtrahend, "");
  if (res[0] === "\\" || "/") {
    res = res.substr(1, res.length);
  }
  return res;
};
const nameForArchive = (name) => {};
const nameArchive = "backup";
const from = path.resolve("h:/development/silver-shop");
const to = path.resolve("h:/solutions/node/scanner-to-backup/test.zip");
const exception = ["node_modules", "self-test"];

zipper(from, to, exception);
/* const readDir = async (base, target, archive, exception) => {
  try {
    let list = await readdir(base);

    for await (const it of list) {
      const targetPath = path.join(base, it);
      console.log("-> dir", base);
      const stats = await stat(targetPath);
      //if (exception.includes(dirname)) return null;

      if (stats && stats.isFile()) {
        archive.append(fs.createReadStream(targetPath), {
          name: targetPath,
        });
      } else {
        await readDir(base, targetPath, archive, exception);
      }
    }
  } catch (err) {
    throw new Error(err);
  }
}; */
/* const zipper = async () => {
  const exception = ["node_module", "self-test"];
  const from = path.resolve("h:/solutions/node/scanner-to-backup/testfolder");
  const to = path.resolve("h:/solutions/node/scanner-to-backup/test.zip");
  await readDir(from, archive, exception);
  const options = { from, to };
  const output = fs.createWriteStream(options.to);
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  archive.pipe(output);

  archive.on("error", function (err) {
    throw err;
  });
  archive.on("warning", function (err) {
    if (err.code === "ENOENT") {
      // log warning
    } else {
      // throw error
      throw err;
    }
  });

  output.on("close", function () {
    console.log(archive.pointer() + " total bytes");
    console.log(
      "archiver has been finalized and the output file descriptor has closed."
    );
  });
  output.on("end", function () {
    console.log("Data has been drained");
  }); 

  

  archive.finalize();
};

zipper(); */
