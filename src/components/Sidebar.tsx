import React from 'react';
import styled from 'styled-components';

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

const Sidebar: React.FC = ({children}) => {
    return (
        <Container>
            <Content>
                {children}
            </Content>
        </Container>
    );
};

export default Sidebar;
