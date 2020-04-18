const path = require("path");
const fs = require("fs");
const archiver = require("archiver");
const { promisify } = require("util");
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const readDir = async (base, archive, exception, dirname = "") => {
  try {
    let list = await readdir(base);
    for await (const it of list) {
      const targetPath = path.join(base, it);
      const fileDestWithOutFolder = path.join(dirname, it);

      const stats = await stat(targetPath);
      if (exception.includes(dirname)) return null;
      if (stats && stats.isFile()) {
        archive.append(fs.createReadStream(targetPath), {
          name: fileDestWithOutFolder,
        });
      } else {
        await readDir(targetPath, archive, exception, it);
      }
    }
  } catch (err) {
    throw new Error(err);
  }
};

const zipper = async () => {
  const exception = ["node_module", "self-test"];

  const options = { base: "testfolder", dest: "/archive.zip" };
  var output = fs.createWriteStream(__dirname + options.dest);
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
  await readDir(options.base, archive, exception);
  archive.finalize();
};

zipper();
