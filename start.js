const path = require("path");
const fs = require("fs");
const archiver = require("archiver");
const { promisify } = require("util");
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const { namer } = require("./utils/namer");
const { pather } = require("./utils/pather");

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

const zipper = async ({ from, to, exception, name }) => {
  if (!from || !to) return null;

  const toArchive = namer(name);
  const output = fs.createWriteStream(toArchive);
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

const options = {
  from: path.resolve("h:/development/silver-shop"),
  to: path.resolve("h:/solutions/node/scanner-to-backup"),
  exception: ["node_modules", "self-test"],
  name: "backup",
};

zipper(options);
