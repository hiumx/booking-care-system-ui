import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const useTheme = () => {
    const [theme, setTheme] = useState<Theme>(() => {
        // Get theme from localStorage or default to light
        const stored = localStorage.getItem('darkMode');
        return stored === 'enabled' ? 'dark' : 'light';
    });

    useEffect(() => {
        // Apply theme class to document element immediately
        const root = document.documentElement;
        root.classList.remove('light-mode', 'dark-mode');
        root.classList.add(theme === 'dark' ? 'dark-mode' : 'light-mode');

        // Save to localStorage
        localStorage.setItem('darkMode', theme === 'dark' ? 'enabled' : 'disabled');
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    const setDarkMode = (isDark: boolean) => {
        setTheme(isDark ? 'dark' : 'light');
    };

    return {
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        setDarkMode,
    };
};

export default useTheme;
