const path = require("path");
const { backupper } = require("../utils/backupper");

const options = {
  from: path.normalize("h:/development/"),
  ftpFolder: "backups/development/",
  temp: path.normalize("w:/"),
  exception: ["node_modules"],
  name: "development",
};
backupper(options);
