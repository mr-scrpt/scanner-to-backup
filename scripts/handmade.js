const path = require("path");
const { backupper } = require("../utils/backupper");

const options = {
  from: path.normalize("h:/handmade/"),
  ftpFolder: "backups/handmade/",
  temp: path.normalize("w:/"),
  exception: ["node_modules"],
  name: "handmade",
};
backupper(options);
