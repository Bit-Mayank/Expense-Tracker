// HomePage.js
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { UserPreferencesContext } from '../context/UserPreferences';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

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

const HomePage = () => {
    const navigation = useNavigation();
    const [expenses, setExpenses] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const { currency, theme } = useContext(UserPreferencesContext);
    const chartConfig = getChartConfig(theme);
    const styles = getStyles(theme);



    const currencyFormat = new Intl.NumberFormat(currency === "INR" ? 'en-IN' : 'en-US', {
        style: 'currency',
        currency: currency
    })


    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        const storedData = await AsyncStorage.getItem('expenses');
        const parsed = storedData ? JSON.parse(storedData) : [];
        const cleaned = parsed.filter(e => !isNaN(parseFloat(e.amount)) && isFinite(parseFloat(e.amount)));
        setExpenses(cleaned);
        prepareCategoryData(cleaned);
        prepareWeeklyData(cleaned);
    };

    const prepareCategoryData = (data) => {
        const categoryTotals = {};
        data.forEach((item) => {
            const amount = parseFloat(item.amount);
            if (!isNaN(amount) && isFinite(amount)) {
                categoryTotals[item.category] = (categoryTotals[item.category] || 0) + amount;
            }
        });

        const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
        if (total === 0) return setCategoryData([]);

        const result = Object.entries(categoryTotals).map(([key, val]) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            population: val,
            color: chartColors[key] || '#ccc',
            legendFontColor: chartColors[key] || '#ccc',
            legendFontSize: 12,
        }));

        setCategoryData(result);
    };

    const prepareWeeklyData = (data) => {
        const now = new Date();
        const weekDays = [...Array(7)].map((_, i) => {
            const d = new Date(now);
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        const dailyTotals = weekDays.map((day) => {
            const total = data
                .filter((e) => e.date && e.date.startsWith(day))
                .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
            return isNaN(total) ? 0 : total;
        });

        setWeeklyData(dailyTotals);
    };

    const totalSpending = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const recentTransactions = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    return (
        <View style={{ flex: 1, }}>
            <ScrollView style={[styles.container]}>
                <Text style={styles.header}>Total Spending Overview</Text>
                <View style={styles.card}>
                    <Text style={styles.subLabel}>Current Month</Text>
                    <Text style={styles.amount}>
                        {currencyFormat.format(Number(totalSpending.toFixed(2)))}
                    </Text>
                </View>

                <Text style={styles.header}>Spending by Category</Text>
                <View style={styles.chartCard}>
                    {categoryData.length > 0 ? (
                        <PieChart
                            data={categoryData}
                            width={screenWidth - 32}
                            height={180}
                            chartConfig={chartConfig}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="15"
                        />
                    ) : (
                        <Text style={styles.empty}>No data</Text>
                    )}
                </View>

                {weeklyData.length > 0 && (
                    <View>
                        <Text style={styles.header}>Spending Trend</Text>
                        <View style={styles.chartCard}>
                            <Text style={styles.subLabel}>Weekly Spending</Text>
                            <LineChart
                                data={{
                                    labels: [...Array(7)].map((_, i) => `D${i + 1}`),
                                    datasets: [{ data: weeklyData }],
                                }}
                                width={screenWidth - 32}
                                height={180}
                                chartConfig={chartConfig}
                                bezier
                            />
                        </View>
                    </View>
                )}

                <View style={{ marginBottom: 50 }}>
                    <Text style={styles.header}>Recent Transactions</Text>
                    {recentTransactions.map((item) => (
                        <View key={item.id} style={[styles.transaction]}>
                            <View style={[styles.iconCircle, { backgroundColor: categoryColors[item.category] || '#ccc' }]}>
                                {categoryIcons[item.category] || categoryIcons['others']}
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.txLabel}>{item.name || item.category}</Text>
                                <Text style={styles.txCategory}>{item.category}</Text>
                            </View>
                            <Text style={styles.txAmount}>
                                -{currencyFormat.format(Number(parseFloat(item.amount || 0).toFixed(2)))}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddExpense')}
            >
                <AntDesign name="plus" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const chartColors = {
    food: '#e74c3c',
    transport: '#3498db',
    shopping: '#1abc9c',
    entertainment: '#9b59b6',
    utilities: '#f39c12',
    others: '#7f8c8d',
};

const getChartConfig = (theme) => ({
    backgroundGradientFrom: theme === "dark" ? "#121212" : "#fff",
    backgroundGradientTo: theme === "dark" ? "#121212" : "#fff",
    color: (opacity = 1) => theme === 'dark'
        ? `rgba(255, 255, 255, ${opacity})`
        : `rgba(0, 123, 255, ${opacity})`,
    labelColor: (opacity = 1) => theme === 'dark'
        ? `rgba(255, 255, 255, ${opacity})`
        : `rgba(0, 0, 0, ${opacity})`,
    decimalPlaces: 2,
});

const getStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme === 'dark' ? '#1c1c1e' : '#ffffff',
            padding: 16,
        },
        header: {
            fontSize: 18,
            fontWeight: 'bold',
            marginTop: 35,
            marginBottom: 8,
            color: theme === 'dark' ? '#f2f2f7' : '#000000',
        },
        card: {
            backgroundColor: theme === 'dark' ? '#2c2c2e' : '#f1f1f1',
            padding: 16,
            borderRadius: 12,
        },
        subLabel: {
            color: theme === 'dark' ? '#a1a1aa' : '#555555',
            marginBottom: 4,
        },
        amount: {
            fontWeight: 'bold',
            fontSize: 16,
            color: '#e74c3c',
        },
        chartCard: {
            backgroundColor: theme === 'dark' ? '#2a2a2d' : '#f5f5f5',
            borderRadius: 12,
            padding: 12,
            alignItems: 'center',
            marginBottom: 16,
        },
        transaction: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme === 'dark' ? '#2c2c2e' : '#fff',
            padding: 14,
            borderRadius: 12,
            elevation: 1,
            marginBottom: 10
        },
        textContainer: {
            flex: 1,
        },
        txLabel: {
            fontSize: 16,
            fontWeight: '600',
            color: theme === 'dark' ? '#f2f2f7' : '#000000',
        },
        txCategory: {
            fontSize: 13,
            color: theme === 'dark' ? '#b0b0b8' : '#888888',
        },
        txAmount: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#e74c3c',
        },
        empty: {
            color: theme === 'dark' ? '#a9a9b1' : '#999999',
            fontSize: 14,
        },
        fab: {
            position: 'absolute',
            bottom: 50,
            right: 20,
            backgroundColor: '#007bff',
            borderRadius: 30,
            width: 56,
            height: 56,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 4,
        },
        iconCircle: {
            width: 38,
            height: 38,
            borderRadius: 19,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
    });



export default HomePage;