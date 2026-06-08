function DeleteConfirmToast({ t, onConfirm, onCancel }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-text">
        Tem certeza que deseja excluir o livro?
        <br />
        Essa ação não pode ser desfeita.
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => onCancel(t.id)}
          className="px-3 py-1.5 text-text opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
        >
          Cancelar
        </button>

        <button
          onClick={() => onConfirm(t.id)}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1.5 rounded-md transition-colors cursor-pointer shadow-lg"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}

export default DeleteConfirmToast;