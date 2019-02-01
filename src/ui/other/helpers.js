
export const removeSnakeAndKebabCases = (text) => {

  if ('undefined' === typeof text) {
    return;
  }

  return text
    .replace('_', ' ')
    .replace('-', ' ')
    .toLowerCase();
}
