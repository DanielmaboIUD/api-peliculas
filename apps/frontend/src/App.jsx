import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './componentes/Layout';
import Directores from './paginas/Directores';
import Generos from './paginas/Generos';
import Medias from './paginas/Medias';
import NoEncontrada from './paginas/NoEncontrada';
import Productoras from './paginas/Productoras';
import Resumen from './paginas/Resumen';
import Tipos from './paginas/Tipos';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Resumen />} />
          <Route path="/generos" element={<Generos />} />
          <Route path="/directores" element={<Directores />} />
          <Route path="/productoras" element={<Productoras />} />
          <Route path="/tipos" element={<Tipos />} />
          <Route path="/medias" element={<Medias />} />
          <Route path="*" element={<NoEncontrada />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
