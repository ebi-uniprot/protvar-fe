
export const removeSnakeAndKebabCases = (text) => {
  return text
    .replace('_', ' ')
    .replace('-', ' ')
    .toLowerCase();
}
