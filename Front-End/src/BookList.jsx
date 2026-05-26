import { useState,useEffect } from "react";
import api from "./services/api"; 

function BookTable({trigger , setEditBook, setShowForm}){
   const[ book , setBook] = useState([]);

useEffect(() => {
    findBooks();
  }, [trigger]);

  const findBooks  = async () => {
    try{
        const result = await api.get('/');
        setBook(result.data);
    }catch (erro){
        console.error("Erro ao buscar livro: ",erro)
    }
  }

  const deleteBook = async (id) => {
    try {
        const confirm = window.confirm(`Tem certeza que deseja excluir o livro essa ação não pode ser desfeita?`);

        if (!confirm) {
            return;
        }

        await api.delete(`/${id}`) ;
        findBooks();
    } catch (error) {
        console.error("Erro ao deletar:", erro);
    }
  }

  return (
    <>
    {book.length === 0 ? (
        <p>Buscando Livros...</p>
    ): (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Titulo</th>
                    <th>Autor</th>
                    <th>Ano</th>
                </tr>
            </thead>

            <tbody>
                {book.map((livro) => (
                    <tr key ={livro.id}>
                        <td>{livro.id}</td>
                        <td>{livro.titulo}</td>
                        <td>{livro.autor}</td>
                        <td>{livro.ano}</td>
                       <td><button onClick={() => deleteBook(livro.id)}> 
                        Excluir
                       </button>
                       <button onClick={() => {setEditBook(livro); setShowForm(true); } }  >
                        Editar
                       </button>
                       </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )}
    </>
  );
}

export default BookTable;

