import { useState, useEffect } from 'react'; // 1. Importei o useEffect aqui
import './App.css';
import BookTable from './BookList';
import AddBook from './BookForm';



function App() {
  
  const [mostrarForm, setMostrarForm] = useState(false);
  const [updater, setUpdater] = useState(0);

  return (
   <div>

     <button onClick={() => setMostrarForm(!mostrarForm)}>
      {mostrarForm ? 'fechar Formulario' : '+ Adicionar Livro'} 
    </button>
    {mostrarForm && (
      <AddBook onAddedBook ={() => setUpdater (updater + 1)} />
    )}

    <h1>Sistema Biblioteca</h1>
    <BookTable trigger = {updater} />
   

   </div>
  )
}

export default App;