import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserPreferencesContext = createContext({
    theme: 'light',
    currency: 'INR',
    setTheme: () => { },
    setCurrency: () => { },
});

export const UserPreferences = ({ children }) => {
    const [theme, setThemeState] = useState('light');
    const [currency, setCurrencyState] = useState('INR');

    // Load preferences on mount
    useEffect(() => {
        const loadPreferences = async () => {
            try {
                const storedTheme = await AsyncStorage.getItem('user_theme');
                const storedCurrency = await AsyncStorage.getItem('user_currency');
                if (storedTheme) setThemeState(storedTheme);
                if (storedCurrency) setCurrencyState(storedCurrency);
            } catch (error) {
                console.error('Failed to load user preferences:', error);
            }
        };
        loadPreferences();
    }, []);

    // Save theme
    const setTheme = async (value) => {
        try {
            setThemeState(value);
            await AsyncStorage.setItem('user_theme', value);
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    };

    // Save currency
    const setCurrency = async (value) => {
        try {
            await AsyncStorage.setItem('user_currency', value);
            setCurrencyState(value);
        } catch (error) {
            console.error('Failed to save currency:', error);
        }
    };

    return (
        <UserPreferencesContext.Provider value={{ theme, currency, setTheme, setCurrency }}>
            {children}
        </UserPreferencesContext.Provider>
    );
};
