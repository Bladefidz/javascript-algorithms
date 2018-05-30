/**
 * Red-Black Tree.
 * This is extended version of Red-Black Tree implementation as symbol table.
 * Each value has a unique key which is also accept both Number and String.
 * The behavior similar to MySQL or InnoDB storage engine,
 * but it is schemaless like MongoDB WiredTiger.
 * There are two type of keys:
 * - Number type key: Use regular typeof == number.
 * - String type key: Use regular typeof == string with fixed length encoding, so 'aa' > 'a'.
 * The string type keys index start after last number type keys.
 * For example:
 * {1: 'a', 2: 'b', 3: '3', 'a': 1, 'aa': 2, 'b': 3}
 * This implementation based on Kevin Wayne work written in Java:
 * https://github.com/kevin-wayne/algs4/blob/master/src/main/java/edu/princeton/cs/algs4/RedBlackBST.java
 * Hope anybody find it useful as myself in order to understand MySQL storage engine.
 * Enjoy!
 */
import RedBlackNode from './RedBlackNode';

const RED = true;
const BLACK = false;

/**
 * RedBlackTree Class
 * red links represent by boolean TRUE
 * black links represent by boolean FALSE
 */
export default class RedBlackTree {
  /**
   * RedBlackNode constructor.
   * @constructor
   * @param {object} options - specify options to modify red-black tree behavior.
   */
  constructor() {
    this.numberRoot = null;
    this.stringRoot = null;

    // Group all keys that have same value;
    this.invertedIndex = {}; // invers of value => [keys]
  }

  /**
   * Is node's color is red?
   * @param {object} node - target node to examine is red or not.
   * @returns {boolean} red or not red.
   */
  isRed(node) {
    if (node == null) return false;
    return node.color === RED;
  }

  /**
   * Get size of tree.
   * @returns {number} size of tree.
   */
  size() {
    if (this.isEmpty()) return 0;
    if (this.numberRoot == null) return this.stringRoot.size;
    if (this.stringRoot == null) return this.numberRoot.size;
    return this.numberRoot.size + this.stringRoot.size;
  }

  /**
   * Get size of subtree.
   * @returns {number} size of subtree.
   */
  sizeAt(node = null) {
    if (node == null) return 0;
    return node.size;
  }

  /**
   * Is this tree is empty?
   * @returns {boolean} true is root is null.
   */
  isEmpty() {
    return !!(this.numberRoot == null && this.stringRoot == null);
  }

  /**
   * Get random key to be used for new value.
   * @returns {number} new random key.
   */
  getRandomKey() {
    return Date.now();
  }

  /**
   * Inset a new value without specified the key.
   * The key will automatically created.
   * @param {(string|number)} val - a value to be inserted.
   * @returns {boolean} true if success, false otherwise.
   */
  insert(val) {
    if (val == null) {
      throw new Error('Value can not be null!');
    }
    const lastSize = this.size();
    this.put({ value: val });
    if (this.size() > lastSize) {
      return true;
    }
    return false;
  }

  /**
   * Given specified key to insert new value.
   * If given key found, then update the old value.
   * @param {(string|number)} key - key for given value.
   * @param {(string|number)} value - value to be inserted or update into.
   */
  put(key, value) {
    let k = key;
    if (k == null) {
      k = this.getRandomKey();
    }
    const newNode = new RedBlackNode(k, value, RED, 1);
    if (typeof key === 'number') {
      this.numberRoot = this.putRecv(this.numberRoot, newNode);
      this.numberRoot.color = BLACK;
    }
    if (typeof key === 'string') {
      this.stringRoot = this.putRecv(this.stringRoot, newNode);
      this.stringRoot.color = BLACK;
    }
  }

