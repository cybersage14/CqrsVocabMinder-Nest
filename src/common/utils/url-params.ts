export const URL_REPLACE_PARAMS = (
  url: string,
  params: { [key: string]: string },
) => {
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key];
      url = url.replace(`:${key}`, value);
    }
  }
  return url;
};
