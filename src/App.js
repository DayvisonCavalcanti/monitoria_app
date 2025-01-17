import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Alterado para 'Routes'

// import ListaMonitorias from './listaDeMonitorias';
import CadastroMonitoria from './cadastroDeMonitorias';
import MonitoriaForm from './listaMonitorias';
import Login from './Login';
import Sobre from './sobre';
import CadastroUserForm from './cadastroUsuario';
import { AuthContextProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthContextProvider>
      <Router>
          <div className="App">
            <Routes> {/* Substituído 'Switch' por 'Routes' */}
              <Route path="/" element={<Login />} /> {/* Rota para o Login */}
              <Route path="/cadastro" element={<CadastroMonitoria />} /> {/* Substituído 'component' por 'element' */}
              <Route path='/user' element={<CadastroUserForm/>}/>
              {/* <Route path="/lista" element={<ListaMonitorias />} /> Substituído 'component' por 'element' */}
              <Route path="/lista" element={<MonitoriaForm />} /> {/* Substituído 'component' por 'element' */}
              <Route path="/sobre" element={<Sobre />} /> {/* Substituído 'component' por 'element' */}
            </Routes>
          </div>
        </Router>
    </AuthContextProvider>
  );
};

export default App;