  /**
   * Insert or update number value.
   * @param {object} node - current node.
   * @param {object} newNode - new node.
   * @returns {object} root.
   */
  putRecv(node, newNode) {
    if (node == null) {
      // Update the inverted index
      if (typeof this.invertedIndex[newNode.value] === 'undefined') {
        this.invertedIndex[newNode.value] = new Set([newNode.key]);
      } else {
        this.invertedIndex[newNode.value].add(newNode.key);
      }

      // Return new node as root
      return newNode;
    }

    let nextNode = node;
    const cmp = newNode.compareTo(node);
    if (cmp < 0) {
      nextNode.left = this.putRecv(nextNode.left, newNode);
    } else if (cmp > 0) {
      nextNode.right = this.putRecv(nextNode.right, newNode);
    } else {
      // Update existing key.
      nextNode.value = newNode.value;
    }

    // Fix up any right-lining links
    nextNode = this.fixRightLining(nextNode);

    // Update size of current node
    // note this is not increment, but replace
    nextNode.size = this.sizeAt(nextNode.left) + this.sizeAt(nextNode.right) + 1;

    // Update the inverted index
    if (typeof this.invertedIndex[newNode.value] === 'undefined') {
      this.invertedIndex[newNode.value] = new Set([newNode.key]);
    } else {
      this.invertedIndex[newNode.value].add(newNode.key);
    }

    return nextNode;
  }

  /**
   * Find node in tree.
   * - {key: <val>, value: <val>}: Find specific key and value.
   * - {key: <key>}: Find specific key with any value.
   * - {value: <val>}: Find specific value in any key.
   * @param {object} obj - {key: value} to search.
   * @returns {(object|string|number|null)} If found: find {key: <val>} return (string|number),
   * find {value: <val>} return array,
   * find {key: <val>, value: <val>} return object {key: (number|string), value: array}.
   * Else: return null
   */
  find(obj) {
    const searchNode = new RedBlackNode();
    const hasKey = obj.key || false;
    const hasValue = obj.value || false;

    if (hasKey && hasValue) {
      // Search specific key and value
      searchNode.key = obj.key;
      searchNode.value = obj.value;
    } else if (hasKey) {
      // Search specific key with any value
      searchNode.key = obj.key;
    } else if (hasValue) {
      // Search value in any keys, return keys
      // console.log(this.invertedIndex);
      const keys = this.invertedIndex[obj.value] || null;
      if (keys != null) {
        return Array.from(keys);
      }
      return [];
    } else {
      throw new Error('Key and value not found');
    }

    // Find a node by specifiy {key: <val>} or {key: <val>, value: <val>}
    if (typeof obj.key === 'number') {
      return this.findIter(this.numberRoot, searchNode);
    }
    if (typeof obj.key === 'string') {
      return this.findIter(this.stringRoot, searchNode);
    }
    return null;
  }

  /**
   * Find key and value or only key or only value in the tree.
   * @param {object} searchNode - number type value to find.
   * @returns {(number|null)} number if found, null if not found.
   */
  findIter(node, searchNode) {
    let currentNode = node;
    while (currentNode != null) {
      // console.log(currentNode);
      const cmp = searchNode.compareTo(currentNode);
      if (cmp < 0) {
        currentNode = currentNode.left;
      } else if (cmp > 0) {
        currentNode = currentNode.right;
      } else {
        // Find {key: <val>}
        if (searchNode.value == null) return currentNode.value;
        // Find {key: <val>, value: <val>}
        if (currentNode.value !== searchNode.value) return null;
        let keys = this.invertedIndex[currentNode.value] || null;
        if (keys != null) {
          keys = Array.from(keys);
        }
        return { key: currentNode.key, value: keys };
      }
    }
    return null;
  }

  /**
   * Is tree contains this key?
   * @param {(number|string)} k - key to check.
   * @returns {boolean} true if exist, false otherwise.
   */
  constains(k) {
    return !!this.find({ key: k });
  }

  /**
   * Remove key from the tree
   * @param {(string|number)} key - specify key to remove.
   * @returns {boolean} true if success, false otherwise.
   */
  remove(key) {
    if (key == null) throw new Error('Expect string or number, found null');
    if (!this.constains(key)) return false;

    if (typeof key === 'number') {
      return this.removeNumber(key);
    }
    if (typeof key === 'string') {
      return this.removeString(key);
    }

    return false;
  }

  /**
   * Delete key form tree.
   * @param {number} key - a key to delete
   * @returns {boolean}
   */
  removeNumber(key) {
    // Remove a node caused tree became unbalanced, so flip colors
    if (!this.isRed(this.numberRoot.left) && !this.isRed(this.numberRoot.right)) {
      this.numberRoot.color = RED;
    }

    const removeNode = new RedBlackNode(key);
    this.numberRoot = this.removeRecv(this.numberRoot, removeNode);
    if (!this.isEmpty()) this.numberRoot.color = BLACK;
    return true;
  }

