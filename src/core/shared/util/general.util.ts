export const trimRecursive = <K>(obj: K): K => {
  if (Buffer.isBuffer(obj)) {
    return obj;
  }

  if (typeof obj === 'string') {
    return obj.trim() as K;
  }

  if (Array.isArray(obj)) {
    return obj.map((x) => trimRecursive(x)) as K;
  }

  if (typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, curr) => {
      acc[curr] = obj[curr] && trimRecursive(obj[curr]);
      return acc;
    }, {}) as K;
  }

  return obj;
};

export const assertDefined = <K>(value: K) => {
  if (Array.isArray(value)) {
    return value.map((x) => assertDefined(x)) as K;
  }

  if (typeof value === 'object') {
    return Object.keys(value).reduce((acc, curr) => {
      acc[curr] = assertDefined(value[curr]);
      return acc;
    }, {}) as K;
  }

  if (typeof value === 'undefined' || value === null) {
    throw new Error("Value can't be null or undefined");
  }

  return value;
};
