import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import * as Yup from 'yup';
import {Formik} from 'formik';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const PasswordSchema = Yup.object().shape({
  passwordLength: Yup.number()
    .min(4, 'Should be min of 4 characters')
    .max(16, 'Should be max of 16 characters')
    .required('Length is required'),
});

const App = () => {
  const [password, setPassword] = useState('');
  const [isPassGenerated, setIsPassGenerated] = useState(false);
  const [options, setOptions] = useState({
    number: false,
    symbols: false,
    lowercase: true,
    uppercase: false,
  });

  const generatePassword = passwordLength => {
    let characterList = '';
    if (options.uppercase) characterList += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.lowercase) characterList += 'abcdefghijklmnopqrstuvwxyz';
    if (options.number) characterList += '0123456789';
    if (options.symbols) characterList += '!@#$%^&*()_+';

    if (!characterList) return;

    let result = '';
    for (let i = 0; i < passwordLength; i++) {
      const characterIndex = Math.floor(Math.random() * characterList.length);
      result += characterList.charAt(characterIndex);
    }

    setPassword(result);
    setIsPassGenerated(true);
  };

  const resetPasswordState = () => {
    setIsPassGenerated(false);
    setOptions({
      number: false,
      symbols: false,
      lowercase: true,
      uppercase: false,
    });
    setPassword('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Password Generator</Text>
      </View>
      <Formik
        initialValues={{passwordLength: ''}}
        validationSchema={PasswordSchema}
        onSubmit={values => generatePassword(+values.passwordLength)}>
        {({values, errors, touched, handleChange, handleSubmit}) => (
          <>
            <View style={styles.inputWrapper}>
              <Text style={styles.heading}>Password Length</Text>
              {touched.passwordLength && errors.passwordLength && (
                <Text style={styles.errorText}>{errors.passwordLength}</Text>
              )}
              <TextInput
                style={styles.inputStyle}
                value={values.passwordLength}
                onChangeText={handleChange('passwordLength')}
                placeholder="Ex. 8"
                keyboardType="numeric"
              />
            </View>
            {['lowercase', 'uppercase', 'number', 'symbols'].map(key => (
              <View key={key} style={styles.inputWrapper}>
                <Text style={styles.inputText}>Include {key}:</Text>
                <BouncyCheckbox
                  isChecked={options[key]}
                  onPress={() => setOptions({...options, [key]: !options[key]})}
                  fillColor="#29AB87"
                />
              </View>
            ))}
            <View style={styles.formActions}>
              <TouchableOpacity onPress={handleSubmit}>
                <Text style={styles.btnPassword}>Generate Password</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={resetPasswordState}>
                <Text style={styles.btnReset}>Reset</Text>
              </TouchableOpacity>
            </View>
            {isPassGenerated && (
              <View style={styles.generatedPasswordContainer}>
                <Text style={styles.generatedPassword}>{password}</Text>
              </View>
            )}
          </>
        )}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white', margin: 30, borderRadius: 20},
  formContainer: {margin: 20},
  title: {fontSize: 22, fontWeight: '800', textAlign: 'center'},
  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    paddingTop: 10,
    gap: 10,
  },
  inputStyle: {flex: 1, backgroundColor: 'black', padding: 15, color: 'white'},
  formActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 15,
    gap: 20,
  },
  heading: {fontSize: 18},
  btnPassword: {
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
    color: 'white',
  },
  btnReset: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    color: 'white',
  },
  errorText: {color: 'red', fontSize: 12},
  generatedPasswordContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#dfd7be',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  generatedPassword: {fontSize: 18, fontWeight: 'bold', color: 'black'},
});

export default App;
