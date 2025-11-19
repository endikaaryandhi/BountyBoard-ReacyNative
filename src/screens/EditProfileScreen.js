import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateProfile({ full_name: fullName, avatar_url: avatarUrl });
      Alert.alert('Success', 'ID Card Updated', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>UPDATE ID</Text>
        
        <Text style={styles.label}>Code Name (Full Name)</Text>
        <TextInput 
            style={styles.input} 
            value={fullName} 
            onChangeText={setFullName}
            placeholder="Enter your name" 
            placeholderTextColor="#8D6E63"
        />

        <Text style={styles.label}>Portrait URL</Text>
        <TextInput 
            style={styles.input} 
            value={avatarUrl} 
            onChangeText={setAvatarUrl}
            placeholder="https://..." 
            placeholderTextColor="#8D6E63"
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'PROCESSING...' : 'UPDATE CREDENTIALS'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2e2622', justifyContent: 'center', padding: 20 },
  card: { width: '100%', backgroundColor: '#F5E6C8', padding: 20, borderRadius: 4, borderWidth: 4, borderColor: '#5D4037' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#5D4037', textAlign: 'center', marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#5D4037', paddingBottom: 10 },
  label: { color: '#5D4037', fontWeight: 'bold', marginBottom: 5, fontSize: 12, textTransform: 'uppercase' },
  input: { backgroundColor: 'rgba(93, 64, 55, 0.1)', borderBottomWidth: 2, borderBottomColor: '#5D4037', marginBottom: 20, padding: 10, color: '#5D4037', fontWeight: 'bold' },
  button: { backgroundColor: '#5D4037', padding: 15, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#F5E6C8', fontWeight: 'bold' }
});