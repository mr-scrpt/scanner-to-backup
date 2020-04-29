const path = require("path");
const { backupper } = require("../utils/backupper");

const options = {
  from: path.normalize("h:/solutions/"),
  ftpFolder: "backups/solutions/",
  temp: path.normalize("w:/"),
  exception: ["node_modules"],
  name: "solutions",
};
backupper(options);
