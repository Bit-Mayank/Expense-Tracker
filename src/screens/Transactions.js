import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { UserPreferencesContext } from '../context/UserPreferences';
import ExpenseItem from '../components/ExpenseItem';
import AsyncStorage from '@react-native-async-storage/async-storage';

const categoryOptions = [
    'All', 'food', 'transport', 'entertainment', 'shopping', 'utilities', 'others',
];

const dateOptions = ['All', 'Today', 'This Week', 'This Month'];

const TransactionPage = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [dateRange, setDateRange] = useState('All');
    const [expandedItemId, setExpandedItemId] = useState(null);
    const { theme } = useContext(UserPreferencesContext);
    const styles = getStyles(theme);
    const navigation = useNavigation();


    useEffect(() => {
        const loadExpenses = async () => {
            const data = await AsyncStorage.getItem('expenses');
            if (data) {
                const parsed = JSON.parse(data);
                setExpenses(parsed.reverse());
            }
        };
        const unsubscribe = navigation.addListener('focus', loadExpenses);
        return unsubscribe;
    }, [navigation]);

    const filterByDateRange = (expenseDate) => {
        const now = new Date();
        const expDate = new Date(expenseDate);
        switch (dateRange) {
            case 'Today':
                return expDate.toDateString() === now.toDateString();
            case 'This Week': {
                const today = new Date();
                const startOfWeek = new Date(today); // make a copy to avoid mutation
                const day = startOfWeek.getDay(); // 0 (Sunday) to 6 (Saturday)
                const diffToMonday = day === 0 ? 6 : day - 1; // if Sunday, go back 6 days
                startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);
                startOfWeek.setHours(0, 0, 0, 0); // reset time

                return expDate >= startOfWeek;
            }

            case 'This Month':
                return (
                    expDate.getMonth() === now.getMonth() &&
                    expDate.getFullYear() === now.getFullYear()
                );
            default:
                return true;
        }
    };

    const filteredExpenses = expenses.filter((item) => {
        const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
        const matchesDate = filterByDateRange(item.date);
        return matchesSearch && matchesCategory && matchesDate;
    });



    return (
        <TouchableWithoutFeedback onPress={() => setExpandedItemId(null)}>
            <View style={styles.container}>
                <TextInput
                    placeholder="Search expenses..."
                    style={styles.searchBar}
                    value={searchQuery}
                    placeholderTextColor={theme === 'dark' ? '#aaa' : '#888'}
                    onChangeText={setSearchQuery}
                />

                <View style={styles.filters}>
                    <TouchableOpacity
                        style={styles.filterBtn}
                        onPress={() => {
                            const current = categoryOptions.indexOf(selectedCategory || 'All');
                            const next = (current + 1) % categoryOptions.length;
                            setSelectedCategory(categoryOptions[next] === 'All' ? null : categoryOptions[next]);
                        }}
                    >
                        <Text style={styles.filterText}>
                            {selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : 'Category ▾'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.filterBtn}
                        onPress={() => {
                            const current = dateOptions.indexOf(dateRange);
                            const next = (current + 1) % dateOptions.length;
                            setDateRange(dateOptions[next]);
                        }}
                    >
                        <Text style={styles.filterText}>{dateRange} ▾</Text>
                    </TouchableOpacity>
                </View>

                <ExpenseItem expenses={expenses} setExpenses={setExpenses} filteredExpenses={filteredExpenses} setExpandedItemId={setExpandedItemId} expandedItemId={expandedItemId} />

                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('AddExpense')}
                >
                    <Ionicons name="add" size={24} color="#fff" />
                    <Text style={styles.fabText}>Add Expense</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

const getStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme === 'dark' ? '#1c1c1e' : '#f9f9f9',
            paddingHorizontal: 16,
            paddingTop: 40,
        },
        header: {
            fontSize: 22,
            fontWeight: '600',
            marginBottom: 12,
            color: theme === 'dark' ? '#f2f2f7' : '#000',
        },
        searchBar: {
            backgroundColor: theme === 'dark' ? '#2c2c2e' : '#f1f1f1',
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 10,
            fontSize: 16,
            marginBottom: 12,
            color: theme === 'dark' ? '#fff' : '#000',
        },
        filters: {
            flexDirection: 'row',
            gap: 8,
            marginBottom: 16,
        },
        filterBtn: {
            backgroundColor: theme === 'dark' ? '#2c2c2e' : '#fff',
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#3a3a3c' : '#e0e0e0',
        },
        filterText: {
            fontSize: 14,
            color: theme === 'dark' ? '#f2f2f7' : '#333',
        },
        itemContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme === 'dark' ? '#2c2c2e' : '#fff',
            padding: 14,
            borderRadius: 12,
            elevation: 1,
        },
        expandedContainer: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingBottom: 12,
        },
        iconCircle: {
            width: 38,
            height: 38,
            borderRadius: 19,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        textContainer: {
            flex: 1,
        },
        expenseTitle: {
            fontSize: 16,
            fontWeight: '500',
            color: theme === 'dark' ? '#fff' : '#000',
        },
        expenseSubtitle: {
            color: theme === 'dark' ? '#999' : '#777',
            fontSize: 13,
            marginTop: 2,
        },
        expenseNotes: {
            color: theme === 'dark' ? '#ccc' : '#444',
            fontSize: 12,
            marginTop: 6,
            marginBottom: 4,
        },
        amount: {
            fontWeight: 'bold',
            fontSize: 16,
            color: '#e74c3c',
        },
        fab: {
            position: 'absolute',
            bottom: 20,
            alignSelf: 'center',
            backgroundColor: '#007bff',
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 30,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            elevation: 3,
        },
        fabText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
        },
        rowActions: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            gap: 10,
            marginTop: 8,
        },
        actionBtn: {
            paddingVertical: 6,
            paddingHorizontal: 14,
            borderRadius: 20,
        },
        actionText: {
            color: '#fff',
            fontSize: 14,
        },
    });


export default TransactionPage;