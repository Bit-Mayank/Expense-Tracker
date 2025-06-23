import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { UserPreferencesContext } from '../context/UserPreferences';

const categoryLabels = {
    food: 'Food & Drink',
    transport: 'Transportation',
    shopping: 'Shopping',
    entertainment: 'Entertainment',
    utilities: 'Utilites',
    others: 'Other',
};

const categoryIcons = {
    food: <Ionicons name="restaurant" size={20} color="#fff" />,
    transport: <FontAwesome5 name="bus" size={20} color="#fff" />,
    entertainment: <Ionicons name="film" size={20} color="#fff" />,
    shopping: <MaterialIcons name="shopping-bag" size={20} color="#fff" />,
    utilities: <Ionicons name="flash" size={20} color="#fff" />,
    others: <Ionicons name="apps" size={20} color="#fff" />,
};

const categoryColors = {
    food: '#f39c12',
    transport: '#3498db',
    entertainment: '#e74c3c',
    shopping: '#1abc9c',
    utilities: '#f1c40f',
    others: '#95a5a6',
};

const SpendingByCategory = () => {
    const [selectedRange, setSelectedRange] = useState('Month');
    const [categoryData, setCategoryData] = useState([]);
    const { theme, currency } = useContext(UserPreferencesContext)
    const styles = getCategoryStyles(theme);

    const currencyFormat = new Intl.NumberFormat(currency === "INR" ? 'en-IN' : 'en-US', {
        style: 'currency',
        currency: currency
    })


    const loadExpenses = async () => {
        const data = await AsyncStorage.getItem('expenses');
        const expenses = data ? JSON.parse(data) : [];
        const filtered = filterByDateRange(expenses, selectedRange);
        const totals = aggregateByCategory(filtered);
        setCategoryData(totals);
    };

    useEffect(() => {
        loadExpenses();
    }, [selectedRange, currency]);

    useFocusEffect(
        useCallback(() => {
            loadExpenses();
        }, [])
    );

    const filterByDateRange = (expenses, range) => {
        const now = new Date();
        return expenses.filter((e) => {
            const date = new Date(e.date);
            if (range === 'Week') {
                const start = new Date(now);
                start.setDate(now.getDate() - now.getDay());
                start.setHours(0, 0, 0, 0);
                return date >= start && date <= now;
            } else if (range === 'Month') {
                return (
                    date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear()
                );
            } else if (range === 'All Time') {
                return true;
            }
            return true;
        });
    };

    const aggregateByCategory = (expenses) => {
        const map = {};
        let total = 0;
        expenses.forEach((e) => {
            const key = e.category || 'others';
            map[key] = (map[key] || 0) + parseFloat(e.amount);
            total += parseFloat(e.amount);
        });
        return Object.entries(map).map(([cat, amount]) => ({
            category: cat,
            label: categoryLabels[cat] || 'Other',
            icon: categoryIcons[cat] || categoryIcons['others'],
            amount,
            percent: total ? (amount / total) * 100 : 0,
        })).sort((a, b) => b.amount - a.amount);
    };

    return (
        <View style={styles.container}>

            {/* Tabs */}
            <View style={styles.tabs}>
                {['Week', 'Month', 'All Time'].map((range) => (
                    <TouchableOpacity
                        key={range}
                        style={[styles.tab, selectedRange === range && styles.activeTab]}
                        onPress={() => setSelectedRange(range)}
                    >
                        <Text style={[styles.tabText, selectedRange === range && styles.activeTabText]}>
                            {range}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.subheader}>
                {selectedRange === 'All Time' ? 'All Time' : `This ${selectedRange}`}
            </Text>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {categoryData.map((item) => (
                    <View key={item.category} style={styles.categoryCard}>
                        <View style={[styles.iconCircle, { backgroundColor: categoryColors[item.category] || '#ccc' }]}>
                            {categoryIcons[item.category] || categoryIcons['others']}
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>{item.label}</Text>
                            <Text style={styles.amount}>{currencyFormat.format(Number(item.amount.toFixed(2)))}</Text>
                            <View style={styles.progressBackground}>
                                <View style={[styles.progressBar, { width: `${item.percent.toFixed(2)}%` }]} />
                            </View>
                        </View>
                        <Text style={styles.percent}>{item.percent.toFixed(2)}%</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const getCategoryStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme === 'dark' ? '#1c1c1e' : '#fff',
            padding: 16,
            paddingTop: 40,
        },
        header: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 12,
            color: theme === 'dark' ? '#e0e0e0' : '#000',
        },
        tabs: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 16,
        },
        tab: {
            paddingVertical: 8,
            paddingHorizontal: 20,
            borderRadius: 20,
            backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f1f1f1',
        },
        iconCircle: {
            width: 38,
            height: 38,
            borderRadius: 19,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        activeTab: {
            backgroundColor: theme === 'dark' ? '#2c2c2c' : '#fff',
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
        },
        tabText: {
            fontSize: 14,
            color: theme === 'dark' ? '#e0e0e0' : '#333',
        },
        activeTabText: {
            fontWeight: 'bold',
        },
        subheader: {
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 8,
            color: theme === 'dark' ? '#e0e0e0' : '#000',
        },
        categoryCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme === 'dark' ? '#2c2c2e' : '#f9f9f9',
            borderRadius: 12,
            padding: 14,
            marginBottom: 12,
        },
        iconBox: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme === 'dark' ? '#2c2c2c' : '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#333' : '#e0e0e0',
        },
        label: {
            fontSize: 15,
            fontWeight: '500',
            color: theme === 'dark' ? '#f0f0f0' : '#000',
        },
        amount: {
            fontSize: 13,
            color: theme === 'dark' ? '#cccccc' : '#555',
            marginBottom: 4,
        },
        progressBackground: {
            height: 6,
            backgroundColor: theme === 'dark' ? '#2c2c2c' : '#e0e0e0',
            borderRadius: 4,
            overflow: 'hidden',
        },
        progressBar: {
            height: 6,
            backgroundColor: '#007bff',
        },
        percent: {
            fontWeight: 'bold',
            color: theme === 'dark' ? '#dddddd' : '#333',
            marginLeft: 8,
        },
    });


export default SpendingByCategory;
