import React from 'react';
import styled from 'styled-components';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import NodeState from '../models/nodeState';

interface Props {
    onSelectNode: (nodeId: string) => void;
    dbTree?: any;
    selected: string;
}

interface RenderTree {
    id: string;
    parentId: string | null;
    value: string;
    state: NodeState;
    children?: RenderTree[];
}

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

const DbTreeView: React.FC<Props> = ({dbTree, onSelectNode, selected}) => {

    const onNodeSelect = (event: any, nodeId: string) => {
      const nodeElement: Element = event.target.parentElement.parentElement;
      const nodeState = nodeElement.getAttribute('state');

      if (nodeState === NodeState.Deleted) {
        onSelectNode('');
      } else {
        onSelectNode(nodeId);
      }
    };

    const onLabelClick = (event: any) => {
      event.preventDefault();
    };

    const onSelectHandler = (keys: any[]) => {
        onSelectNode(keys[0]);
    };

    const renderTree = (node: RenderTree) => (
        <StyledTreeItem state={node.state} key={node.id} nodeId={node.id} label={node.value} onLabelClick={onLabelClick}>
          {Array.isArray(node.children) && node.children.map((node) => renderTree(node))}
        </StyledTreeItem>
    );

    const renderCustomTree = (nodes: RenderTree) => (
        <div key={nodes.id}>
            <div>{nodes.value}</div>
            {Array.isArray(nodes.children) && nodes.children.map((node) => renderCustomTree(node))}
        </div>
    );

    return (
        <TreeViewContainer>
            {
                dbTree && <TreeView
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpanded={['1', '2', '3']}
                    defaultExpandIcon={<ChevronRightIcon />}
                    onNodeSelect={onNodeSelect}
                >
                    {renderTree(dbTree)}
                </TreeView>
            }
            {/* {
                dbTree && <div>
                    {renderCustomTree(dbTree)}
                </div>
            } */}
        </TreeViewContainer>
    );
};

export default DbTreeView;
