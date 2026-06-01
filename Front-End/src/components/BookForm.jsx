import api from "../services/api";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BiBookAdd } from "react-icons/bi";
import { TfiWrite } from "react-icons/tfi";

function AddBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [ano, setAno] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      setLoading(true);
      try {
        const result = await api.get(`/${id}`);
        setTitulo(result.data.titulo);
        setAutor(result.data.autor);
        setAno(result.data.ano);
      } catch (error) {
        toast.error("Erro ao carregar livro");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tituloLimpo = titulo.trim();
    const autorLimpo = autor.trim();
    const anoNumerico = Number(ano);

    if (!tituloLimpo || !autorLimpo) {
      toast.error("Título e autor são obrigatórios.");
      return;
    }

    if (tituloLimpo.length < 2) {
      toast.error("Título deve ter pelo menos 2 caracteres.");
      return;
    }

    if (autorLimpo.length < 3) {
      toast.error("Autor deve ter pelo menos 3 caracteres.");
      return;
    }

    const anoAtual = new Date().getFullYear();
    if (anoNumerico <= 0 || anoNumerico > anoAtual) {
      toast.error(`Ano inválido (1 - ${anoAtual})`);
      return;
    }

    const bookData = {
      titulo: tituloLimpo,
      autor: autorLimpo,
      ano: anoNumerico,
    };

    setSaving(true);

    try {
      if (id) {
        await api.put(`/${id}`, bookData);
        toast.success("Livro atualizado!");
      } else {
        await api.post("/", bookData);
        toast.success("Livro cadastrado!");
      }

      navigate("/books");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar livro");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-xl border shadow-xl flex flex-col
        bg-white/95 dark:bg-slate-900/95
        border-slate-300 dark:border-slate-700"
      >
        {/* Header */}
        <div className="p-5 border-b flex items-center gap-3
          bg-slate-100 dark:bg-white/5
          border-slate-300 dark:border-slate-700"
        >
          {id ? <TfiWrite size={20} /> : <BiBookAdd size={20} />}
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {id ? "Editar Livro" : "Adicionar Livro"}
          </h2>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {loading ? (
            <p className="text-center text-slate-700 dark:text-slate-300 animate-pulse">
              Carregando...
            </p>
          ) : (
            <>
              {/* título */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Título
                </label>

                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: O Senhor dos Anéis"
                  className="w-full px-3 py-2 rounded-md border text-sm
                    bg-white dark:bg-slate-800
                    border-slate-300 dark:border-slate-700
                    text-slate-900 dark:text-white
                    placeholder:text-slate-400
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* autor */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Autor
                </label>

                <input
                  type="text"
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                  placeholder="Ex: J.R.R. Tolkien"
                  className="w-full px-3 py-2 rounded-md border text-sm
                    bg-white dark:bg-slate-800
                    border-slate-300 dark:border-slate-700
                    text-slate-900 dark:text-white
                    placeholder:text-slate-400
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* ano */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Ano
                </label>

                <input
                  type="number"
                  value={ano}
                  onChange={(e) => setAno(e.target.value)}
                  placeholder="Ex: 1954"
                  className="w-full px-3 py-2 rounded-md border text-sm
                    bg-white dark:bg-slate-800
                    border-slate-300 dark:border-slate-700
                    text-slate-900 dark:text-white
                    placeholder:text-slate-400
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </>
          )}

          {/* Footer */}
          <div className="pt-4 border-t flex justify-end gap-3
            border-slate-300 dark:border-slate-700"
          >
            <button
              type="button"
              onClick={() => navigate("/books")}
              className="px-4 py-2 text-sm rounded-md border
                border-slate-300 dark:border-slate-700
                text-slate-700 dark:text-slate-300
                hover:bg-slate-100 dark:hover:bg-white/10 transition"
            >
              Cancelar
            </button>

            <button
              disabled={saving}
              type="submit"
              className="px-4 py-2 text-sm rounded-md font-semibold
                bg-green-600 hover:bg-green-700
                text-white shadow-md transition"
            >
              {id ? "Salvar" : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBook;
