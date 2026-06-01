import { useState, useEffect } from 'react';
import { FaRegSun } from "react-icons/fa";
import { FaRegMoon } from "react-icons/fa6";

function ModoEscuro() {
  const [darkTheme, setDarkTheme] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const html = document.documentElement;
    if (darkTheme) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkTheme]);

  return (
   // Em ModoEscuro.jsx
<button 
  onClick={() => setDarkTheme(!darkTheme)}
  className="p-2 bg-destaque  rounded-full text-white  dark:text-black transition-colors cursor-pointer hover:bg-black/10 dark:hover:bg-white/10"
  title="Alternar Tema"
>
  {darkTheme ? <FaRegSun size={20} /> : <FaRegMoon size={20} />}
</button>
  );
}

export default ModoEscuro;