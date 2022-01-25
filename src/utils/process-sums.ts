// in a containerized/module based env
// this should be part of the sums context
import { IProcessorOptions, ISum } from "src/types";

// O(n^2)
export function processWithoutDuplicates(array: number[], map: { [key: string]: number }) {
  const sums: ISum[] = [];

  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      const sum = array[i] + array[j];

      // if sum of first + second is in map
      if (sum in map) {
        const sumIdx = map[sum];

        // and the indexes don't overlap
        if (i !== sumIdx && j !== sumIdx) {
          // create a new match // i is the index of n2
          sums.push({ pA: i, pB: j, sum: sumIdx });
        }
      }
    }
  }

  return sums;
}

// worst: O(n^3) for [0,0,0,0,0,0,0,0]
// typical: O(n^2 * m)
// where 'm' is the number of indexes for a unique number

export async function processWithDuplicates(array: number[], options: IProcessorOptions) {
  let sums: ISum[] = [];
  const unique: { [key: string]: number[] } = {};

  // split the array such that each unique number is a key in the object
  // as unique[number] = [...indexes of number]
  // to be used as a lookup table for sums
  array.forEach((v, i) => (v in unique ? unique[v].push(i) : (unique[v] = [i])));

  let counter = 0;
  for (let i = 0; i < array.length; i++) {
    //
    for (let j = i + 1; j < array.length; j++) {
      const sum = array[i] + array[j];

      if (!options.disableFailsafe && counter > 300) {
        counter = 0;
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      if (sum in unique) {
        // wether we create another loop outside of the first two
        // or not, the result is going to be the same, if not worse.
        for (let k = 0; k < unique[sum].length; k++) {
          /*
          // if memory usage is over 10% and we have over 4000 items,
          // trigger fail safe and clear the sums
          if (!options.disableFailsafe && getMemoryUsage()>10 && sums.length > 4000) {
            await triggerFailSafe(sums);
            sums = [];
          }
          */

          // the index might be the same for arrays like [0, 0, 0, 0]
          // where the sum can also be the number itself
          if (k !== i && k !== j) {
            sums.push({ pA: i, pB: j, sum: k });
          }
          counter++;
        }
      }
    }
  }

  return sums;
}
/*
// a failsafe can be implemented
// when the memory goes over a certain percentage or
// when the list gets too large

async function triggerFailSafe(sums: ISum[]) {
  console.log("triggering fail safe");
  onMemoryOverflow(sums);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return true;
}

const onMemoryOverflow = (data: ISum[]) => {
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `sums${Date.now()}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const getMemoryUsage = () => {
  //@ts-ignore
  const limit = performance.memory.jsHeapSizeLimit / 1024 / 1024;
  //@ts-ignore
  const used = performance.memory.usedJSHeapSize / 1024 / 1024;

  return parseInt(((used / limit) * 100).toFixed(2));
};
*/
