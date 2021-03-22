import DbNode from '../models/dbNode';

interface DbTable {
  [id:string]: DbNode
}

interface TreeNode {
  id?: string;
  parentId?: string | null;
  value?: string;
  children: TreeNode[]
}

export default function(items: DbTable): TreeNode[] {
    const rootItems: TreeNode[] = [];
    const lookup: { [id: string]: TreeNode } = {};

    const orphanIds: null | Set<string> = new Set();    
  
    for (const id in items) {
      const item = items[id];
      const itemId = id;
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
          lookup[parentId] = { 'children': [] };
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