  /**
   * Delete key form tree.
   * @param {string} key - a key to delete
   * @returns {boolean}
   */
  removeString(key) {
    // Remove a node caused tree became unbalanced, so flip colors
    if (!this.isRed(this.stringRoot.left) && !this.isRed(this.stringRoot.right)) {
      this.stringRoot.color = RED;
    }

    const removeNode = new RedBlackNode(key);
    this.numberRoot = this.removeRecv(this.stringRoot, removeNode);
    if (!this.isEmpty()) this.stringRoot.color = BLACK;
    return true;
  }

  /**
   * Find the node recursively, then remove it.
   * @param {object} node - a reference node.
   * @param {object} removeNode - a reference node to remove.
   * @returns {object} node.
   */
  removeRecv(node, removeNode) {
    let h = node;

    if (removeNode.compareTo(node) < 0) {
      if (!this.isRed(node.left) && !this.isRed(node.left.left)) {
        // If left child is balanced subtree, move one node from right to left
        h = this.moveRedLeft(h);
      }
      // Start traversing from left side
      h.left = this.removeRecv(h.left, removeNode);
    } else {
      if (this.isRed(h.left)) {
        // Maybe we remove a node in the right,
        // To anticipate tree became unbalanced, move one node from left to the right side.
        h = this.rotateRight(h);
      }
      if (removeNode.compareTo(h) === 0 && (h.right == null)) {
        // This node is root, remove the root
        return null;
      }
      if (!this.isRed(h.right) && !this.isRed(h.right.left)) {
        // Right side is balanced tree,
        // Again, to anticipate tree became unbalanced, move one node from left to the right side.
        // Now, the right side became unbalanced tree with red link
        h = this.moveRedRight;
      }
      if (removeNode.compareTo(h) === 0) {
        // Found the key, replace this node with lowest node in the right subtree.
        const x = this.minAt(h.right);
        h.key = x.key;
        h.val = x.val;
        h.right = this.deleteMin(h.right);
      } else {
        // Kepp traversing from right side
        h.right = this.removeRecv(h.right, removeNode);
      }
    }

    // Update inverted index
    this.invertedIndex[h.val].delete(h.key);

    return this.balance(h);
  }

  removeMin() {}

  /**
   * Travesing only in left direction to find minimum value
   * @param {object} node - a refernce node
   * @returns {object} node
   */
  removeMinFrom(node) {
    let h = node;
    if (h.left == null) {
      // current node is minimum.
      return null;
    }

    if (!this.isRed(h.left) && !this.isRed(h.left.left)) {
      // Left side is balanced tree, make it unbalance by move one node to the right side
      h = this.moveRedLeft(h);
    }

    h.left = this.removeMin(h.left);
    return this.balance(h);
  }

  removeMax() {}

  removeMaxFrom(node) { return node; }

  /**
   * Transform right-leaning into left-leaning
   * @param {object} node - a reference object of 3-nodes.
   * @returns {object} a same referenced object with modified links.
   */
  rotateLeft(node) {
    const h = node;
    const x = node.right;
    h.right = x.left;
    x.left = h;
    x.color = x.left.color;
    x.left.color = RED;
    x.size = h.size;
    h.size = this.sizeAt(h.left) + this.sizeAt(h.right) + 1;
    return x;
  }

  /**
   * Transform left-leaning into right-leaning
   * @param {object} node - a reference object of 3-nodes.
   * @returns {object} a same referenced object with modified links.
   */
  rotateRight(node) {
    const h = node;
    const x = node.left;
    h.left = x.right;
    x.right = h;
    x.color = x.right.color;
    x.right.color = RED;
    x.size = h.size;
    h.size = this.sizeAt(h.left) + this.sizeAt(h.right) + 1;
    return x;
  }

  /**
   * Flip node's colors if only if the subtree is balanced
   * @param {object} node - a reference object of 2-nodes.
   */
  flipColors(node) {
    const h = node;
    h.color = !h.color;
    h.left.color = !h.left.color;
    h.right.color = !h.right.color;
  }

