export const pxtorem = (x = 200, rootValue = 30) => x / rootValue + "rem";

export const copyPropertiesIgnoreExists = (dst = {}, src = {}) => {
  Object.keys(src).forEach((key) => {
    // eslint-disable-next-line no-prototype-builtins
    if (!dst.hasOwnProperty(key)) {
      dst[key] = src[key];
    }
  });
};