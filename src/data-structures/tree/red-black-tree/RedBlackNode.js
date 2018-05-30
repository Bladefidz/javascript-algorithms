/**
 * Segment id distance of A to z is 57. Add 1 became 58.
 * If each char has 8 length at most, then there is a combination 58^8 = 128063081718016.
 * Then all combination is 58^9 = 7427658739644928.
 */
const STRING_ENCODING_LENGTH = 8;
const STRING_SEGMENT = 58;
const STRING_COMBINATION = STRING_SEGMENT ** STRING_ENCODING_LENGTH;

export default class RedBlackNode {
  /**
   * Red-black tree node constructor.
   * Each node has key->value to facilitate table lookup.
   * @constructor
   * @param {(string|number)} key - key or index.
   * @param {object} value - value.
   * @param {boolean} color - parent's color.
   */
  constructor(key = null, value = null, color = null, size = 1) {
    this.left = null;
    this.right = null;
    if (typeof key === 'string') {
      if (key.length > STRING_ENCODING_LENGTH) {
        throw new Error('String type key exceed STRING_ENCODING_LENGTH');
      }
    }
    this.key = key;
    this.value = value;
    this.color = color; // Color of parent link
    this.size = size; // Size of subtree
  }

  decodeStrKey(key) {
    if (typeof key !== 'string') {
      throw new Error('Input should be string');
    }

    let k = 0;
    if (key.length > 1) {
      k = [...key.slice(1)]
        .map(char => char.charCodeAt(0) - 64)
        .reduce((current, previous) => current + previous);
    }
    k += (key.charCodeAt(0) - 64) * STRING_COMBINATION;

    return k;
  }

  /**
   * Compare two node based on their keys
   * @param {object} node - node to compare.
   * @returns {Number} comparation result.
   */
  compareTo(node) {
    if (typeof this.key === 'number' && typeof node.key === 'number') {
      if (this.key > node.key) return 1;
      if (this.key < node.key) return -1;
      return 0;
    }
    if (typeof this.key === 'string' && typeof node.key === 'string') {
      // Compare based on sum of char codes
      const key1 = this.decodeStrKey(this.key);
      const key2 = this.decodeStrKey(node.key);

      if (key1 > key2) return 1;
      if (key1 < key2) return -1;
      return 0;
    }
    const t1 = typeof this.key;
    const t2 = typeof node.key;
    throw new Error(`Not consistent comparation type: ${t1} versus ${t2}`);
  }
}
