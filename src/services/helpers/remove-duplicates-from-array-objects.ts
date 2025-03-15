function removeDuplicatesFromArrayObjects<T>(array: T[], key: keyof T) {
  const lookup = new Set();
  return array.filter(
    (item) => !lookup.has(item[key]) && lookup.add(item[key])
  );
}

export default removeDuplicatesFromArrayObjects;