  /**
   * Use to delete a node in left side of the tree,
   * then move one node from right to left in order to keep balance.
   * @param {object} node - a reference object of 2-nodes.
   * @returns {object} a same referenced object
   */
  moveRedLeft(node) {
    let h = node;
    this.flipColors(h);

    if (this.isRed(h.right.left)) {
      h.right = this.rotateRight(h.right);
      h = this.rotateLeft(h);
      this.flipColors(h);
    }
    return h;
  }

  /**
   * Use to delete a node in right side of the tree,
   * then move one node from left to right in order to keep balance.
   * @param {object} node - a reference object of 2-nodes.
   * @returns {object} a same referenced object
   */
  moveRedRight(node) {
    let h = node;
    this.flipColors(h);

    if (this.isRed(h.left.left)) {
      h = this.rotateRight(h);
      this.flipColors(h);
    }
    return h;
  }

  /**
   * Fix right lining nodes:
   * - Rotate if unbalanced.
   * - Flip colors if blanaced.
   * @param {object} node - node to examine.
   * @returns {object} node with fixed color.
   */
  fixRightLining(node) {
    let fixedNode = node;
    if (this.isRed(node.right) && !this.isRed(node.left)) {
      fixedNode = this.rotateLeft(node);
    }
    if (this.isRed(node.left) && this.isRed(node.left.left)) {
      fixedNode = this.rotateRight(node);
    }
    if (this.isRed(node.left) && this.isRed(node.right)) {
      this.flipColors(node);
    }
    return fixedNode;
  }

  /**
   * Balance the tree
   * @param {object} node - a reference key.
   * @returns {object} node.
   */
  balance(node) {
    let h = node;
    if (this.isRed(h.right)) {
      // Right side is unbalance, then move one node from right to left.
      h = this.rotateLeft(h);
    }
    if (this.isRed(h.left) && this.isRed(h.left.left)) {
      // Left node is unbalanced tree, then move one node from left to right.
      h = this.rotateRight(h);
    }
    if (this.isRed(h.left) && this.isRed(h.right)) {
      // we expect a subtree from root is balanced now, then flip colors
      this.flipColors(h);
    }

    h.size = this.sizeAt(h.left) + this.sizeAt(h.right) + 1;
    return h;
  }

  /**
   * Return current hight of the tree.
   * The height of a red-blackBST with N nodes is no more than 2 lg N.
   * @param {(object|null)} node - a referenced node or null as root.
   * @returns {number} height.
   */
  height(node = null) {
    if (node == null) {
      if (this.isEmpty()) return 0;
      if (this.numberRoot == null) {
        return 1 + Math.max(this.height(this.stringRoot.left), this.height(this.stringRoot.right));
      }
      if (this.stringRoot == null) {
        return 1 + Math.max(this.height(this.numberRoot.left), this.height(this.numberRoot.right));
      }
      const strings = Math.max(
        this.height(this.stringRoot.left),
        this.height(this.stringRoot.right),
      );
      const numbers = Math.max(
        this.height(this.numberRoot.left),
        this.height(this.numberRoot.right),
      );
      return 1 + strings + numbers;
    }
    return node.size;
  }

  /**
   * Get minimum node of this tree.
   * @param {object} node - minimum node.
   * @returns {object} node
   */
  min() {
    if (this.isEmpty()) {
      throw new Error('Tree is empty');
    }
    if (this.numberRoot == null) {
      return this.minAt(this.stringRoot);
    }
    return this.minAt(this.numberRoot);
  }

  /**
   * Get minimum node at subtree where this node is root.
   * @param {object} node - minimum node.
   * @returns {object} node
   */
  minAt(node) {
    const x = node;
    if (x.left == null) return x;
    return this.minAt(x.left);
  }

  /**
   * Get maximum node of this tree.
   * @param {object} node - maximum node.
   * @returns {object} node
   */
  max() {
    if (this.isEmpty()) {
      throw new Error('Tree is empty');
    }
    if (this.stringRoot == null) {
      return this.maxAt(this.numberRoot);
    }
    return this.maxAt(this.stringRoot);
  }

