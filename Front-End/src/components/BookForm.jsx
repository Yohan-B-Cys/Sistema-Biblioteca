import api from "../services/api";
import { useState,useEffect } from "react";
import { useParams, useNavigate }  from 'react-router-dom';
import toast from 'react-hot-toast'
import { BiBookAdd } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
function AddBook ({}){
    const {id} = useParams();
    const navigate = useNavigate();

    const[titulo, setTitulo] = useState('');
    const[autor, setAutor] = useState('');
    const[ano, setAno] = useState('');

    useEffect(() => {
        if (id) {
            const seachBookId = async() => {
                try {
                    const result = await api.get(`/${id}`);
                      setTitulo(result.data.titulo);
                      setAutor(result.data.autor);
                      setAno(result.data.ano);
                } catch (error) {
                   toast.error('Deu ruim !')
                }
            };
            seachBookId();

        } else {
            setTitulo('');
            setAutor('');
            setAno('');
        }
    }, [id]

    );

    const handleSubmit = async (e) =>{

        e.preventDefault();
 
       const tituloLimpo = titulo.trim();
    const autorLimpo = autor.trim();
    const anoNumerico = Number(ano);

  
    if (!tituloLimpo || !autorLimpo) {
        toast.error("O título e o autor não podem estar vazios!");
        return; 
    }

   
    if (tituloLimpo.length < 2) {
        toast.error("O título deve ter pelo menos 2 caracteres.");
        return;
    }

    if (autorLimpo.length < 3) {
        toast.error("O nome do autor deve ter pelo menos 3 caracteres.");
        return;
    }

    const anoAtual = new Date().getFullYear();
    if (anoNumerico <= 0 || anoNumerico > anoAtual) {
        toast.error(`Ano inválido! Digite um ano entre 1 e ${anoAtual}.`);
        return;
    }

    const bookData = { 
        titulo: tituloLimpo, 
        autor: autorLimpo, 
        ano: anoNumerico 
    };
        try {
            if (id) {
                await api.put(`/${id}`, bookData);
                toast.success('livro Editado');
            } else {
                 await api.post('/', bookData);     
                toast.success('livro cadastrado');
            }
            navigate ('/books');
            
           /*  onAddedBook();
            
            setTitulo('');
            setAutor('');
            setAno(''); */
        } catch (error) {
            console.error('Erro ao salvar livro: ',error);
            alert('erro ao salvar');
        }
    }

  return (
    
    <div className="min-h-screen bg-background text-text transition-colors duration-300 flex items-center justify-center p-4">
      
      
      <div className="w-full max-w-md bg-gray-500/5 border border-gray-500/20 p-8 rounded-2xl shadow-xl">
        
        <h2 className="text-2xl font-bold mb-6 text-center tracking-tight"> 
          {/* {id ?  '<FaEdit />' : '<BiBookAdd />' } ; */}
          {id ? ' Editar Livro' : ' Adicionar Novo Livro'} 
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          <div>
            <label className="block text-sm font-medium mb-1 opacity-80">Título do Livro</label>
            <input 
              type="text" 
              placeholder="Ex: O Senhor dos Anéis" 
              value={titulo} 
              onChange={(e) => setTitulo(e.target.value)} 
              required 
             
              className="w-full p-3 rounded-lg bg-background border border-gray-500/30 focus:border-destaque focus:ring-2 focus:ring-destaque/50 outline-none transition-all placeholder-gray-500/50"
            />
          </div>

         
          <div>
            <label className="block text-sm font-medium mb-1 opacity-80">Autor</label>
            <input 
              type="text" 
              placeholder="Ex: J.R.R. Tolkien" 
              value={autor} 
              onChange={(e) => setAutor(e.target.value)} 
              required 
              className="w-full p-3 rounded-lg bg-background border border-gray-500/30 focus:border-destaque focus:ring-2 focus:ring-destaque/50 outline-none transition-all placeholder-gray-500/50"
            />
          </div>

         
          <div>
            <label className="block text-sm font-medium mb-1 opacity-80">Ano de Publicação</label>
            <input 
              type="number" 
              placeholder="Ex: 1954" 
              value={ano} 
              onChange={(e) => setAno(e.target.value)} 
              required 
              className="w-full p-3 rounded-lg bg-background border border-gray-500/30 focus:border-destaque focus:ring-2 focus:ring-destaque/50 outline-none transition-all placeholder-gray-500/50"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-500/20">
          
            <button 
              type="button" 
              onClick={() => navigate('/books')}
              className="px-5 py-2.5 rounded-lg font-medium hover:bg-gray-500/10 transition-colors cursor-pointer"
            > 
              Cancelar
            </button>
            
            <button 
              type="submit"
              className="px-5 py-2.5 rounded-lg font-medium bg-destaque dark:bg-white dark:text-black text-white hover:opacity-90 transition-opacity shadow-lg shadow-destaque/30 cursor-pointer"
            > 
              { id ?  '  Salvar Alterações' : '  Cadastrar Livro'}
            </button>

          </div>

        </form>
      </div>
    </div>
  )
}

export default AddBook;