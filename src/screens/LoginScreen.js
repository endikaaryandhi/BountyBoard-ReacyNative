import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>HUNTER LOGIN</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#5D4037"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#5D4037"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'VERIFYING...' : 'ENTER GUILD'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>New Hunter? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e2622',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#F5E6C8',
    padding: 20,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: '#5D4037',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5D4037',
    textAlign: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#5D4037',
    paddingBottom: 10,
  },
  input: {
    backgroundColor: 'rgba(93, 64, 55, 0.1)',
    borderBottomWidth: 2,
    borderBottomColor: '#5D4037',
    marginBottom: 15,
    padding: 10,
    color: '#5D4037',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#5D4037',
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#F5E6C8',
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    color: '#5D4037',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});