import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import NewOrder from './components/NewOrder';
import InventoryList from './components/InventoryList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Our Application</h1>
      </header>
      <main className="App-main">
        <section className="form-section">
          <Register />
        </section>
        <section className="form-section">
          <Login />
        </section>
        <section className="form-section">
          <NewOrder />
        </section>
        <InventoryList/>
      </main>
    </div>
  );
}

export default App;