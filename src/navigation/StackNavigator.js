import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserPreferencesContext } from '../context/UserPreferences';
import AddExpense from '../components/AddExpense';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    const { theme } = useContext(UserPreferencesContext);

    const headerStyle = {
        backgroundColor: theme === 'dark' ? '#1c1c1e' : '#fff',
    };

    const headerTitleStyle = {
        color: theme === 'dark' ? '#fff' : '#000',
    };

    return (
        <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={TabNavigator} />
            <Stack.Screen
                name="AddExpense"
                component={AddExpense}
                options={{
                    headerShown: true,
                    headerStyle,
                    headerTitleStyle,
                    headerTintColor: theme === 'dark' ? '#fff' : '#000', // Back button color
                    title: 'Add Expense',
                }}
            />
        </Stack.Navigator>
    );
};

export default StackNavigator;
