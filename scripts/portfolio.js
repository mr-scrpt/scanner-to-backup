const path = require("path");
const { backupper } = require("../utils/backupper");

const options = {
  from: path.normalize("w:/portfolio/"),
  ftpFolder: "backups/portfolio/",
  temp: path.normalize("w:/"),
  exception: ["node_modules"],
  name: "portfolio",
};
backupper(options);
