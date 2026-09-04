export function getUniqueSorted<Value extends string>(values: Value[]): Value[] {
  return Array.from(new Set(values)).sort((firstValue, secondValue) =>
    firstValue.localeCompare(secondValue)
  );
}
