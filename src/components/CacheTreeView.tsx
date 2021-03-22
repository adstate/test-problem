import React from 'react';
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

const CacheTreeView: React.FC<Props> = ({cacheTree}) => {
  const dispatch = useDispatch();

    const [expanded, setExpanded] = React.useState<string[]>([]);
    const [operation, setOperation] = React.useState<string>('');

    const [selected, setSelected] = React.useState<string>('');

    const onNodeSelect = (event: any, nodeId: string) => {
      const nodeElement: Element = event.target.parentElement.parentElement;
      const nodeState = nodeElement.getAttribute('state');

      if (nodeState === NodeState.Deleted) {
        setSelected('');
      } else {
        setSelected(nodeId);
      }

      setOperation('');
    };

    const onLabelClick = (event: any) => {
      event.preventDefault();
    };

    const onEditNodeHandler = () => {
      setOperation('edit');
    };

    const onAddNodeHandler = () => {
      setOperation('add');
    };

    const onDeleteNodeHandler = () => {
      setOperation('delete');
    };

    const onCloseEdit = () => {
      setOperation('');
    };

    const changeNodeHandler = (id: string, value: string) => {
      dispatch(editNode(id, value));
      setOperation('');
    };

    const addNodeHandler = (parentId: string, value: string) => {
      dispatch(addNode(parentId, value));
      setOperation('');
    };

    const deleteNodeHandler = (id: string) => {
      dispatch(deleteNode(id));
      setOperation('');
    };

    const renderTree = (nodes: RenderTree) => (
        <StyledTreeItem
          key={nodes.id}
          nodeId={nodes.id}
          label={nodes.value}
          state={nodes.state}
          onLabelClick={onLabelClick}
        >
          {Array.isArray(nodes.children) && nodes.children.map((node) => renderTree(node))}
        </StyledTreeItem>
      );

    return (
      <div>
        <Container>
          <TreeViewContainer>
              {
                cacheTree && <TreeView
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpanded={['3']}
                    defaultExpandIcon={<ChevronRightIcon />}
                    selected={selected}
                    onNodeSelect={onNodeSelect}
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
        
        { operation === 'edit' && selected && <CacheNodeEditor nodeId={selected} onSave={changeNodeHandler} onClose={onCloseEdit} />}
        { operation === 'add' && selected && <CacheNodeEditor parentId={selected} onSave={addNodeHandler} onClose={onCloseEdit} />}
        { operation === 'delete' && selected && <CacheNodeDelete nodeId={selected} onDelete={deleteNodeHandler} onClose={onCloseEdit} /> }
      </div>
    );
};


export default CacheTreeView;
