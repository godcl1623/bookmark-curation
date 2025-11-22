export const findIndex = (array: unknown[], value: unknown) => {
  const index = array.findIndex((item) => item === value);
  return index === -1 ? 0 : index;
};
