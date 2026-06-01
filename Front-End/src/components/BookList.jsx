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
import { FaClock } from "react-icons/fa";
import { CiClock2 } from "react-icons/ci";


function BookTable(){
   const[ books , setBooks] = useState([]);
   const[search ,setSearch] = useState("");
   const [loading, setLoading] = useState(true);
   const [currentPage, setCurrentPage] = useState(1);
   const booksPerPage = 2 ;
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
  toast(
    (t) => (
      <div className="flex flex-col gap-4">
        <p className="text-text">
          Tem certeza que deseja excluir o livro?<br />
          Essa ação não pode ser desfeita.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-text opacity-70 hover:opacity-100 transition-opacity cursor-pointer px-3 py-1.5"
          >
            cancelar
          </button>
          
          <button
            onClick={async () => {
              toast.dismiss(t.id); // Fecha o toast primeiro
              try {
                // A SUA LÓGICA ORIGINAL AQUI: batendo direto na raiz com o ID
                await api.delete(`/${id}`);
                
                findBooks();
                toast.success("Excluído com sucesso!", {
                  className: '!bg-background !text-text border border-gray-200 dark:border-gray-700'
                });
              } catch (error) {
                toast.error("Falha ao deletar", {
                  className: '!bg-background !text-text border border-gray-200 dark:border-gray-700'
                });
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1.5 rounded-md transition-colors cursor-pointer shadow-lg"
          >
            confirmar
          </button>
        </div>
      </div>
    ),
    {
      className: '!bg-background !text-text border border-gray-200 dark:border-gray-700',
      duration: Infinity, 
    }
  );
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
  <div className="min-h-screen bg-background text-text p-8 flex flex-col items-center">
    
    {/* 1. CABEÇALHO (Dark Mode isolado à esquerda, Título centralizado) */}
    <div className="w-full max-w-5xl flex justify-center items-center relative mb-8">
      <div className="absolute right-0">
        <ModoEscuro />
      </div>
      
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <IoLibrary size={32} />
        Sistema Biblioteca
      </h1>
    </div>

    {/* 2. BARRA DE PESQUISA E BOTÃO ADICIONAR MENOR */}
    <div className="w-full max-w-5xl flex gap-3 mb-6">
      <input
  type="text"
  placeholder="Pesquisar Livros..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="flex-1 p-3 rounded-lg border-2 border-gray-400 dark:border-gray-500 dark:bg-white/5 text-text focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
/>
      <button
        onClick={() => navigate('/books/new')}
        // Botão menor: py-2 px-3, texto menor (text-sm) e whitespace-nowrap para não quebrar a linha
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-md transition-colors cursor-pointer font-medium text-sm whitespace-nowrap shadow-sm"
      >
        <BiBookAdd size={18} />
        Adicionar Livro
      </button>
    </div>

    {/* 3. TABELA COM LARGURA FIXA */}
    <div className="w-full max-w-5xl bg-surface border border-borda rounded-lg shadow-md overflow-hidden mb-6">
      {/* A classe 'table-fixed' é a mágica que trava as colunas */}
      <table className="w-full table-fixed text-left">
        <thead className="bg-black/5 dark:bg-white/5 border-b border-borda">
          <tr>
            {/* Definimos larguras percentuais para cada coluna para travar o tamanho */}
            <th className="p-4 w-1/4 font-semibold">ID</th>
            <th className="p-4 w-1/3 font-semibold">TÍTULO</th>
            <th className="p-4 w-1/4 font-semibold">AUTOR</th>
            <th className="p-4 w-24 text-center font-semibold">ANO</th>
            <th className="p-4 w-32 text-center font-semibold">AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.map((livro) => (
            <tr key={livro.id} className="border-b border-borda last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              
              {/* O truncate corta textos gigantes com "..." para não estourar a coluna */}
              <td className="p-4 flex items-center gap-2">
                <span className="truncate">{livro.id}</span>
                <CopyButton textToCopy={livro.id} />
              </td>
              
              <td className="p-4 truncate" title={livro.titulo}>{livro.titulo}</td>
              <td className="p-4 truncate" title={livro.autor}>{livro.autor}</td>
              <td className="p-4 text-center">{livro.ano}</td>
              
              <td className="p-4 text-center flex justify-center gap-2">
                {/* Botões de Ação */}
                <button 
                onClick={() => navigate(`/books/${livro.id}/edit`)}
                  className="p-2 text-text hover:bg-black/10 dark:hover:bg-white/10 rounded-md cursor-pointer transition-colors"
                  title="Editar"
                >
                  <TfiWrite size={18} />
                </button>
                <button 
                onClick={() => navigate(`/books/${livro.id}/edit`)}
                  className="p-2 text-text hover:bg-black/10 dark:hover:bg-white/10 rounded-md cursor-pointer transition-colors"
                  title=" Ultimas alterações"
                >
                 <CiClock2 size={18} />
                </button>
                <button 
                  onClick={() => deleteBook(livro.id)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-md cursor-pointer transition-colors"
                  title="Excluir"
                >
                  <TbXboxX size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* 4. PAGINAÇÃO */}
    <div className="flex gap-2 justify-center items-center">
      <button 
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-md border border-text text-text disabled:opacity-50 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
      >
        Anterior
      </button>
      
      {Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;
        return (
          <button
            key={pageNumber}
            onClick={() => setCurrentPage(pageNumber)}
            className={`w-10 h-10 rounded-md border border-text flex items-center justify-center cursor-pointer transition-colors ${
              currentPage === pageNumber 
                ? 'bg-text text-background' // Página atual inverte as cores
                : 'text-text hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      <button 
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-md border border-text text-text disabled:opacity-50 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
      >
        Próxima
      </button>
    </div>
  </div>
); }

export default BookTable;

