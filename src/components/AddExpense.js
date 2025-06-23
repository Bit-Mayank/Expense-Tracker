import React, { useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
    Alert,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferencesContext } from '../context/UserPreferences';

const categories = [
    { label: 'Food', value: 'food', color: '#e74c3c' },
    { label: 'Transport', value: 'transport', color: '#3498db' },
    { label: 'Entertainment', value: 'entertainment', color: '#9b59b6' },
    { label: 'Utilities', value: 'utilities', color: '#f39c12' },
    { label: 'Shopping', value: 'shopping', color: '#1abc9c' },
    { label: 'Others', value: 'others', color: '#7f8c8d' },
];

const validationSchema = Yup.object().shape({
    amount: Yup.number()
        .typeError('Amount must be a number')
        .positive('Amount must be positive')
        .required('Amount is required'),
    date: Yup.date().required('Date is required'),
    category: Yup.string().required('Category is required'),
    name: Yup.string().required('Name is required'),
    notes: Yup.string(),
});

const AddExpense = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const editingExpense = route.params?.expense;
    const [showDatePicker, setShowDatePicker] = React.useState(false);
    const { theme } = useContext(UserPreferencesContext)
    const styles = getStyles(theme);


    const saveExpense = async (newExpense) => {
        try {
            const storedData = await AsyncStorage.getItem('expenses');
            let expenses = storedData ? JSON.parse(storedData) : [];

            if (editingExpense) {
                expenses = expenses.map(exp =>
                    exp.id === editingExpense.id ? newExpense : exp
                );
            } else {
                expenses.push(newExpense);
            }

            await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
            Alert.alert('Success', editingExpense ? 'Expense updated' : 'Expense saved');
        } catch (error) {
            console.error('Error saving expense:', error);
            Alert.alert('Error', 'Failed to save expense');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Formik
                        initialValues={{
                            amount: editingExpense?.amount?.toString() || '',
                            date: editingExpense?.date ? new Date(editingExpense.date) : new Date(),
                            category: editingExpense?.category || '',
                            name: editingExpense?.name || '',
                            notes: editingExpense?.notes || '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => {
                            const newExpense = {
                                id: editingExpense?.id || Date.now(),
                                ...values,
                            };
                            saveExpense(newExpense);
                            resetForm();
                        }}
                    >
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            setFieldValue,
                            values,
                            errors,
                            touched,
                        }) => (
                            <>
                                <Text style={styles.label}>Name*</Text>
                                <TextInput
                                    placeholder="Enter expense name"
                                    style={styles.input}
                                    onChangeText={handleChange('name')}
                                    onBlur={handleBlur('name')}
                                    value={values.name}
                                    placeholderTextColor={theme === 'dark' ? '#aaa' : '#888'}
                                />
                                {touched.name && errors.name && (
                                    <Text style={styles.error}>{errors.name}</Text>
                                )}

                                <Text style={styles.label}>Amount*</Text>
                                <TextInput
                                    placeholder="Amount"
                                    keyboardType="numeric"
                                    style={styles.input}
                                    onChangeText={handleChange('amount')}
                                    onBlur={handleBlur('amount')}
                                    value={values.amount}
                                    placeholderTextColor={theme === 'dark' ? '#aaa' : '#888'}
                                />
                                {touched.amount && errors.amount && (
                                    <Text style={styles.error}>{errors.amount}</Text>
                                )}

                                <Text style={styles.label}>Date*</Text>
                                <TouchableOpacity
                                    onPress={() => setShowDatePicker(true)}
                                    style={styles.input}
                                >
                                    <Text>{values.date.toDateString()}</Text>
                                </TouchableOpacity>
                                {touched.date && errors.date && (
                                    <Text style={styles.error}>{errors.date}</Text>
                                )}
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={values.date}
                                        mode="date"
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                            setShowDatePicker(false);
                                            if (selectedDate) {
                                                setFieldValue('date', selectedDate);
                                            }
                                        }}
                                        themeVariant={theme === 'dark' ? 'dark' : 'light'}  // 👈 Add this line
                                    />

                                )}

                                <Text style={styles.label}>Category*</Text>
                                <View style={styles.categoryContainer}>
                                    {categories.map((cat) => {
                                        const isSelected = values.category === cat.value;
                                        return (
                                            <TouchableOpacity
                                                key={cat.value}
                                                style={[
                                                    styles.categoryItem,
                                                    {
                                                        backgroundColor: isSelected
                                                            ? cat.color
                                                            : theme === 'dark'
                                                                ? '#2a2a2a'
                                                                : '#ecf0f1',
                                                    },
                                                ]}
                                                onPress={() => setFieldValue('category', cat.value)}
                                            >
                                                <Text
                                                    style={{
                                                        color: isSelected
                                                            ? '#fff'
                                                            : theme === 'dark'
                                                                ? '#ddd'
                                                                : '#2c3e50',
                                                    }}
                                                >
                                                    {cat.label}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}

                                </View>
                                {touched.category && errors.category && (
                                    <Text style={styles.error}>{errors.category}</Text>
                                )}

                                <Text style={styles.label}>Notes</Text>
                                <TextInput
                                    placeholder="Notes (optional)"
                                    style={[styles.input, { height: 80 }]}
                                    multiline
                                    onChangeText={handleChange('notes')}
                                    onBlur={handleBlur('notes')}
                                    value={values.notes}
                                    placeholderTextColor={theme === 'dark' ? '#aaa' : '#888'}
                                />

                                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                    <Text style={styles.buttonText}>
                                        {editingExpense ? 'Update Expense' : 'Save Expense'}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </Formik>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const getStyles = (theme) =>
    StyleSheet.create({
        container: {
            padding: 20,
            backgroundColor: theme === 'dark' ? '#1c1c1e' : '#fff',
            paddingBottom: 40,
        },
        input: {
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#555' : '#ccc',
            backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000',
            padding: 12,
            borderRadius: 8,
            marginBottom: 10,
        },
        error: {
            color: 'red',
            marginBottom: 10,
        },
        label: {
            fontWeight: 'bold',
            marginVertical: 8,
            fontSize: 18,
            color: theme === 'dark' ? '#fff' : '#000',
        },
        categoryContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 10,
        },
        categoryItem: {
            padding: 10,
            borderRadius: 20,
            marginRight: 8,
            marginBottom: 8,
            backgroundColor: theme === 'dark' ? '#2c2c2c' : '#f1f1f1',
        },
        button: {
            backgroundColor: '#007bff',
            padding: 14,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 20,
        },
        buttonText: {
            color: '#fff',
            fontWeight: 'bold',
        },
    });


export default AddExpense;