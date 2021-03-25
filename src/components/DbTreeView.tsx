import React, {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import NodeState from '../models/nodeState';
import Button from '@material-ui/core/Button';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import {getNodeForEdit} from '../actions/database';

interface Props {
    dbTree?: any;
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
    align-items: center;
`;

const Toolbar = styled.div`
    padding: 40px;
`;

const TreeViewContainer = styled.div`
    width: 250px;
    height: 300px;
    border: 1px solid #c0c0c0;
    border-radius: 2px;
    padding: 10px;
    overflow-y: auto;
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
`;

let selected = '';

const DbTreeView: React.FC<Props> = ({dbTree}) => {

    const dispatch = useDispatch();

    const onNodeSelect = (event: any, nodeId: string) => {
      const nodeElement: Element = event.target.parentElement.parentElement;
      const nodeState = nodeElement.getAttribute('state');

      if (nodeState === NodeState.Deleted) {
        selected = '';
      } else {
        selected = nodeId;
      }
    };

    const onLabelClick = useCallback((event: any) => {
      event.preventDefault();
    }, []);

    const moveNodeHandler = useCallback(() => {
        if (selected) {
            dispatch(getNodeForEdit(selected));
        }
    }, [dispatch]);

    const renderTree = (node: RenderTree) => (
        <StyledTreeItem state={node.state} key={node.id} nodeId={node.id} label={node.value} onLabelClick={onLabelClick}>
          {Array.isArray(node.children) && node.children.map((node) => renderTree(node))}
        </StyledTreeItem>
    );

    return (
        <Container>
            <Toolbar>
                <Button variant="contained" onClick={moveNodeHandler}>
                    <ChevronLeftIcon />
                </Button>
            </Toolbar>
            <TreeViewContainer>
                {
                    dbTree && <TreeView
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpanded={['1', '2', '3', '4', '5']}
                        defaultExpandIcon={<ChevronRightIcon />}
                        onNodeSelect={onNodeSelect}
                    >
                        {renderTree(dbTree)}
                    </TreeView>
                }
            </TreeViewContainer>
        </Container>
    );
};

export default React.memo(DbTreeView);
