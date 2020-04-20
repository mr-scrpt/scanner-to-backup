module.exports.pather = async (target, subtrahend) => {
  let res = target.replace(subtrahend, "");
  if (res[0] === "\\" || "/") {
    res = res.substr(1, res.length);
  }
  return res;
};
