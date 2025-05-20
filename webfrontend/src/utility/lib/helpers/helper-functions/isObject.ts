/**
 * Use this for typechecking in data fetching components, which rely on a certain dataformat to work.
 * @param value The parameter could be any dataformat.
 * @returns Wether the argument is an object or not.
 */
export const isObject = (value: any) => {
    return (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof RegExp) &&
      !(value instanceof Date) &&
      !(value instanceof Set) &&
      !(value instanceof Map)
    );
  };