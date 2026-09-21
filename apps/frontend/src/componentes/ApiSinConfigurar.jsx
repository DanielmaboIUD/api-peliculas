// Reemplaza al panel cuando se compilo sin VITE_API_URL.
function ApiSinConfigurar() {
  return (
    <main className="sin-configurar">
      <div className="estado-error" role="alert">
        <h2>Falta configurar VITE_API_URL</h2>
        <p>
          El panel se compilo sin la URL de la API, asi que no puede pedir datos. Defina
          VITE_API_URL con la URL base de la API y vuelva a compilar. En Vercel se carga en
          Settings &gt; Environment Variables y despues se hace Redeploy.
        </p>
      </div>
    </main>
  );
}

export default ApiSinConfigurar;
