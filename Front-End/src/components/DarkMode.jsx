import {useState, useEffect} from 'react';

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
      
        <div className="flex flex-col items-center justify-center p-4">
            <button onClick={() => setDarkTheme(!darkTheme)} className='p-4 rounded-full bg-destaque text-white text-4xl hover:scale-110 transition-transform shadow-lg' title='alternar tema'>
                {darkTheme ? '☀️' : '🌙'}
            </button>
        </div>
    )
}; 

export default ModoEscuro ;