import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import DbTreeView from './DbTreeView';
import CacheTreeView from './CacheTreeView';
import Button from '@material-ui/core/Button';
import {applyChangesToDb, resetDatabase} from '../actions/database';
import {getCacheTree, getDatabaseTree, getCacheNodeIds} from '../selectors';

const Container = styled(Paper)`
    position: relative;
`;

const EditorContent = styled.div`
    display: flex;
    justify-content: space-between;    
    padding: 25px;
    align-items: center;
`;

const EditorFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 0 25px 25px 25px;

    & .MuiButtonBase-root {
        margin-left: 10px;
    }
`;

const DbEditor: React.FC = React.memo(() => {

    const dispatch = useDispatch();
    
    const dbTree = useSelector(getDatabaseTree);
    const cacheTree = useSelector(getCacheTree);
    const cacheExpanded = useSelector(getCacheNodeIds);

    const resetHandler = () => {
        dispatch(resetDatabase());
    };

    const applyChanges = () => {
        dispatch(applyChangesToDb());
    };    

    return (
        <Container>
            <EditorContent>
                <CacheTreeView cacheTree={cacheTree} expanded={cacheExpanded} />
                <DbTreeView dbTree={dbTree} />
            </EditorContent>
            <EditorFooter>
                <Button onClick={resetHandler}>Reset</Button>
                <Button variant="contained" onClick={applyChanges}>Apply</Button>
            </EditorFooter>
        </Container>
    );
});


export default DbEditor;
