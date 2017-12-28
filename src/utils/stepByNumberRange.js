/**
 * Step number in the given range.
 *
 * @param {number} current - current number will be step, which must be an integer
 * @param {number} difference - increatment or decreatment, which must be an integer
 * @param {number} start - the start number of the range, which must be an integer
 * @param {number} end - the end number of the range, which must be an integer
 * @returns {number} Stepped number in the given range
 */
export default function (current, difference, start, end) {
  const length = end + 1 - start;
  const fill = Math.ceil(Math.abs(difference) / length) * length;
  return (current - start + difference + fill) % length + start;
}
