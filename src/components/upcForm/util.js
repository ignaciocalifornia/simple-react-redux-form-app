export const normalize = (value) => {
  if (!value || typeof value !== 'string') {
    return ;
  }
  return value.replace(/-|_/g, '');
};
