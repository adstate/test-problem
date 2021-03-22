import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import DbTreeView from './DbTreeView';
import CacheTreeView from './CacheTreeView';
import Button from '@material-ui/core/Button';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { RootState } from '../reducers';
import dbToTree from '../utils/dbToTree';
import {moveNode, editNode} from '../actions/cache';
import {applyChangesToDb, resetDatabase} from '../actions/database';
import {getNodeForEdit} from '../actions/database';

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

    
    const dbTree = useSelector((state: RootState) => {
      console.log('convert db tree', state.database.table);
      return dbToTree(state.database.table)[0];
    });

    const cacheTree = useSelector((state: RootState) => {      
        console.log('convert cache tree', state.cache.table);
        return dbToTree(state.cache.table);
    });

    const resetHandler = () => {
        dispatch(resetDatabase());
    };

    const applyChanges = () => {
        dispatch(applyChangesToDb());
    };

    return (
        <Container>
            <EditorContent>
                <CacheTreeView cacheTree={cacheTree} />
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
