import { createContext, useState, type ReactNode } from "react";

export const ThemeContext =  createContext({theme:'light', toggle:()=>{}})
export function ThemeProvider({ children }: { children: ReactNode }){
    const [theme, setTheme] = useState('light')
    const toggle = () =>{setTheme(theme === 'light' ? 'dark' : 'light')}
    return(
        <ThemeContext.Provider value={{theme, toggle}}>
            {children}
        </ThemeContext.Provider>
    )
}