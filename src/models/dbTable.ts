import DbNode from './dbNode';

export default interface DbTable {
    [id: string]: DbNode
}
