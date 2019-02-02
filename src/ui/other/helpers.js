
export const removeSnakeAndKebabCases = (text) => {

  if ('undefined' === typeof text || null === text) {
    return;
  }

  return text
    .replace(/[_-]/g, ' ')
    .toLowerCase();
}
