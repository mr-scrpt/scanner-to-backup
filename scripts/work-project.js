const path = require("path");
const { backupper } = require("../utils/backupper");

const options = {
  from: path.normalize("w:/work-project/"),
  ftpFolder: "backups/work-project/",
  temp: path.normalize("w:/"),
  exception: ["node_modules"],
  name: "work-project",
};
backupper(options);
