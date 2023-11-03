export const generateRandomId = () => {
  const min = 0;
  const max = 99999999999999;
  const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return String(randomNum);
};
