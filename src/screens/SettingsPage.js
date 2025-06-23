// SettingsPage.js
import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    Switch,
    StyleSheet,
    TouchableOpacity,
    Modal,
    FlatList,
    Pressable
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferencesContext } from '../context/UserPreferences';


const SettingsPage = () => {

    const { theme, setTheme, currency, setCurrency } = useContext(UserPreferencesContext);
    const [modalVisible, setModalVisible] = useState(false);
    const styles = getStyles(theme);


    const toggleTheme = () => {
        if (theme === "light")
            setTheme("dark");
        else
            setTheme("light");
    };

    const exportData = async () => {
        try {
            const storedData = await AsyncStorage.getItem('expenses');
            const expenses = storedData ? JSON.parse(storedData) : [];

            if (!expenses.length) {
                alert('No expense data to export.');
                return;
            }

            const header = 'Date,Amount,Category,Notes\n';
            const csvRows = expenses.map(
                e => `${e.date},${e.amount},${e.category},"${(e.notes || '').replace(/"/g, '""')}"`
            );
            const csvContent = header + csvRows.join('\n');

            const fileUri = FileSystem.documentDirectory + 'expenses.csv';
            await FileSystem.writeAsStringAsync(fileUri, csvContent, {
                encoding: FileSystem.EncodingType.UTF8,
            });

            await Sharing.shareAsync(fileUri);
        } catch (err) {
            console.error('Error exporting data:', err);
            alert('Failed to export data.');
        }
    };



    const currencyOptions = [
        { label: 'USD - US Dollar', code: 'USD' },
        { label: 'INR - Indian Rupee', code: 'INR' },
        { label: 'EUR - Euro', code: 'EUR' },
        { label: 'JPY - Japanese Yen', code: 'JPY' },
        { label: 'GBP - British Pound', code: 'GBP' },
    ];

    const changeCurrency = () => {
        setModalVisible(true);
    };

    const selectCurrency = (code) => {
        setCurrency(code);
        setModalVisible(false);
    };


    return (
        <View style={styles.container}>
            {/* Appearance Section */}
            <Text style={styles.sectionHeader}>Appearance</Text>
            <View style={styles.rowBetween}>
                <View>
                    <Text style={styles.label}>Theme</Text>
                    <Text style={styles.subLabel}>{theme}</Text>
                </View>
                <Switch
                    value={theme === "dark"}
                    onValueChange={toggleTheme}
                />
            </View>

            {/* Data Management Section */}
            <Text style={styles.sectionHeader}>Data Management</Text>
            <TouchableOpacity style={styles.rowBetween} onPress={exportData}>
                <Text style={styles.label}>Export Data</Text>
                <Text style={styles.link}>{'>'}</Text>
            </TouchableOpacity>

            {/* Preferences Section */}
            <Text style={styles.sectionHeader}>Preferences</Text>
            <TouchableOpacity style={styles.rowBetween} onPress={changeCurrency}>
                <Text style={styles.label}>Currency</Text>
                <Text style={styles.link}>{currency} {'>'}</Text>
            </TouchableOpacity>

            <Modal
                transparent
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select Currency</Text>
                        <FlatList
                            data={currencyOptions}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={styles.modalItem}
                                    onPress={() => selectCurrency(item.code)}
                                >
                                    <Text style={styles.modalText}>{item.label}</Text>
                                </Pressable>
                            )}
                        />
                        <Pressable onPress={() => setModalVisible(false)}>
                            <Text style={[styles.modalText, { textAlign: 'center', color: 'red', marginTop: 10 }]}>
                                Cancel
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

const getStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme === 'dark' ? '#1c1c1e' : '#f9f9f9',
            padding: 16,
        },
        sectionHeader: {
            fontSize: 14,
            fontWeight: 'bold',
            color: theme === 'dark' ? '#aaa' : '#666',
            marginTop: 20,
            marginBottom: 10,
        },
        rowBetween: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: theme === 'dark' ? '#333' : '#eee',
        },
        label: {
            fontSize: 16,
            color: theme === 'dark' ? '#fff' : '#222',
        },
        subLabel: {
            fontSize: 13,
            color: theme === 'dark' ? '#ccc' : '#888',
        },
        link: {
            fontSize: 16,
            color: '#007bff',
        },
        modalOverlay: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
        },
        modalContainer: {
            backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
            marginHorizontal: 32,
            borderRadius: 10,
            padding: 20,
            elevation: 5,
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            textAlign: 'center',
            color: theme === 'dark' ? '#fff' : '#000',
        },
        modalItem: {
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderColor: theme === 'dark' ? '#333' : '#eee',
        },
        modalText: {
            fontSize: 16,
            color: theme === 'dark' ? '#fff' : '#000',
        },
    });


export default SettingsPage;
