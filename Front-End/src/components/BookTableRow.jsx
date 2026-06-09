import { TfiWrite } from "react-icons/tfi";
import { CiClock2 } from "react-icons/ci";
import { TbXboxX } from "react-icons/tb";
import CopyButton from "./CopyButton"; 

function BookTableRow({ livro, isDeleting, onEdit, onOpenHistory, onDelete }) {
  return (
    <tr className="border-b border-borda last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
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

     <td className="p-4 text-center">
  {Number(livro.ano) < 0 
    ? `${Math.abs(Number(livro.ano))} A.C` 
    : livro.ano}
</td>

      <td className="p-4 text-center">
        <div className="flex justify-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-text hover:bg-black/10 dark:hover:bg-white/10 rounded-md cursor-pointer transition-colors"
            title="Editar"
          >
            <TfiWrite size={18} />
          </button>

          <button
            onClick={onOpenHistory}
            className="p-2 text-text hover:bg-black/10 dark:hover:bg-white/10 rounded-md cursor-pointer transition-colors"
            title={`Histórico do livro ${livro.titulo}`}
          >
            <CiClock2 size={18} />
          </button>

          <button
            onClick={onDelete}
            disabled={isDeleting}
            className={`p-2 text-red-500 rounded-md transition-colors ${
              isDeleting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-500/10 cursor-pointer"
            }`}
            title="Excluir"
          >
            {isDeleting ? "..." : <TbXboxX size={20} />}
          </button>
        </div>
      </td>
    </tr>
  );
}

export default BookTableRow;