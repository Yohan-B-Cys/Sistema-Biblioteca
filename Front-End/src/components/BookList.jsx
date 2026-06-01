import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";
import ModoEscuro from "./DarkMode";
import HistoryModal from "./History";
import CopyButton from "./CopyButton";

import { IoLibrary } from "react-icons/io5";
import { TbXboxX } from "react-icons/tb";
import { TfiWrite } from "react-icons/tfi";
import { BiBookAdd } from "react-icons/bi";
import { CiClock2 } from "react-icons/ci";

const PAGE_SIZE_OPTIONS = [2, 5, 10, 20];

const TOAST_CLASS =
  "!bg-background !text-text border border-gray-200 dark:border-gray-700";

function BookTable() {
  const navigate = useNavigate();

  // =========================
  // Estados
  // =========================
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);



  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(5);

  // Histórico
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [bookHistory, setBookHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // =========================
  // Effects
  // =========================
  useEffect(() => {
    fetchBooks();
  }, []);

  // Sempre volta para a página 1 quando busca ou itens por página mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [search, booksPerPage]);

  // =========================
  // Helpers
  // =========================
  const fetchBooks = async () => {
    setLoading(true);

    try {
      const response = await api.get("/");
      setBooks(response.data);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
      toast.error("Erro ao buscar livros.", { className: TOAST_CLASS });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = (id) => {

    if (confirmingId === id) return;

    setConfirmingId(id);

    toast(
      (t) => (
        <div className="flex flex-col gap-4">
          <p className="text-text">
            Tem certeza que deseja excluir o livro?
            <br />
            Essa ação não pode ser desfeita.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-text opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            >
              Cancelar
            </button>

            <button
              onClick={async () => {
                // ✅ evita clique duplo
                if (deletingId === id) return;

                toast.dismiss(t.id);

                try {
                  setDeletingId(id); // ✅ marca como "deletando"

                  await api.delete(`/${id}`);
                  await fetchBooks();

                  toast.success("Excluído com sucesso!", {
                    className: TOAST_CLASS,
                  });
                } catch (error) {
                  console.error("Erro ao deletar livro:", error);
                  toast.error("Falha ao deletar livro.", {
                    className: TOAST_CLASS,
                  });
                } finally {
                  setDeletingId(null); // ✅ libera novamente
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1.5 rounded-md transition-colors cursor-pointer shadow-lg"
            >
              Confirmar
            </button>
          </div>
        </div>
      ),
      {
        className: TOAST_CLASS,
        duration: Infinity,
      }
    );
  };

  const handleOpenHistory = async (id) => {
    setIsHistoryModalOpen(true);
    setIsHistoryLoading(true);
    setBookHistory([]);

    try {
      const response = await api.get(`/history/${id}`);
      setBookHistory(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      toast.error("Erro ao buscar o histórico.", {
        className: TOAST_CLASS,
      });
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleCloseHistory = () => {
    setIsHistoryModalOpen(false);
    setBookHistory([]);
  };

  // =========================
  // Dados derivados
  // =========================
  const normalizedSearch = search.trim().toLowerCase();

  const filteredBooks = useMemo(() => {
    return books.filter((livro) => {
      return (
        String(livro.id).toLowerCase().includes(normalizedSearch) ||
        livro.titulo.toLowerCase().includes(normalizedSearch) ||
        livro.autor.toLowerCase().includes(normalizedSearch) ||
        String(livro.ano).includes(normalizedSearch)
      );
    });
  }, [books, normalizedSearch]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBooks.length / booksPerPage)
  );

  // Corrige currentPage caso ela fique maior que o total de páginas
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;

  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const startItem = filteredBooks.length === 0 ? 0 : indexOfFirstBook + 1;
  const endItem = Math.min(indexOfLastBook, filteredBooks.length);

  // =========================
  // Paginação - ações
  // =========================
  const goToFirstPage = () => setCurrentPage(1);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToLastPage = () => setCurrentPage(totalPages);

  // =========================
  // Render helpers
  // =========================
  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={5} className="p-8 text-center text-text/70">
            Buscando livros...
          </td>
        </tr>
      );
    }

    if (books.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="p-8 text-center text-text/70">
            Nenhum livro cadastrado.
          </td>
        </tr>
      );
    }

    if (filteredBooks.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="p-8 text-center text-text/70">
            Nenhum livro encontrado para essa busca.
          </td>
        </tr>
      );
    }

    return currentBooks.map((livro) => (
      <tr
        key={livro.id}
        className="border-b border-borda last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <td className="p-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="truncate flex-1 min-w-0" title={livro.id}>
              {livro.id}
            </span>

            <div className="shrink-0 flex items-center">
              <CopyButton textToCopy={livro.id} />
            </div>
          </div>
        </td>

        <td className="p-4 truncate" title={livro.titulo}>
          {livro.titulo}
        </td>

        <td className="p-4 truncate" title={livro.autor}>
          {livro.autor}
        </td>

        <td className="p-4 text-center">{livro.ano}</td>

        <td className="p-4 text-center">
          <div className="flex justify-center gap-2">
            <button
              onClick={() => navigate(`/books/${livro.id}/edit`)}
              className="p-2 text-text hover:bg-black/10 dark:hover:bg-white/10 rounded-md cursor-pointer transition-colors"
              title="Editar"
            >
              <TfiWrite size={18} />
            </button>

            <button
              onClick={() => handleOpenHistory(livro.id)}
              className="p-2 text-text hover:bg-black/10 dark:hover:bg-white/10 rounded-md cursor-pointer transition-colors"
              title={`Histórico do livro ${livro.titulo}`}
            >
              <CiClock2 size={18} />
            </button>

            <button
              onClick={() => handleDeleteBook(livro.id)}
              disabled={deletingId === livro.id}
              className={`
    p-2 text-red-500 rounded-md transition-colors
    ${deletingId === livro.id
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-red-500/10"}
  `}
              title="Excluir"
            >
              {deletingId === livro.id ? "..." : <TbXboxX size={20} />}
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="min-h-screen bg-background text-text p-8 flex flex-col items-center">
      {/* Cabeçalho */}
      <div className="w-full max-w-5xl flex justify-center items-center relative mb-8">
        <div className="absolute right-0">
          <ModoEscuro />
        </div>

        <h1 className="text-3xl font-bold flex items-center gap-3">
          <IoLibrary size={32} />
          Sistema Biblioteca
        </h1>
      </div>

      {/* Busca + botão adicionar */}
      <div className="w-full max-w-5xl flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Pesquisar livros..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 rounded-lg border-2 border-gray-400 dark:border-gray-500 dark:bg-white/5 text-text focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
        />

        <button
          onClick={() => navigate("/books/new")}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-md transition-colors cursor-pointer font-medium text-sm whitespace-nowrap shadow-sm"
        >
          <BiBookAdd size={18} />
          Adicionar Livro
        </button>
      </div>

      {/* Tabela */}
      <div className="w-full max-w-5xl bg-surface border border-borda rounded-lg shadow-md overflow-hidden mb-4">
        <table className="w-full table-fixed text-left">
          <thead className="bg-black/5 dark:bg-white/5 border-b border-borda">
            <tr>
              <th className="p-4 w-1/4 font-semibold">ID</th>
              <th className="p-4 w-1/3 font-semibold">TÍTULO</th>
              <th className="p-4 w-1/4 font-semibold">AUTOR</th>
              <th className="p-4 w-24 text-center font-semibold">ANO</th>
              <th className="p-4 w-32 text-center font-semibold">AÇÕES</th>
            </tr>
          </thead>

          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>

      {/* Barra de informações da paginação */}
      {!loading && filteredBooks.length > 0 && (
        <div className="w-full max-w-5xl flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-text/80">
            <span>Itens por página:</span>

            <select
              value={booksPerPage}
              onChange={(e) => setBooksPerPage(Number(e.target.value))}
              className="px-3 py-2 rounded-md border border-text bg-background text-text"
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm text-text/80">
            Exibindo {startItem}–{endItem} de {filteredBooks.length} resultados
          </p>

          <p className="text-sm text-text/80">
            Página {currentPage} de {totalPages}
          </p>
        </div>
      )}

      {/* Controles da paginação */}
      {!loading && filteredBooks.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center items-center">
          <button
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-md border border-text text-text disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title="Primeira página"
          >
            {"<<"}
          </button>

          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-md border border-text text-text disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title="Página anterior"
          >
            {"<"}
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;

            return (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`w-10 h-10 rounded-md border border-text flex items-center justify-center cursor-pointer transition-colors ${currentPage === pageNumber
                    ? "bg-text text-background"
                    : "text-text hover:bg-black/10 dark:hover:bg-white/10"
                  }`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-md border border-text text-text disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title="Próxima página"
          >
            {">"}
          </button>

          <button
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-md border border-text text-text disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title="Última página"
          >
            {">>"}
          </button>
        </div>
      )}

      {/* Modal de histórico */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={handleCloseHistory}
        historyData={bookHistory}
        isLoading={isHistoryLoading}
      />
    </div>
  );
}

export default BookTable;