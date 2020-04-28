const ProgressBar = require("progress");
const chalk = require("chalk");
module.exports = class ProgerssBar {
  constructor(total) {
    this.bar = new ProgressBar(
      "⏩ Завершено :percent [:bar] Прошло :elapsed секунд. Файлов: :total. Текущий [:name]",
      {
        total,
        width: 40,
        callback: () => {
          console.log(chalk.greenBright("⚡⚡⚡Архив создан!⚡⚡⚡"));
        },
      }
    );
  }

  tick = (name) => {
    this.bar.tick({
      name,
    });
  };
};
