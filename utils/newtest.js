const scan = async () => {
  const list = [1, 2, 3, 4, 5, 6, 7, 8];

  for await (const it of list) {
    if (it === 5) {
      console.log("-> Исключение", it);
      Promise.reject();
      console.log("-> after");
    }
    console.log("-> Пункт", it);
    Promise.resolve();
  }
};
scan();
