/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

/**
 * Gets a random value from an array.
 * @param array - The array to get a random value from.
 * @returns A random value from the array.
 */
export const getRandomValue = <T>(array: Array<T>): T => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- we know the type is correct
  return array[Math.floor(Math.random() * array.length)] as T;
};
