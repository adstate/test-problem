import DbIndex from '../models/dbIndex';
import DbTable from '../models/dbTable';

class DbParentIndexService {
    index: DbIndex = {};

    create(table: DbTable) {
        const index: DbIndex = {};

        for (let node of Object.values(table)) {
          if (!index[node.id]) {
            index[node.id] = [];
          }
      
          if (node.parentId && index[node.parentId]) {
            index[node.parentId].push(node.id);
          }
        }

        this.index = index;
    }

    update(id: string, parentId: string | null) {
        if (this.index[id]) {
            this.index[id] = [];
        }

        if (parentId && this.index[parentId]) {
            this.index[parentId].push(id);
        }
    }

    getChilds(id: string) {
        return this.index[id] ? this.index[id] : [];
    }
}

export default new DbParentIndexService();
