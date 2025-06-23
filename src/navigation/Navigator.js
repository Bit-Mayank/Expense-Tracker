import React, { useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import { UserPreferencesContext } from '../context/UserPreferences';
import { StatusBar } from 'react-native';

const Navigator = () => {
    const { theme } = useContext(UserPreferencesContext)
    return (
        <>
            <NavigationContainer>
                <StatusBar
                    barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
                    backgroundColor={theme === 'dark' ? '#2c2c2c' : '#ffffff'}
                    translucent={false}
                />
                <StackNavigator />
            </NavigationContainer>
        </>
    )
}

export default Navigator