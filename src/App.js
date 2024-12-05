import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Alterado para 'Routes'

import CadastroMonitoria from './cadastroDeMonitorias';
import ListaMonitorias from './listaDeMonitorias';
import Sobre from './sobre';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes> {/* Substituído 'Switch' por 'Routes' */}
          <Route path="/" element={<CadastroMonitoria />} /> {/* Substituído 'component' por 'element' */}
          <Route path="/lista" element={<ListaMonitorias />} /> {/* Substituído 'component' por 'element' */}
          <Route path="/sobre" element={<Sobre />} /> {/* Substituído 'component' por 'element' */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
