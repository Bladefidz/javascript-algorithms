import RedBlackTree from '../RedBlackTree';

describe('RedBlackTree', () => {
  it('Find({ key: <val> }) should find single correct value', () => {
    const rbt = new RedBlackTree();

    rbt.put(6, 60);
    rbt.put(2, 20);
    rbt.put(5, 50);
    rbt.put(7, 70);
    rbt.put(1, 10);
    rbt.put(3, 30);
    rbt.put(8, 80);
    rbt.put(4, 40);

    expect(rbt.find({ key: 3 })).toBe(30);
  });

  it('Find({ value: <val> }) should find correct keys', () => {
    const rbt = new RedBlackTree();

    rbt.put(6, 60);
    rbt.put(2, 20);
    rbt.put(5, 50);
    rbt.put(7, 70);
    rbt.put(1, 10);
    rbt.put(3, 30);
    rbt.put(8, 80);
    rbt.put(4, 40);

    expect(rbt.find({ value: 30 })).toEqual([3]);

    rbt.put(9, 30);

    expect(rbt.find({ value: 30 })).toEqual([3, 9]);
  });

  it('Find({ key: <val>, value: <val> }) should find correct object', () => {
    const rbt = new RedBlackTree();

    rbt.put(6, 60);
    rbt.put(2, 20);
    rbt.put(5, 50);
    rbt.put(7, 70);
    rbt.put(1, 10);
    rbt.put(3, 30);
    rbt.put(8, 80);
    rbt.put(4, 40);

    expect(rbt.find({ key: 3, value: 30 })).toEqual({ key: 3, value: [3] });

    rbt.put(9, 30);

    expect(rbt.find({ key: 3, value: 30 })).toEqual({ key: 3, value: [3, 9] });
  });

  it('Should maintain the order of number type keys', () => {
    const rbt = new RedBlackTree();

    rbt.put(6, 60);
    rbt.put(2, 20);
    rbt.put(5, 50);
    rbt.put(7, 70);
    rbt.put(1, 10);
    rbt.put(3, 30);
    rbt.put(8, 80);
    rbt.put(4, 40);

    expect(rbt.toString()).toBe('[[1,10],[2,20],[3,30],[4,40],[5,50],[6,60],[7,70],[8,80]]');
  });

  it('Should maintain the order of string type keys', () => {
    const rbt = new RedBlackTree();

    rbt.put('x', 1);
    rbt.put('bb', 2);
    rbt.put('a', 3);
    rbt.put('aa', 4);
    rbt.put('b', 5);

    expect(rbt.toString()).toBe('[["a",3],["aa",4],["b",5],["bb",2],["x",1]]');
  });

  it('Should maintain the order of mixed type keys', () => {
    const rbt = new RedBlackTree();

    rbt.put(6, 60);
    rbt.put(2, 20);
    rbt.put(5, 50);
    rbt.put(7, 70);
    rbt.put(1, 10);
    rbt.put(3, 30);
    rbt.put(8, 80);
    rbt.put(4, 40);
    rbt.put('x', 1);
    rbt.put('bb', 2);
    rbt.put('a', 3);
    rbt.put('aa', 4);
    rbt.put('b', 5);

    expect(rbt.toString()).toBe('[[1,10],[2,20],[3,30],[4,40],[5,50],[6,60],[7,70],[8,80],["a",3],["aa",4],["b",5],["bb",2],["x",1]]');
  });
});
