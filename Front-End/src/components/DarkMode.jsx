import {useState, useEffect} from 'react';
import { FaRegSun } from "react-icons/fa";
import { FaRegMoon } from "react-icons/fa6";
function ModoEscuro () {
    const[darkTheme , setDarkTheme] = useState ( ()=>{
        return localStorage.getItem('theme') === 'dark' ;
    } )

    useEffect(() => {
        const htmlElement = document.documentElement ;

        if (darkTheme) {
            htmlElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            htmlElement.classList.remove('dark');
            localStorage.setItem('theme','light');
        }
    } ,[darkTheme]);

  return (
      
        <div className="flex flex-col items-center justify-center p-4 cursor-pointer">
            <button onClick={() => setDarkTheme(!darkTheme)} className='p-4 rounded-full bg-black text-white dark:bg-white dark:text-black text-4xl hover:scale-110 transition-transform shadow-lg' title='alternar tema'>
                {darkTheme ? <FaRegSun /> : <FaRegMoon/>}
            </button>
        </div>
    )
}; 

export default ModoEscuro ;