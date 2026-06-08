import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";
import ModoEscuro from "./DarkMode";
import HistoryModal from "./History";
import { IoLibrary } from "react-icons/io5";

// Importando nossos componentes filhos
import BookFilterBar from "./BookFilterBar";
import BookTableRow from "./BookTableRow";
import Pagination from "./Pagination";
import DeleteConfirmToast from "./DeleteConfirmToast";

const PAGE_SIZE_OPTIONS = [2, 5, 10, 20];
const TOAST_CLASS = "!bg-background !text-text border border-gray-200 dark:border-gray-700";

function BookTable() {
  const navigate = useNavigate();

  // =========================
  // Estados
  // =========================
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  
  // Estado dos filtros e ordenação
  const [filters, setFilters] = useState({
    search: "",
    ordem: ""
  });

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

  // =========================
  // Helpers e Lógica de Negócio
  // =========================
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Sempre volta para página 1 ao filtrar ou ordenar
  };

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
        <DeleteConfirmToast
          t={t}
          onCancel={(toastId) => {
            setConfirmingId(null);
            toast.dismiss(toastId);
          }}
          onConfirm={async (toastId) => {
            if (deletingId === id) return;

            toast.dismiss(toastId);

            try {
              setDeletingId(id);
              await api.delete(`/${id}`);
              await fetchBooks(); // É por causa dessa linha que a função fica aqui!

              toast.success("Excluído com sucesso!", { className: TOAST_CLASS });
            } catch (error) {
              console.error("Erro ao deletar livro:", error);
              toast.error("Falha ao deletar livro.", { className: TOAST_CLASS });
            } finally {
              setDeletingId(null);
              setConfirmingId(null);
            }
          }}
        />
      ),
      { className: TOAST_CLASS, duration: Infinity }
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
      toast.error("Erro ao buscar o histórico.", { className: TOAST_CLASS });
    } finally {
      setIsHistoryLoading(false);
    }
  };

  // =========================
  // Processamento: Filtro + Ordenação
  // =========================
// =========================
  // Dados Derivados (Filtros e Ordenação)
  // =========================
  // Função que converte qualquer formato de ano para um número real (Timeline)
  const parseAnoToNumber = (ano) => {
    if (!ano) return 0; // Prevenção se o livro não tiver ano cadastrado

    // 1. Transforma tudo em texto minúsculo (ex: "500 A.C." vira "500 a.c.")
    const strAno = String(ano).toLowerCase().trim();

    // 2. Verifica se o ano é "Antes de Cristo"
    // Pode vir como "a.c.", "ac" ou até mesmo se o usuário já digitou "-500"
    const isAC = strAno.includes("a.c") || strAno.includes("ac") || strAno.startsWith("-");

    // 3. Extrai APENAS os números do texto (Remove letras, espaços e pontos)
    // Ex: "500 a.c." vira "500"
    const numerosLimpos = strAno.replace(/\D/g, "");
    
    // 4. Converte para formato numérico do JS
    let numericAno = parseInt(numerosLimpos, 10);
    if (isNaN(numericAno)) return 0; // Prevenção de erro

    // 5. A Matemática: Se for a.C., multiplica por -1 (vira negativo)
    return isAC ? -numericAno : numericAno;
  };

  const filteredBooks = useMemo(() => {
    // 1. Filtrar pelo texto pesquisado
    let result = books.filter((livro) => {
      const normalizedSearch = filters.search.trim().toLowerCase();
      if (!normalizedSearch) return true; 
      
      return (
        String(livro.id).toLowerCase().includes(normalizedSearch) ||
        livro.titulo.toLowerCase().includes(normalizedSearch) ||
        livro.autor.toLowerCase().includes(normalizedSearch) ||
        String(livro.ano).includes(normalizedSearch)
       
      );
    });

    // 2. Ordenar baseado no Combo Box
  // PASSO 2: Ordenar baseado no Combo Box
    if (filters.ordem === "ano_novo") {
      // Ordena do Maior para o Menor (ex: 2024 -> 1990 -> -200 -> -500)
      result.sort((a, b) => parseAnoToNumber(b.ano) - parseAnoToNumber(a.ano));
    } 
    else if (filters.ordem === "ano_antigo") {
      // Ordena do Menor para o Maior (ex: -500 -> -200 -> 1990 -> 2024)
      result.sort((a, b) => parseAnoToNumber(a.ano) - parseAnoToNumber(b.ano));
    } 
    else if (filters.ordem === "registro_novo") {
      result.sort((a, b) => books.indexOf(b) - books.indexOf(a));
    } 
    else if (filters.ordem === "registro_antigo") {
      result.sort((a, b) => books.indexOf(a) - books.indexOf(b));
    }

    return result;
  }, [books, filters]);

  // =========================
  // Cálculos de Paginação
  // =========================
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / booksPerPage));
  
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
  // Render da Interface Principal
  // =========================
  return (
    <div className="min-h-screen bg-background text-text p-8 flex flex-col items-center">
      
      {/* Cabeçalho */}
      <div className="w-full max-w-5xl flex justify-center items-center relative mb-8">
        <div className="absolute right-0"><ModoEscuro /></div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <IoLibrary size={32} /> Sistema Biblioteca
        </h1>
      </div>

      {/* Barra de Filtros e Ordenação */}
      <BookFilterBar 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        onAddBook={() => navigate("/books/new")} 
      />

      {/* Tabela de Livros */}
      <div className="w-full max-w-5xl bg-surface border border-borda rounded-lg shadow-md overflow-hidden mb-6">
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
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-text/70">Buscando livros...</td></tr>
            ) : filteredBooks.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-text/70">Nenhum livro encontrado.</td></tr>
            ) : (
              currentBooks.map((livro) => (
                <BookTableRow 
                  key={livro.id} 
                  livro={livro} 
                  isDeleting={deletingId === livro.id}
                  onEdit={() => navigate(`/books/${livro.id}/edit`)}
                  onOpenHistory={() => handleOpenHistory(livro.id)}
                  onDelete={() => handleDeleteBook(livro.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {!loading && filteredBooks.length > 0 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={booksPerPage}
          totalItems={filteredBooks.length}
          startItem={startItem}
          endItem={endItem}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setBooksPerPage}
        />
      )}

      {/* Modal Histórico */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        historyData={bookHistory}
        isLoading={isHistoryLoading}
      />
    </div>
  );
}

export default BookTable;