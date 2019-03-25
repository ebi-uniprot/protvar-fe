
// TODO: Replace the use of 'removeSnakeAndKebabCases' with
// 'removeSnakeCase' and 'removeKebabCase' funcitons.
// TODO: Provide an aurgument to decide if return valuse
// should be lower-cased or not.
const removeSnakeAndKebabCases = (text) => {
  if (typeof text === 'undefined' || text === null) {
    return text;
  }

  return text
    .replace(/[_-]/g, ' ')
    .toLowerCase();
};

const removeSnakeCase = (text) => {
  if (typeof text === 'undefined' || text === null) {
    return text;
  }

  return text
    .replace(/[_]/g, ' ')
    .toLowerCase();
};

const removeKebabCase = (text) => {
  if (typeof text === 'undefined' || text === null) {
    return text;
  }

  return text
    .replace(/[-]/g, ' ')
    .toLowerCase();
};

export {
  removeSnakeAndKebabCases,
  removeSnakeCase,
  removeKebabCase,
};
