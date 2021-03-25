import DbIndex from '../models/dbIndex';
import DbTable from '../models/dbTable';
import NodeState from '../models/nodeState';

interface TreeNode {
  id?: string;
  parentId?: string | null;
  value?: string;
  state?: NodeState;
  children: TreeNode[]
}

export default function dbToTree(items: DbTable): TreeNode[] {
    const rootItems: TreeNode[] = [];
    const lookup: { [id: string]: TreeNode } = {};

    const orphanIds: null | Set<string> = new Set();    
  
    for (const item of Object.values(items)) {
      const itemId = item.id;
      const parentId = item.parentId;
  
      if (!Object.prototype.hasOwnProperty.call(lookup, itemId)) {
        lookup[itemId] = { children: [] };
      }

      if (orphanIds.has(itemId)) {
        orphanIds.delete(itemId);
      }

      lookup[itemId] = {
        ...item,
        'children': lookup[itemId]['children']
      };
  
      const treeItem = lookup[itemId];
  
      if (!parentId) {
        rootItems.push(treeItem);
      } else {
        if (!Object.prototype.hasOwnProperty.call(lookup, parentId)) {
          lookup[parentId] = { children: [] };
          orphanIds.add(parentId);
        }
        
        lookup[parentId]['children'].push(treeItem);
      }
    }

    if (orphanIds.size > 0) {
      for (let id of Array.from(orphanIds)) {
        rootItems.push(...lookup[id].children);
      }
    }
  
    return rootItems;
}

export function createDbParentIndex(items: DbTable): DbIndex {
  const index: DbIndex = {};

  for (let node of Object.values(items)) {
    if (!index[node.id]) {
      index[node.id] = [];
    }

    if (node.parentId && index[node.parentId]) {
      index[node.parentId].push(node.id);
    }
  }

  return index;
}
