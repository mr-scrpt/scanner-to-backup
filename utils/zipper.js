const fs = require("fs");
const { promisify } = require("util");
const unlink = promisify(fs.unlink);
const archiver = require("archiver");
const { namer } = require("./namer");
const { scanner } = require("./scanner");

const FTPClient = require("./ftp");
const path = require("path");
const chalk = require("chalk");
const client = new FTPClient({
  host: "192.168.0.102",
  port: "21",
  user: "dolce",
  password: "101601630",
});

module.exports.zipper = async ({ from, temp, exception, name, ftpFolder }) => {
  if (!from || !temp) return null;

  const toArchive = namer(name);

  const finalDest = path.normalize(`${temp}/${toArchive}`);

  const ftpPathToFolder = path.normalize(`backups/${ftpFolder}/`);

  const ftpPathToArchive = path.normalize(`${ftpPathToFolder}/${toArchive}`);
  const output = fs.createWriteStream(finalDest);
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  archive.pipe(output);

  await scanner(from, archive, exception);
  console.time("zipping");
  archive.finalize();

  output.on("close", async () => {
    console.log(archive.pointer() + " total bytes");
    console.log(`
      ${chalk.greenBright(
        "⚡⚡⚡ archiver has been finalized and the output file descriptor has closed ⚡⚡⚡"
      )}`);

    console.timeEnd("zipping");

    console.log("-> откуда", finalDest);
    console.log("-> куда", ftpPathToArchive);
    await client.connect();
    console.time("sending");

    await client.upload(finalDest, "backups/promsklad/", toArchive);
    console.log("-> one", finalDest);
    console.log("-> two", "backups/add/new/file/");
    console.log("-> There", toArchive);
    await client.cleaner(ftpPathToFolder);
    await client.disconnect();
    console.timeEnd("sending");

    console.time("remove-tmp-file");
    await unlink(finalDest);
    console.timeEnd("remove-tmp-file");
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
};
