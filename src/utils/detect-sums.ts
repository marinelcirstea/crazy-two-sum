// in a containerized/module based env
// this should be part of the sums context

import { IProcessorOptions } from "src/types";
import { processWithDuplicates, processWithoutDuplicates } from "./process-sums";
import { stringToArrayOfNumbers } from "./string-to-array";

export const detectSums = (str: string, options: IProcessorOptions) => {
  if (!str) throw new Error("Input is invalid.");

  const array = stringToArrayOfNumbers(str);

  const unique = isArrayOfUniqueNumbers(array);

  const sums = unique
    ? processWithoutDuplicates(array, unique)
    : processWithDuplicates(array, options);

  return sums;
};

function isArrayOfUniqueNumbers(array: number[]) {
  const unique: { [key: string]: number } = {};

  for (let i = 0; i < array.length; i++) {
    // if a duplicate is found, break and return null
    if (array[i] in unique) return null;

    unique[array[i]] = i;
  }

  // if the array doesn't have duplicates, pass down the 'unique' object
  // so that we don't have to construct it again
  // maybe we should do this with duplicates as well.. Later..
  return unique;
}
