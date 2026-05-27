import { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa'; 

// Microcomponente isolado
const CopyButton = ({ textToCopy }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true); 
      
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      
    } catch (err) {
      console.error("Erro ao copiar", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      title="Copiar"
      className={`p-1.5 rounded-md transition-all duration-300 cursor-pointer flex items-center justify-center
        ${isCopied 
          ? 'bg-green-500/20 text-green-500 scale-110' 
          : 'opacity-50 hover:opacity-100 hover:bg-gray-500/20 hover:scale-105' 
        }`}
    >
      {isCopied ? <FaCheck size={12} /> : <FaCopy size={12} />}
    </button>
  );
};

export default CopyButton ;