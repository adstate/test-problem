import React from 'react';
import './App.css';
import styled from 'styled-components';
import DbEditor from './components/DbEditor';

const AppContainer = styled.div`
  margin: 50px auto 0;
  min-width: 600px;
  max-width: 700px;
`;

function App() {
  return (
    <AppContainer>
      <DbEditor></DbEditor>
    </AppContainer>
  );
}

export default App;
