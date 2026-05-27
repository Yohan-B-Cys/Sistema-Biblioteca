import { useState,useEffect } from "react";
import { useNavigate} from 'react-router-dom';
import api from "../services/api"; 
//import global from "../styles/global" ;
import ModoEscuro from "./DarkMode";
import toast from "react-hot-toast";
import { FaCopy } from "react-icons/fa";
import CopyButton from "./CopyButton"
import { IoLibrary } from "react-icons/io5";


function BookTable({}){
   const[ book , setBook] = useState([]);
   const navigate = useNavigate();
   const [search ,setSearch] = useState("");
useEffect(() => {
    findBooks();
  }, []);

  const findBooks  = async () => {
    try{
        const result = await api.get('/');
        setBook(result.data);
    }catch (erro){
        console.error("Erro ao buscar livro: ",erro)
    }
  }

  const deleteBook = async (id) => {

  toast((t) => (
    
    <span  className="flex flex-col gap-4 p-4 min-w-75">
      Tem certeza que deseja excluir o livro? Essa ação não pode ser desfeita.

      <div className="flex flex-row justify-start items-start gap-3">
     

      <button 
       className=" px-5 py-2.5 rounded-lg font-medium hover:bg-gray-500/10 transition-colors"
      onClick={() => {
        toast.dismiss(t.id);
      }}>
        cancelar
      </button>

       <button
       className="px-5 py-2.5 rounded-lg font-medium bg-destaque text-white hover:opacity-90 transition-opacity shadow-lg shadow-destaque/30"

        onClick={async () => {
          toast.dismiss(t.id); // Fecha o toast primeiro
          try {
            await api.delete(`/${id}`);
            findBooks();
            toast.success("Excluído com sucesso!");
          } catch (error) {
            toast.error("Falha ao deletar");
          }
        }} 
      >
        confirmar
      </button>
      </div>
    </span>
    
  ));
};

/* const copyText = async (copiedText) => { 
     await navigator.clipboard.writeText(copiedText)  ; 
} */

const filterBook = book.filter((livro) =>{
  const searchText = search.toLowerCase();
    return(
     String(livro.id).toLowerCase().includes(searchText) ||
      livro.titulo.toLowerCase().includes(searchText)||
      livro.autor.toLowerCase().includes(searchText)||
     String(livro.ano).includes(searchText)
    );
} );


 return (
    
    <div className="min-h-screen bg-background text-text transition-colors duration-300 p-8 flex flex-col items-center">
      
    
     <div className="w-full flex justify-between items-center">
    
    <h1 className="text-4xl font-bold tracking-tight">Sistema Biblioteca</h1>
    <ModoEscuro />
  </div>

 
  <div className="w-full mb-8">
    <form className="w-full" onSubmit={(e) => e.preventDefault()}>
      <input 
        type="text" 
        placeholder="Pesquisar Livros..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded-lg bg-gray-500/10 border border-gray-500/30 focus:border-destaque outline-none transition-all"
      />
    </form>
  </div>
    
      <div className="w-full max-w-5xl">
        
        {book.length === 0 ? (
          <p className="text-lg opacity-70 animate-pulse">Buscando Livros...</p>
        ) : (
          
          <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-500/20 bg-gray-500/5">
            <table className="w-full text-left border-collapse">
              
              <thead>
              
                <tr className="bg-gray-500/10 border-b border-gray-500/20 text-xs uppercase tracking-wider opacity-80">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Título</th>
                  <th className="p-4 font-semibold">Autor</th>
                  <th className="p-4 font-semibold">Ano</th>
                  <th className="p-4 font-semibold text-center">Ações</th>
                </tr>
              </thead>

              <tbody>
                {filterBook.map((livro) => (
                 
                  <tr key={livro.id} className="border-b border-gray-500/10 hover:bg-gray-500/10 transition-colors">
                    
                  
                    <td className="p-4 text-sm font-mono opacity-60" title={livro.id}>
                      <div className="flex items-center justify-between gap-3">
                        <span>{livro.id.substring(0, 8)}...</span>
                          <CopyButton textToCopy={livro.id} />
                     </div>
                    </td>
                    
                    <td className="p-4 text-sm font-medium">
                      <div className="flex items-center justify-between gap-3">
                        <span>{livro.titulo}</span>
                          <CopyButton textToCopy={livro.titulo} />
                     </div>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span>{livro.autor}</span>
                          <CopyButton textToCopy={livro.autor} />
                     </div>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span>{livro.ano}</span>
                          <CopyButton textToCopy={livro.ano} />
                     </div>
                    </td>
                  
                    <td className="p-4 text-sm flex justify-center gap-3">
                      <button 
                        onClick={() => navigate(`/books/${livro.id}/edit`)}
                        className="bg-destaque hover:opacity-80 text-white px-4 py-2 rounded-lg font-medium transition-opacity cursor-pointer"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => deleteBook(livro.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
     
        <div className="mt-8 flex justify-end">
          <button 
            onClick={() => navigate('/books/new')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            + Adicionar Novo Livro
          </button>
        </div>

      </div>
    </div>
  );
  
}

export default BookTable;

