import LoginView from './views/LoginView';

function App() {
  return (
    // Quitamos los márgenes y paddings de aquí para que la View 
    // tome el control total de la pantalla
    <>
      <h1 className="bg-yellow-200 text-black p-2 text-center">¡Si ves esto, App.jsx funciona!</h1>
      <LoginView />
    </>
  );
}

export default App;