  /**
   * Get maximum node at subtree where this node is root.
   * @param {object} node - maximum node.
   * @returns {object} node
   */
  maxAt(node) {
    if (node.right == null) return node;
    return this.maxAt(node.right);
  }

  /**
   * Return all keys stored in the heap.
   * @returns {arrays} array of keys.
   */
  keys() {
    if (this.isEmpty()) return [];
    return this.keysRange(this.min(), this.max());
  }

  /**
   * Get all keys in specific range
   * @param {(object|nuber)} min - reverence of minimum value
   * @param {(object|nuber)} max - reverence of maximum value
   */
  keysRange(min, max) {
    if (min === null || max === null) {
      throw new Error('Can not accept null value!');
    }

    const numberKeys = [];
    const stringKeys = [];

    if (typeof min.key === 'number') {
      const low = new RedBlackNode(min.key);
      const high = new RedBlackNode(this.maxAt(this.numberRoot).key);
      this.keysRangeRecv(this.numberRoot, numberKeys, low, high);
    }
    if (typeof max.key === 'string') {
      const low = new RedBlackNode(this.minAt(this.stringRoot).key);
      const high = new RedBlackNode(max.key);
      this.keysRangeRecv(this.stringRoot, stringKeys, low, high);
    }

    return numberKeys.concat(stringKeys);
  }

  /**
   * Recursively push new node into array using divide and conquer method
   * @param {object} node - a reference node.
   * @param {objec} arr - an array to push each node.
   * @param {object} min - minimum node.
   * @param {object} max - maximum node.
   */
  keysRangeRecv(node, arr, min, max) {
    if (node != null) {
      const cmpLow = min.compareTo(node);
      const cmpHigh = max.compareTo(node);
      if (cmpLow < 0) {
        this.keysRangeRecv(node.left, arr, min, max);
      }
      if (cmpLow <= 0 && cmpHigh >= 0) {
        arr.push(node.key);
      }
      if (cmpHigh > 0) {
        this.keysRangeRecv(node.right, arr, min, max);
      }
    }
  }

  /**
   * Return all values stored in the heap.
   * @returns {arrays} array of values.
   */
  values() {
    if (this.isEmpty()) return [];
    return Object.keys(this.invertedIndex);
  }

  /**
   * Return all [key, value] pairs in the heap.
   * @returns {arrays} array of [keys, value] pair.
   */
  entries() {
    if (this.isEmpty()) return [];
    return this.entriesRange(this.min(), this.max());
  }

  /**
   * Get all keys in specific range
   * @param {(object|nuber)} min - reverence of minimum value
   * @param {(object|nuber)} max - reverence of maximum value
   */
  entriesRange(min, max) {
    if (min === null || max === null) {
      throw new Error('Can not accept null value!');
    }

    const numberKeys = [];
    const stringKeys = [];

    if (typeof min.key === 'number') {
      const low = new RedBlackNode(min.key);
      const high = new RedBlackNode(this.maxAt(this.numberRoot).key);
      this.entriesRangeRecv(this.numberRoot, numberKeys, low, high);
    }
    if (typeof max.key === 'string') {
      const low = new RedBlackNode(this.minAt(this.stringRoot).key);
      const high = new RedBlackNode(max.key);
      this.entriesRangeRecv(this.stringRoot, stringKeys, low, high);
    }

    return numberKeys.concat(stringKeys);
  }

  /**
   * Recursively push new node into array using divide and conquer method
   * @param {object} node - a reference node.
   * @param {objec} arr - an array to push each node.
   * @param {object} min - minimum node.
   * @param {object} max - maximum node.
   */
  entriesRangeRecv(node, arr, min, max) {
    if (node != null) {
      const cmpLow = min.compareTo(node);
      const cmpHigh = max.compareTo(node);
      if (cmpLow < 0) {
        this.entriesRangeRecv(node.left, arr, min, max);
      }
      if (cmpLow <= 0 && cmpHigh >= 0) {
        arr.push([node.key, node.value]);
      }
      if (cmpHigh > 0) {
        this.entriesRangeRecv(node.right, arr, min, max);
      }
    }
  }

  /**
   * Print all entries in this tree as string.
   * @returns {string} all keys and values in the tree.
   */
  toString() {
    return JSON.stringify(this.entries());
  }
}
