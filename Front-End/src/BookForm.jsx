import api from "./services/api";
import { useState,useEffect } from "react";

function AddBook ({onAddedBook, editBook}){
    const[titulo, setTitulo] = useState('');
    const[autor, setAutor] = useState('');
    const[ano, setAno] = useState('');

    useEffect(() => {
        if (editBook) {
            setTitulo(editBook.titulo);
            setAutor(editBook.autor);
            setAno(editBook.ano);
        } else {
            setTitulo('');
            setAutor('');
            setAno('');
        }
    }, [editBook]

    );

    const handleSubmit = async (e) =>{

        e.preventDefault();
        const bookData = { titulo , autor , ano: Number(ano)}
        try {
            if (editBook) {
                await api.put(`/${editBook.id}`, bookData);
                alert(`livro atualizado`)
            } else {

            const newBook = {
                titulo: titulo,
                autor: autor,
                ano: Number(ano)
            };

            await api.post('/', newBook);

            alert('Livro cadastrado');
            }
            onAddedBook();
            
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
            <h2> {editBook ? 'Editar Livro' : 'Adicionar Novo Livro'} </h2> 

            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Titulo do livro" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                <input type="text" placeholder="Autor" value={autor} onChange={(e) => setAutor(e.target.value)} required />
                <input type="number" placeholder="Ano de publicação" value={ano} onChange={(e) => setAno(e.target.value)} required />

                <button type="submit"> { editBook ? 'Salvar alterações' : 'Cadastrar livro'}</button>

            </form>
        </div>
    )
}

export default AddBook;