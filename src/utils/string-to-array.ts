// in a containerized/module based env
// this should be part of the sums context

/**
 * Receives a stringified list of numbers and converts it
 * into an array
 */
export const stringToArrayOfNumbers = (data: string) => {
  let processedData: number[] = [];

  try {
    if (typeof data === "string") {
      processedData = data.split(",").map((i) => {
        const num = parseInt(i.trim(), 10);

        if (isNaN(num)) {
          throw new Error("Received data is not a valid array of numbers.");
        }

        return num;
      });
    }

    if (Array.isArray(processedData)) return processedData;

    throw new Error("Input is not an array");
  } catch (error) {
    throw error;
  }
};
