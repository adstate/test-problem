import React, {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CacheNodeEditor from './CacheNodeEditor';
import {editNode, addNode, deleteNode} from '../actions/cache';
import CacheNodeDelete from './CacheNodeDelete';
import NodeState from '../models/nodeState';

interface Props {
    cacheTree: any;
    expanded: string[];
}

interface RenderTree {
    id: string;
    parentId: string | null;
    value: string;
    state: NodeState;
    children?: RenderTree[];
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 300px;
  border: 1px solid #c0c0c0;
  border-radius: 2px;
`;

const TreeViewContainer = styled.div`
  flex: 1;
  width: 250px;
  height: 250px;
  padding: 10px;
  overflow-y: auto;
`;

const TreeViewToolbar = styled.div`
  display: flex;
  justify-content: center;
  padding: 5px;
`;

const StyledTreeItem = styled(TreeItem)<{state: NodeState}>`
  ${({state}) => state === NodeState.Deleted && `
    color: #c0c0c0;

    & div.MuiTreeItem-label:hover {
      background-color: #fff;
    }

    & div.MuiTreeItem-label {
      background-color: #fff !important;
      cursor: default;
    }
  `}

  ${({state}) => state === NodeState.New && `
    color: green;
  `}

  ${({state}) => state === NodeState.Changed && `
    color: orange;
  `}
`;

let selected = '';

const CacheTreeView: React.FC<Props> = ({cacheTree, expanded}) => {
    const dispatch = useDispatch();

    const [expandedNodes, setExpandedNodes] = React.useState<string[]>([]);
    const [operation, setOperation] = React.useState<string>('');

    React.useEffect(() => {
      setExpandedNodes(expanded);
      selected = '';
    }, [expanded]);

    const onNodeSelect = (event: any, nodeId: string) => {
      const nodeElement: Element = event.target.closest('.MuiTreeItem-root');
      const nodeState = nodeElement.getAttribute('state');

      if (nodeState === NodeState.Deleted) {
        selected = '';
      } else {
        selected = nodeId;
      }

      setOperation('');
    };

    const onNodeToggle = (event: any, nodeIds: string[]) => {
      setExpandedNodes(nodeIds);
    };

    const onLabelClick = useCallback((event: any) => {
      event.preventDefault();
    }, []);

    const onEditNodeHandler = useCallback(() => {
      setOperation('edit');
    }, []);

    const onAddNodeHandler = useCallback(() => {
      setOperation('add');
    }, []);

    const onDeleteNodeHandler = useCallback(() => {
      setOperation('delete');
    }, []);

    const onCloseEdit = useCallback(() => {
      setOperation('');
    }, []);

    const changeNodeHandler = useCallback((id: string, value: string) => {
      dispatch(editNode(id, value));
      setOperation('');
    }, [dispatch]);

    const addNodeHandler = useCallback((parentId: string, value: string) => {
      dispatch(addNode(parentId, value));
      setOperation('');
    }, [dispatch]);

    const deleteNodeHandler = useCallback((id: string) => {
      dispatch(deleteNode(id));
      setOperation('');
    }, [dispatch]);
      
    const renderTree = (node: RenderTree) => (
      <StyledTreeItem state={node.state} key={node.id} nodeId={node.id} label={node.value} onLabelClick={onLabelClick}>
        {Array.isArray(node.children) && node.children.map((node) => renderTree(node))}
      </StyledTreeItem>
    );

    return (
      <div>
        <Container>
          <TreeViewContainer>
              {
                cacheTree && <TreeView
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    expanded={expandedNodes}
                    defaultExpandIcon={<ChevronRightIcon />}
                    onNodeSelect={onNodeSelect}
                    onNodeToggle={onNodeToggle}
                >
                  {cacheTree.map((node: RenderTree) => renderTree(node))}
                </TreeView>
              }
          </TreeViewContainer>
          <TreeViewToolbar>
            <ButtonGroup color="primary">
              <Button size="small" onClick={onEditNodeHandler}>edit</Button>
              <Button size="small" onClick={onAddNodeHandler}>add</Button>
              <Button size="small" onClick={onDeleteNodeHandler}>delete</Button>
            </ButtonGroup>
          </TreeViewToolbar>
        </Container>
        
        { operation === 'edit' && selected && <CacheNodeEditor nodeId={selected} onSave={changeNodeHandler} onClose={onCloseEdit} /> }
        { operation === 'add' && selected && <CacheNodeEditor parentId={selected} onSave={addNodeHandler} onClose={onCloseEdit} /> }
        { operation === 'delete' && selected && <CacheNodeDelete nodeId={selected} onDelete={deleteNodeHandler} onClose={onCloseEdit} /> }
      </div>
    );
};


export default CacheTreeView;
