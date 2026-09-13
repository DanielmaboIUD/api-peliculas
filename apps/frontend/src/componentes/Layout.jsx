import { Link, NavLink, Outlet } from 'react-router-dom';
import '../estilos/layout.css';

const MODULOS = [
  { ruta: '/', texto: 'Resumen', exacta: true },
  { ruta: '/generos', texto: 'Generos' },
  { ruta: '/directores', texto: 'Directores' },
  { ruta: '/productoras', texto: 'Productoras' },
  { ruta: '/tipos', texto: 'Tipos' },
  { ruta: '/medias', texto: 'Producciones' },
];

function Layout() {
  return (
    <>
      <header className="cabecera">
        <Link to="/">Peliculas y series</Link>
        <span className="subtitulo">Panel de administracion</span>
      </header>

      <nav className="barra" aria-label="Modulos">
        <p className="titulo-grupo">Modulos</p>
        <ul>
          {MODULOS.map(({ ruta, texto, exacta }) => (
            <li key={ruta}>
              <NavLink
                to={ruta}
                end={exacta}
                className={({ isActive }) => (isActive ? 'activo' : undefined)}
              >
                {texto}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <main className="contenido">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
