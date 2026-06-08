import { BiBookAdd } from "react-icons/bi";

function BookFilterBar({ filters, onFilterChange, onAddBook }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="w-full max-w-5xl flex flex-wrap items-center gap-3 mb-6 bg-surface p-4 rounded-lg border border-borda shadow-sm">
      
      {/* 1. Barra de Pesquisa */}
      <input
        type="text"
        name="search"
        placeholder="Pesquisar por título, autor ou ID..."
        value={filters.search}
        onChange={handleChange}
        className="flex-1 min-w-[200px] p-3 rounded-lg border-2 border-gray-400 dark:border-gray-500 dark:bg-white/5 text-text focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
      />

      {/* 2. O seu Combo Box de Ordenação */}
      {/* Combo Box de Ordenação */}
      <select
        name="ordem"
        value={filters.ordem}
        onChange={handleChange}
        className="p-3 rounded-lg border-2 border-gray-400 dark:border-gray-500 dark:bg-white/5 text-text bg-transparent focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 cursor-pointer transition-all"
      >
        <option value="" className="bg-background text-text">Ordenar por...</option>
        <option value="ano_novo" className="bg-background text-text">Maior Ano</option>
        <option value="ano_antigo" className="bg-background text-text">Menor Ano</option>
        <option value="registro_novo" className="bg-background text-text">Adicionado recentemente</option>
        <option value="registro_antigo" className="bg-background text-text">Adicionado mais antigo</option>
      </select>

      {/* 3. Botão Adicionar */}
      <button
        onClick={onAddBook}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md transition-colors cursor-pointer font-medium text-sm whitespace-nowrap shadow-sm h-full"
      >
        <BiBookAdd size={18} />
        Adicionar Livro
      </button>
    </div>
  );
}

export default BookFilterBar;