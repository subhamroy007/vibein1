export const getRandom = (max: number, min: number = 0) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const getDate = () => {
  return new Date(
    getRandom(2023, 2019),
    getRandom(0, 11),
    getRandom(1, 28),
    getRandom(0, 23),
    getRandom(0, 59),
    getRandom(0, 59)
  ).toUTCString();
};
