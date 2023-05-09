export const emailValidate = (email: string) => {
  let error = '';
  if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
    error = 'Invalid email address'
  }
  return error;
};