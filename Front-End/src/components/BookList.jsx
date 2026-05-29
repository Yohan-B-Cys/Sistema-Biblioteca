import { useState,useEffect } from "react";
import { useNavigate} from 'react-router-dom';
import api from "../services/api"; 
//import global from "../styles/global" ;
import ModoEscuro from "./DarkMode";
import toast from "react-hot-toast";
import { FaCopy } from "react-icons/fa";
import CopyButton from "./CopyButton"
import { IoLibrary } from "react-icons/io5";
import { TbXboxX } from "react-icons/tb";
import { TfiWrite } from "react-icons/tfi";
import { BiBookAdd } from "react-icons/bi";


function BookTable(){
   const[ books , setBooks] = useState([]);
   const[search ,setSearch] = useState("");
   const [loading, setLoading] = useState(true);
   const [currentPage, setCurrentPage] = useState(1);
   const booksPerPage = 4 ;
   const navigate = useNavigate();
 
useEffect(() => {
    findBooks();
  }, []);

  const findBooks  = async () => {
    setLoading(true);

    try{
        const result = await api.get('/');
        setBooks(result.data);
    }catch (erro){
        toast.error("Erro ao buscar livro: ")
        console.error("Erro ao buscar livro: ");
    }finally {
      setLoading(false);
    }
  }

  const deleteBook = async (id) => {

  toast((t) => (
    
    <span  className="flex flex-col gap-4 p-4 min-w-75 text-black   dark:bg-black dark:text-white">
      Tem certeza que deseja excluir o livro? Essa ação não pode ser desfeita.

      <div className="flex flex-row justify-start items-start gap-3">
     

      <button 
       className=" px-5 py-2.5 rounded-lg font-medium  hover:bg-gray-500/10 transition-colors"
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

const filterBook = books.filter((livro) =>{
  const searchText = search.toLowerCase();
    return(
     String(livro.id).toLowerCase().includes(searchText) ||
      livro.titulo.toLowerCase().includes(searchText)||
      livro.autor.toLowerCase().includes(searchText)||
     String(livro.ano).includes(searchText)
    );
} );

const indexOfLastBook = currentPage * booksPerPage;
const indexOfFirstBook = indexOfLastBook - booksPerPage;

const currentBooks = filterBook.slice(indexOfFirstBook,indexOfLastBook);
const totalPages = Math.ceil(filterBook.length/booksPerPage);


 return (
    
    <div className="min-h-screen bg-background text-text transition-colors duration-300 p-8 flex flex-col items-center">
      
    
     <div className="w-full flex justify-between items-center">
    
    <h1 className="text-4xl font-bold tracking-tight">Sistema Biblioteca</h1>
  

      <div className="mt-4 flex justify-end">
          <button 
            onClick={() => navigate('/books/new')}
            className="bg-green-600  hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
           {/*  <BiBookAdd /> */} Adicionar Novo Livro
          </button>
        </div>
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
        
       
       {loading ? (
         <p className="text-lg opacity-70 animate-pulse">Buscando Livros...</p>
       ) : books.length === 0 ? (
         <p className="text-lg opacity-70">Nenhum livro cadastrado.</p>
       ) : filterBook.length === 0 ? (
         <p className="text-lg opacity-70">Nenhum livro encontrado para essa busca.</p>
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
                {currentBooks.map((livro) => (
                 
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
                        className="bg-black hover:opacity-80 text-white dark:bg-white dark:text-black px-3 py-2 rounded-full font-medium transition-opacity cursor-pointer  title='editar livro'"
                      >
                      <TfiWrite />  {/* editar */} 
                      </button>
                      <button 
                        onClick={() => deleteBook(livro.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-2 p-2 rounded-full font-medium transition-colors cursor-pointer"
                      >
                       <TbXboxX  size={20}/> {/* excluiur */}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="px-4 py-2 rounded-lg border disabled:opacity-50 cursor-pointer"
  >
    Anterior
  </button>

  {Array.from({ length: totalPages }, (_, index) => {
    const pageNumber = index + 1;

    return (
      <button
        key={pageNumber}
        onClick={() => setCurrentPage(pageNumber)}
        className={`px-4 py-2 rounded-lg border ${
          currentPage === pageNumber
            ? "bg-destaque text-white  dark:bg-white dark:text-black cursor-pointer"
            : "hover:bg-gray-500/10"
        }`}
      >
        {pageNumber}
      </button>
    );
  })}

  <button
    onClick={() =>
      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    }
    disabled={currentPage === totalPages}
    className="px-4 py-2 rounded-lg border disabled:opacity-50 cursor-pointer"
  >
    Próxima
  </button>
</div>
     
      

      </div>
    </div>
  );
  
}

export default BookTable;

