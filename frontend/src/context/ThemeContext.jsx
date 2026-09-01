import { createContext, useContext, useEffect, useState } from "react";
import { DARK_THEME, LIGHT_THEME, THEME_KEY } from "../constant";


const ThemeContext = createContext();

const getInitialTheme = () => {
    const saved = localStorage.getItem(THEME_KEY);
    if(saved) return saved;

    const systemPrefersDark = window.matchMedia("(prefer-color-scheme: dark)").matches;
    return systemPrefersDark ? DARK_THEME : LIGHT_THEME;
}

export const ThemeProvider = ({children}) => {
    const [theme, setTheme] = useState(getInitialTheme);

    const toogleTheme = () => {
        setTheme((prev) => (prev == LIGHT_THEME ? DARK_THEME : LIGHT_THEME));
    }

    useEffect(() => {
        document.documentElement.setAttribute("data-theme" , theme);
        localStorage.setItem(THEME_KEY, theme);
    }, [theme])

    return (
        <ThemeContext.Provider value={{theme, toogleTheme}}>
            {children}
        </ThemeContext.Provider>
    )

}

export const useTheme = () => useContext(ThemeContext);