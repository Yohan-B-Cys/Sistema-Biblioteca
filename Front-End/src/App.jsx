import { useState, useEffect } from 'react'; // 1. Importei o useEffect aqui
import './App.css';
import BookTable from './BookList';
import AddBook from './BookForm';



function App() {
  
  const [showForm, setShowForm] = useState(false);
  const [updater, setUpdater] = useState(0);
  const [editBook , setEditBook] = useState (null);

  return (
   <div>

    

    <h1>Sistema Biblioteca</h1>
    <BookTable trigger = {updater} setEditBook={setEditBook} setShowForm = {setShowForm} />
   
    <button onClick={() => setShowForm(!showForm)}>
      {showForm ? 'fechar Formulario' : '+ Adicionar Livro'} 
    </button>
    {showForm && (
      <AddBook editBook = {editBook} onAddedBook ={() => setUpdater (updater + 1)} />
    )}

   </div>
  )
}

export default App;