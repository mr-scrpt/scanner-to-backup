const fs = require("fs");
const archiver = require("archiver");
const { namer } = require("./namer");
const { scanner } = require("./scanner");
const path = require("path");
const chalk = require("chalk");

module.exports.zipper = async ({ from, to, exception, name }) => {
  if (!from || !to) return null;

  const toArchive = namer(name);
  const finalDest = path.resolve(to, toArchive);
  const output = fs.createWriteStream(finalDest);
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  archive.pipe(output);
  console.time("zip");
  await scanner(from, archive, exception);

  archive.finalize();

  output.on("close", function () {
    console.log(archive.pointer() + " total bytes");
    console.log(`
      ${chalk.greenBright(
        "⚡⚡⚡ archiver has been finalized and the output file descriptor has closed ⚡⚡⚡"
      )}
      ${chalk.blueBright(`Congratulations!`)}
      
      `);
    console.timeEnd("zip");
  });

  // This event is fired when the data source is drained no matter what was the data source.
  // It is not part of this library but rather from the NodeJS Stream API.
  // @see: https://nodejs.org/api/stream.html#stream_event_end
  output.on("end", function () {
    console.log("Data has been drained");
  });
  archive.on("error", function (err) {
    throw err;
  });

  archive.on("warning", function (err) {
    if (err.code === "ENOENT") {
      console.log("-> Warning", err);
    } else {
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
};
