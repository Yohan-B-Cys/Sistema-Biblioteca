import { useState, useEffect } from 'react'; // 1. Importei o useEffect aqui
import './styles.css';
/* import BookTable from '../../components/BookList';
import AddBook from '../../components/BookForm'; */
import MainRoutes from '../../routes';
import { Toaster} from 'react-hot-toast'


function App() {
  

  return (
   <div>
    {/* <nav>
      <Link to = "/books"> Ver Livros</Link>
      <Link to = "/books/new"> Novo livro</Link>
    </nav>
    */}
   {/*  <BookTable trigger = {updater} setEditBook={setEditBook} setShowForm = {setShowForm} />
   
    <button onClick={() => setShowForm(!showForm)}>
      {showForm ? 'fechar Formulario' : '+ Adicionar Livro'} 
    </button>
    {showForm && (
      <AddBook editBook = {editBook}  onAddedBook ={() =>{ setUpdater (updater + 1); setEditBook(null); setShowForm(false); } }  
      onCancel = { () => {
        setEditBook(null);
        setShowForm(false);
      }} />
    )} */}

    <MainRoutes />

    

   </div>
  )
}

export default App;