const API = import.meta.env.VITE_API_URL;

function App() {
  return (
    <main>
      <h1>Peliculas y series</h1>
      <p>Panel de administracion. Ingenieria Web II, IU Digital de Antioquia.</p>
      <p>API configurada en {API}</p>
    </main>
  );
}

export default App;
