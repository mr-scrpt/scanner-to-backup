const fs = require("fs");
const archiver = require("archiver");

const { namer } = require("./namer");
const { scanner } = require("./scanner");
const { cleaner } = require("./cleaner");
//const FTPClient = require("./ftp");
const path = require("path");
const chalk = require("chalk");
const client = new FTPClient("192.168.0.102", 21, "dolce", "101601630", false);

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

  output.on("close", async () => {
    console.log("-> TO", to);
    console.log(archive.pointer() + " total bytes");
    console.log(`
      ${chalk.greenBright(
        "⚡⚡⚡ archiver has been finalized and the output file descriptor has closed ⚡⚡⚡"
      )}`);

    console.timeEnd("zip");
    console.log(chalk.blackBright("-> Start Clean Dir!"));

    //client.upload(finalDest, "backups/new/test.zip", 777);
    //cleaner(to);
  });

  // This event is fired when the data source is drained no matter what was the data source.
  // It is not part of this library but rather from the NodeJS Stream API.
  // @see: https://nodejs.org/api/stream.html#stream_event_end
  output.on("end", () => {
    console.log("Data has been drained");
  });
  archive.on("error", (err) => {
    throw err;
  });

  archive.on("warning", (err) => {
    if (err.code === "ENOENT") {
      console.log("-> Warning", err);
    } else {
      throw err;
    }
  });

  output.on("close", () => {
    console.log(archive.pointer() + " total bytes");
    console.log(
      "archiver has been finalized and the output file descriptor has closed."
    );
  });
  output.on("end", () => {
    console.log("Data has been drained");
  });
};
