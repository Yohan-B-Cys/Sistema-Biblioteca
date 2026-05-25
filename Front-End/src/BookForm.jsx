import api from "./services/api";
import { useState,useEffect } from "react";

function AddBook ({onAddedBook}){
    const[titulo, setTitulo] = useState('');
    const[autor, setAutor] = useState('');
    const[ano, setAno] = useState('');

    const handleSubmit = async (e) =>{

        e.preventDefault();

        try {
            const newBook = {
                titulo: titulo,
                autor: autor,
                ano: Number(ano)
            };

            await api.post('/', newBook);

            onAddedBook();

            alert('Livro cadastrado');

            setTitulo('');
            setAutor('');
            setAno('');
        } catch (error) {
            console.error('Erro ao salvar livro: ',error);
            alert('erro ao salvar');
        }
    }

    return (
        <div>
            <h2>Adicionar Novo Livro</h2>

            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Titulo do livro" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                <input type="text" placeholder="Autor" value={autor} onChange={(e) => setAutor(e.target.value)} required />
                <input type="number" placeholder="Ano de publicação" value={ano} onChange={(e) => setAno(e.target.value)} required />

                <button type="submit"> Cadastrar Livro</button>

            </form>
        </div>
    )
}

export default AddBook;