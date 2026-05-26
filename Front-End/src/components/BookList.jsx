import { useState,useEffect } from "react";
import { useNavigate} from 'react-router-dom';
import api from "../services/api"; 
//import global from "../styles/global" ;
import ModoEscuro from "./DarkMode";

function BookTable({}){
   const[ book , setBook] = useState([]);
   const navigate = useNavigate();

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
    // Coloquei um flex-col e items-center para centralizar o conteúdo na tela
    <div className="min-h-screen bg-background text-text transition-colors duration-300 p-8 flex flex-col items-center">
      
      {/* 1. CABEÇALHO ALINHADO: Título de um lado, Modo Escuro do outro */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">📚 Sistema Biblioteca</h1>
        <ModoEscuro />
      </div>

      {/* Limitei a largura máxima para a tabela não esticar infinitamente em monitores grandes */}
      <div className="w-full max-w-5xl">
        
        {book.length === 0 ? (
          <p className="text-lg opacity-70 animate-pulse">Buscando Livros...</p>
        ) : (
          
          /* 2. CAIXA DA TABELA: Fundo arredondado, sombra e scroll horizontal para celular */
          <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-500/20 bg-gray-500/5">
            <table className="w-full text-left border-collapse">
              
              <thead>
                {/* 3. CABEÇALHO DA TABELA: Fundo sutil e letras maiúsculas para destacar */}
                <tr className="bg-gray-500/10 border-b border-gray-500/20 text-xs uppercase tracking-wider opacity-80">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Título</th>
                  <th className="p-4 font-semibold">Autor</th>
                  <th className="p-4 font-semibold">Ano</th>
                  <th className="p-4 font-semibold text-center">Ações</th>
                </tr>
              </thead>

              <tbody>
                {book.map((livro) => (
                  /* 4. LINHAS: Efeito Hover (passar o mouse) usando cores transparentes que funcionam no claro e no escuro! */
                  <tr key={livro.id} className="border-b border-gray-500/10 hover:bg-gray-500/10 transition-colors">
                    
                    {/* DICA DE OURO: Cortei o ID gigante pra não quebrar sua tabela */}
                    <td className="p-4 text-sm font-mono opacity-60" title={livro.id}>
                      {livro.id.substring(0, 8)}...
                    </td>
                    
                    <td className="p-4 text-sm font-medium">{livro.titulo}</td>
                    <td className="p-4 text-sm">{livro.autor}</td>
                    <td className="p-4 text-sm">{livro.ano}</td>
                    
                    {/* 5. BOTÕES: Alinhados, com cores de aviso e cantos arredondados */}
                    <td className="p-4 text-sm flex justify-center gap-3">
                      <button 
                        onClick={() => navigate(`/books/${livro.id}/edit`)}
                        className="bg-destaque hover:opacity-80 text-white px-4 py-2 rounded-lg font-medium transition-opacity"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => deleteBook(livro.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
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
        
        {/* BOTÃO PRINCIPAL: Adicionar Livro grandão e chamativo no canto inferior */}
        <div className="mt-8 flex justify-end">
          <button 
            onClick={() => navigate('/books/new')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-transform hover:scale-105"
          >
            + Adicionar Novo Livro
          </button>
        </div>

      </div>
    </div>
  );
  
}

export default BookTable;

