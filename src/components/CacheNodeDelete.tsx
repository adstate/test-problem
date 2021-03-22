import React from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Sidebar from './Sidebar';
import { RootState } from '../reducers';

interface Props {
    nodeId: string;
    onDelete: (nodeId: string) => void;
    onClose: () => void;
}

const Header = styled.h4`
    margin-top: 5px;
    margin-bottom: 25px;
`;

const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 10px 0;
    margin-top: 25px;

    & .MuiButtonBase-root {
        margin-right: 8px;
    }
`;

const CacheNodeDelete: React.FC<Props> = ({nodeId, onDelete, onClose}) => {
    const node = useSelector((s: RootState) => s.cache.table[nodeId]);

    const okHandler = () => {
        onDelete(node.id);
    };

    return (
        <Sidebar>
            <Header>Delete {node.value}</Header>
            <div>
                Node will be mark as deleted. Are you sure?
            </div>
            <Footer>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={okHandler}>OK</Button>
            </Footer>
        </Sidebar>
    );
};

export default CacheNodeDelete;
