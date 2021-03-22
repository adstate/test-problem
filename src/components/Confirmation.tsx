import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Sidebar from './Sidebar';

interface Props {
    show: boolean;
    message: string;
    onClose: (confirm: boolean) => void;
}

const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 10px 0;
    margin-top: 25px;

    & .MuiButtonBase-root {
        margin-right: 8px;
    }
`;

const Confirmation: React.FC<Props> = ({show, message, onClose}) => {
    
    const cancelHandler = () => {
        onClose(false);
    };

    const okHandler = () => {
        onClose(true);
    };

    return (
        <>
            {show && <Sidebar>
                <div>{message}</div>
                <Footer>
                    <Button onClick={cancelHandler}>Cancel</Button>
                    <Button variant="contained" onClick={okHandler}>OK</Button>
                </Footer>
            </Sidebar>}
        </>
    );
};

export default Confirmation;