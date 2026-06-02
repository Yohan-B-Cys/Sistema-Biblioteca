import React from 'react';

const HistoryModal = ({ isOpen, onClose, historyData, isLoading }) => {
  if (!isOpen) return null;

  const temHistorico = historyData && historyData.length > 0; // verifica a existencia do historico

  const registroCriacao = temHistorico ? historyData[historyData.length - 1] : null; 
  const dataCriacao = registroCriacao
    ? new Date(registroCriacao.createdAt).toLocaleString('pt-BR', { // mostra a data do primeiro registro o de criação
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  const registroUltimaAlteracao = temHistorico ? historyData[0] : null; //pega alteração mais recente 
  const dataUltimaAlteracao = registroUltimaAlteracao
    ? new Date(registroUltimaAlteracao.createdAt).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  const restoDoHistorico = temHistorico ? historyData.slice(1) : []; // mostra o resto do historico

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 dark:bg-black/40 backdrop-blur-[1px] dark:backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-xl border shadow-2xl flex flex-col bg-white/95 dark:bg-slate-900/95 border-slate-300 dark:border-slate-700">
        
        {/* Cabeçalho */}
        <div className="p-4 border-b flex justify-between items-center bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Histórico Geral
          </h2>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer text-xl"
          >
            &times;
          </button>
        </div>

        {/* Corpo */}
        <div className="p-6 max-h-[70vh] overflow-y-auto flex flex-col gap-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <span className="text-slate-700 dark:text-slate-300 animate-pulse">
                Carregando dados...
              </span>
            </div>
          ) : !temHistorico ? (
            <p className="text-center text-slate-700 dark:text-slate-300">
              Nenhum histórico encontrado para este livro.
            </p>
          ) : (
            <>
              {/* Resumo */}
              <div className="p-4 rounded-xl border shadow-sm flex flex-col gap-3 text-sm bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100">
                <div>
                  <span className="font-semibold text-xs text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                    Livro ID:
                  </span>
                  <span className="text-base font-bold text-green-600 dark:text-green-400">
                    {historyData[0]?.bookId || "ID não encontrado"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="font-semibold text-xs text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                      Criado em
                    </span>
                    <span className="font-medium text-xs text-slate-800 dark:text-slate-200">
                      {dataCriacao}
                    </span>
                  </div>

                  <div>
                    <span className="font-semibold text-xs text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                      Última Alteração
                    </span>
                    <span className="font-medium text-xs text-green-600 dark:text-green-400">
                      {dataUltimaAlteracao}
                    </span>
                  </div>
                </div>

                <div className="mt-2 p-3 rounded-lg border text-xs bg-white dark:bg-slate-800/60 border-slate-300 dark:border-slate-700">
                  <span className="font-bold block mb-1 text-green-600 dark:text-green-400 uppercase tracking-wide">
                    Mudanças na última alteração:
                  </span>

                  <p className="mb-1">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      Campo Alterado:
                    </span>{" "}
                    <span className="capitalize text-slate-900 dark:text-slate-100">
                      {registroUltimaAlteracao.label}
                    </span>
                  </p>

                  {registroUltimaAlteracao.oldValue && (
                    <p>
                      <span className="font-semibold text-slate-600 dark:text-slate-400">
                        Valor Antigo:
                      </span>{" "}
                      <span className="text-slate-800 dark:text-slate-200">
                        {registroUltimaAlteracao.oldValue}
                      </span>
                    </p>
                  )}

                  {registroUltimaAlteracao.newValue && (
                    <p>
                      <span className="font-semibold text-slate-600 dark:text-slate-400">
                        Valor Novo:
                      </span>{" "}
                      <span className="text-slate-800 dark:text-slate-200">
                        {registroUltimaAlteracao.newValue}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Timeline */}
              {restoDoHistorico.length > 0 && (
                <div>
                  <span className="font-bold text-xs text-slate-500 dark:text-slate-400 block uppercase tracking-wider mb-4">
                    Alterações Anteriores
                  </span>

                  <ol className="relative border-l border-slate-300 dark:border-slate-700 ml-3">
                    {restoDoHistorico.map((item, index) => {
                      const dataItem = new Date(item.createdAt)
                        .toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                        .replace(',', ' -');

                      return (
                        <li key={item.id || index} className="mb-6 ml-6 last:mb-0">
                          <span className="absolute flex items-center justify-center w-2.5 h-2.5 bg-slate-400 dark:bg-slate-600 rounded-full -left-1.5" />

                          <h3 className="flex items-center mb-1 text-xs font-bold text-slate-800 dark:text-slate-100">
                            <span className="text-slate-500 dark:text-slate-400 mr-2">
                              {dataItem}
                            </span>
                            <span className="capitalize">
                              Campo Alterado : {item.label}
                            </span>
                          </h3>

                          {(item.oldValue || item.newValue) && (
                            <div className="p-2.5 rounded-lg border text-xs bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                              {item.oldValue && (
                                <p>
                                  <span className="font-semibold text-slate-600 dark:text-slate-400">
                                    Valor Antigo:
                                  </span>{" "}
                                  {item.oldValue}
                                </p>
                              )}
                              {item.newValue && (
                                <p>
                                  <span className="font-semibold text-slate-600 dark:text-slate-400">
                                    Valor Novo:
                                  </span>{" "}
                                  {item.newValue}
                                </p>
                              )}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}
            </>
          )}
        </div>

        {/* Rodapé */}
        <div className="p-4 border-t flex justify-end bg-slate-50 dark:bg-transparent border-slate-300 dark:border-slate-700">
          <button
            onClick={onClose}
            className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-md transition-colors cursor-pointer font-medium text-sm"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;