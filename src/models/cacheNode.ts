import DbNode from './dbNode';
import NodeState from './nodeState';

export default interface CacheNode extends DbNode {
    state: NodeState
}
