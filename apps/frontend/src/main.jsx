import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './estilos/variables.css';
import './estilos/base.css';
import './estilos/componentes.css';
import App from './App.jsx';
import { apiConfigurada } from './api/cliente';
import ApiSinConfigurar from './componentes/ApiSinConfigurar';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {apiConfigurada ? <App /> : <ApiSinConfigurar />}
  </StrictMode>
);
