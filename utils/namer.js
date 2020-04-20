module.exports.namer = (name) => {
  const dateObj = new Date();
  const d = dateObj.getDate();
  const m = dateObj.getMonth() + 1;
  const y = dateObj.getFullYear();

  return `${name}_${d}-${m}-${y}.zip`;
};
