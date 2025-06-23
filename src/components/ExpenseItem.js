import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    FlatList
} from 'react-native'
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import React, { useContext, useState } from 'react'
import { UserPreferencesContext } from '../context/UserPreferences';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const ExpenseItem = ({ expenses, setExpenses, filteredExpenses, expandedItemId, setExpandedItemId }) => {
    const { theme, currency } = useContext(UserPreferencesContext);
    const navigation = useNavigation();
    const styles = getStyles(theme);
    const currencyFormat = new Intl.NumberFormat(currency === "INR" ? 'en-IN' : 'en-US', {
        style: 'currency',
        currency: currency
    })

    const renderItem = ({ item }) => {
        const isExpanded = expandedItemId === item.id;

        return (
            <View style={{ marginBottom: 10 }}>
                <TouchableWithoutFeedback onPress={() => setExpandedItemId(isExpanded ? null : item.id)}>
                    <View style={[styles.itemContainer, isExpanded && styles.expandedContainer]}>
                        <View style={[styles.iconCircle, { backgroundColor: categoryColors[item.category] || '#ccc' }]}>
                            {categoryIcons[item.category] || categoryIcons['others']}
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.expenseTitle}>{item.name}</Text>
                            <Text style={styles.expenseSubtitle}>
                                {item.category.charAt(0).toUpperCase() + item.category.slice(1)} • {new Date(item.date).toDateString().slice(4)}
                            </Text>
                            {isExpanded && item.notes ? <Text style={styles.expenseNotes}>{item.notes}</Text> : null}
                            {isExpanded && (
                                <View style={styles.rowActions}>
                                    <TouchableOpacity
                                        style={[styles.actionBtn, { backgroundColor: '#3498db' }]}
                                        onPress={() => {
                                            setExpandedItemId(null);
                                            navigation.navigate('AddExpense', { expense: item });
                                        }}
                                    >
                                        <Text style={styles.actionText}>Edit</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.actionBtn, { backgroundColor: '#e74c3c' }]}
                                        onPress={async () => {
                                            const updated = expenses.filter(e => e.id !== item.id);
                                            await AsyncStorage.setItem('expenses', JSON.stringify(updated));
                                            setExpenses(updated);
                                            setExpandedItemId(null);
                                        }}
                                    >
                                        <Text style={styles.actionText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                        <Text style={styles.amount}>-{currencyFormat.format(parseFloat(item.amount).toFixed(2))}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    };
    return (
        <FlatList
            data={filteredExpenses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80 }}
        />
    );
};

export default ExpenseItem;

const getStyles = (theme) =>
    StyleSheet.create({
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