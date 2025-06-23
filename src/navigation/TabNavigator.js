import React, { useContext } from 'react';
import { UserPreferencesContext } from '../context/UserPreferences';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeIcon from '../../assets/TabNavigatorIcons/HomeIcon';
import CategoriesIcon from '../../assets/TabNavigatorIcons/CategoriesIcon';
import TransactionsIcon from '../../assets/TabNavigatorIcons/TransactionsIcon';
import SettingIcon from '../../assets/TabNavigatorIcons/SettingIcon';
import HomePage from '../screens/HomePage';
import CategoriesPage from '../screens/CategoriesPage';
import Transactions from '../screens/Transactions';
import SettingsPage from '../screens/SettingsPage';

const Tabs = createBottomTabNavigator();

const TabNavigator = () => {
    const { theme } = useContext(UserPreferencesContext);

    const activeColor = "#007AFF";
    const inactiveColor = "#ADADAD";

    const isDark = theme === 'dark';

    const tabBarStyle = {
        backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
        borderTopColor: isDark ? '#2c2c2e' : '#cccccc',
    };

    const headerStyle = {
        backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
    };

    const headerTitleStyle = {
        color: isDark ? '#f2f2f7' : '#000000',
    };

    return (
        <Tabs.Navigator
            initialRouteName='HomeTab'
            screenOptions={{
                tabBarActiveTintColor: activeColor,
                tabBarInactiveTintColor: inactiveColor,
                tabBarStyle,
                headerStyle,
                headerTitleStyle,
            }}
        >
            <Tabs.Screen
                name="HomeTab"
                component={HomePage}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <HomeIcon fillColor={focused ? activeColor : inactiveColor} />
                    ),
                    headerTitleAlign: "center",
                    title: "Home",
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="CategoriesTab"
                component={CategoriesPage}
                options={{
                    title: 'Categories',
                    headerTitleAlign: 'center',
                    tabBarIcon: ({ focused }) => (
                        <CategoriesIcon fillColor={focused ? activeColor : inactiveColor} />
                    ),
                }}
            />
            <Tabs.Screen
                name="TransactionsTab"
                component={Transactions}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TransactionsIcon fillColor={focused ? activeColor : inactiveColor} />
                    ),
                    headerTitleAlign: "center",
                    title: "Transactions",
                }}
            />
            <Tabs.Screen
                name="SettingTab"
                component={SettingsPage}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <SettingIcon fillColor={focused ? activeColor : inactiveColor} />
                    ),
                    headerTitleAlign: "center",
                    title: "Settings",
                }}
            />
        </Tabs.Navigator>
    );
};

export default TabNavigator;
