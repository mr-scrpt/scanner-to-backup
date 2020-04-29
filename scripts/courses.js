const path = require("path");
const { backupper } = require("../utils/backupper");

const options = {
  from: path.normalize("h:/courses/"),
  ftpFolder: "backups/courses/",
  temp: path.normalize("w:/"),
  exception: ["node_modules"],
  name: "courses",
};
backupper(options);
