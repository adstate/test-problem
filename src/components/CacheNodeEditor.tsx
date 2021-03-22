import React from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { RootState } from '../reducers';
import { Divider } from '@material-ui/core';

interface Props {
    nodeId?: string;
    parentId?: string;
    onSave: (nodeId: string, value: string) => void;
    onClose: () => void;
}

const Container = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    justify-content: center;
    background-color: #fff;
    height: 100%;
    padding: 20px;
    width: 400px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    z-index: 2;
`;

const Content = styled.div`
    width: 300px;
`;

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

const CacheNodeEditor: React.FC<Props> = ({nodeId, parentId, onSave, onClose}) => {
    const node = useSelector((s: RootState) => nodeId ? s.cache.table[nodeId] : null);
    const parentNode = useSelector((s: RootState) => parentId ? s.cache.table[parentId] : null);

    const [newValue, setNewValue] = React.useState<string>('');
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewValue(event.target.value);
    };

    React.useEffect(() => {
        if (node) {
            setNewValue(node.value);
        }
    }, []);

    const saveHandler = () => {
        if (node) {
            onSave(node.id, newValue);
        } else if (parentId) {
            onSave(parentId, newValue);
        }
    };

    return (
        <Container>
            <Content>
                {(node) ? <Header>Edit {node.value}</Header> : <Header>Add child node for {parentNode && parentNode.value}</Header>}
                
                <form onSubmit={saveHandler}>
                    <div>
                        <Input fullWidth value={newValue} onChange={handleChange} />
                    </div>
                    <Footer>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={!newValue}>OK</Button>
                    </Footer>
                </form>
            </Content>
        </Container>
    );
};

export default CacheNodeEditor;