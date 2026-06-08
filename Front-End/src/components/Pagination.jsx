function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  startItem,
  endItem,
  pageSizeOptions,
  onPageChange,
  onItemsPerPageChange,
}) {
  return (
    <div className="w-full max-w-5xl flex flex-col gap-4">
      {/* Informações da paginação */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-text/80">
          <span>Itens por página:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-2 rounded-md border border-text bg-background text-text cursor-pointer"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <p className="text-sm text-text/80">
          Exibindo {startItem}–{endItem} de {totalItems} resultados
        </p>

        <p className="text-sm text-text/80">
          Página {currentPage} de {totalPages}
        </p>
      </div>

      {/* Controles numéricos */}
      <div className="flex flex-wrap gap-2 justify-center items-center">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-md border border-text text-text disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          title="Primeira página"
        >
          {"<<"}
        </button>

        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
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
              onClick={() => onPageChange(pageNumber)}
              className={`w-10 h-10 rounded-md border border-text flex items-center justify-center cursor-pointer transition-colors ${
                currentPage === pageNumber
                  ? "bg-text text-background"
                  : "text-text hover:bg-black/10 dark:hover:bg-white/10"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-md border border-text text-text disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          title="Próxima página"
        >
          {">"}
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-md border border-text text-text disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          title="Última página"
        >
          {">>"}
        </button>
      </div>
    </div>
  );
}

export default Pagination;