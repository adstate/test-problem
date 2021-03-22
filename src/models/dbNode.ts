import NodeState from "./nodeState";

export default interface DbNode {
    id: string;
    parentId: string | null;
    value: string;
    state: NodeState;
}
