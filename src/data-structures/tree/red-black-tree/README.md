# Red Black Tree

Red-black tree is most popular self-balancing binary search tree algorithm. First introduced by [Leonidas J. Guibas](https://en.wikipedia.org/wiki/Leonidas_J._Guibas) and [Robert Sedgewick](https://en.wikipedia.org/wiki/Robert_Sedgewick_(computer_scientist)) in the 1978 paper "A Dichromatic Framework for Balanced Trees". Their work inspired by previous work by [Rudolf Bayer](https://en.wikipedia.org/wiki/Rudolf_Bayer) at 1972. The most recent variant of red-black tree is Left-Lining Red-Black (LLRB) tree invented by [Robert Sedgewick](https://en.wikipedia.org/wiki/Robert_Sedgewick_(computer_scientist)) in the 2008 paper ["Left-leaning Red-Black Trees"](https://www.cs.princeton.edu/~rs/talks/LLRB/LLRB.pdf). 

Basically, red-black tree is improved version of [2-3 tree](https://en.wikipedia.org/wiki/2%E2%80%933_tree) by represent 2-3 tree as binary search tree. Red-black tree use *red link* to bind together 2-nodes to represent 3-nodes, then connecting each childs to its parent using *black link*. Consider an image below:

![2-3 nodes in red-blac BST](https://algs4.cs.princeton.edu/33balanced/images/redblack-encoding.png)

The first part of image (above) is 3-nodes representation in 2-3 tree, while the second part of image (below) is 2-nodes representation using red and black links.

## Basic Operation

### Find

Since red-black tree break down 3-nodes into 2-nodes representation, the find operation similar to find operation in regular binary search tree.

### Flipping Colors and Rotation

Flipping color is key concept in red-black tree in order to maintain balance of tree while rotation executed when insertion and deletion occured. Consider three images below with their implementation in Java:

##### Left Rotation

![Left rotation](https://algs4.cs.princeton.edu/33balanced/images/redblack-left-rotate.png)

##### Right Rotation

![Right rotation](https://algs4.cs.princeton.edu/33balanced/images/redblack-right-rotate.png)

#### Fliping Colors

![Flipping colors](https://algs4.cs.princeton.edu/33balanced/images/color-flip.png)

Notice that when subtree is balanced, parent's colors flipped from red to black.

## Insertion

Just keep in mind that:

* When insertion caused tree has incomplete leaves, then each unbalanced tree has red link.
* When insertion caused tree has complete leaves, then all red links dismissed.

![Red-black tree insertion](https://algs4.cs.princeton.edu/33balanced/images/redblack-construction.png)

An interactive animation of left-leaning red-black tree can be found at [here](http://inst.eecs.berkeley.edu/~cs61b/fa17/materials/demos/ll-red-black-demo.html)

## Performance

### Worst case

* search: `2 lg N`
* insert: `2 lg N`
* delete: `2 lg N`

### Average case

* search: `~ 1.00 lg N`
* insert: `~ 1.00 lg N`
* delete: `~ 1.00 lg N`

## Implementation in Software Industry

MySQL used Red-Black tree to store index keys in memory and key value into B-Tree. When memory reach its limits, MySQL writes all keys to disk.


## References
* [Algorithm 4 edition](https://algs4.cs.princeton.edu/33balanced/)
* [Algorithm course slides](https://drive.google.com/file/d/1XC5qTc-9XdR2waDoNnxD-FH66ocFX2DO/view)
* [Bulk insert MySQL](https://dev.mysql.com/doc/internals/en/bulk-insert.html)
* [The Physical Structure of an InnoDB Index](https://dev.mysql.com/doc/refman/8.0/en/innodb-physical-structure.html)
* [wikipedia](https://en.wikipedia.org/wiki/Red%E2%80%93black_tree)