import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config/api';

export default function EditBountyScreen({ route, navigation }) {
  const { id } = route.params;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', alias: '', crime: '', bounty_amount: '', last_seen: '', description: '', image_url: ''
  });

  useEffect(() => {
    axios.get(`${API_URL}/${id}`)
      .then(res => {
        setFormData(res.data);
        setLoading(false);
      })
      .catch(() => {
        Alert.alert('Error', 'Failed to load data');
        navigation.goBack();
      });
  }, [id]);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await axios.put(`${API_URL}/${id}`, formData);
      Alert.alert('Success', 'Dossier updated');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#F5E6C8" /></View>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formCard}>
        <Text style={styles.title}>EDIT DOSSIER</Text>
        
        <Text style={styles.label}>Target Name</Text>
        <TextInput style={styles.input} value={formData.name} onChangeText={v => handleChange('name', v)} />

        <Text style={styles.label}>Alias</Text>
        <TextInput style={styles.input} value={formData.alias} onChangeText={v => handleChange('alias', v)} />

        <Text style={styles.label}>Crime</Text>
        <TextInput style={styles.input} value={formData.crime} onChangeText={v => handleChange('crime', v)} />

        <Text style={styles.label}>Reward Amount ($)</Text>
        <TextInput style={styles.input} value={String(formData.bounty_amount)} onChangeText={v => handleChange('bounty_amount', v)} keyboardType="numeric" />

        <Text style={styles.label}>Last Seen Location</Text>
        <TextInput style={styles.input} value={formData.last_seen} onChangeText={v => handleChange('last_seen', v)} />

        <Text style={styles.label}>Image URL</Text>
        <TextInput style={styles.input} value={formData.image_url} onChangeText={v => handleChange('image_url', v)} />

        <Text style={styles.label}>Description</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          value={formData.description} 
          onChangeText={v => handleChange('description', v)} 
          multiline={true} 
          numberOfLines={4} 
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={submitting}>
          <Text style={styles.buttonText}>{submitting ? 'UPDATING...' : 'SAVE CHANGES'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2e2622', padding: 16 },
  center: { flex: 1, backgroundColor: '#2e2622', justifyContent: 'center', alignItems: 'center' },
  formCard: { backgroundColor: '#F5E6C8', padding: 20, borderRadius: 4, borderWidth: 4, borderColor: '#5D4037', marginBottom: 40 },
  title: { fontSize: 24, fontWeight: '900', color: '#5D4037', textAlign: 'center', marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#5D4037', paddingBottom: 10 },
  label: { color: '#5D4037', fontWeight: 'bold', marginBottom: 5, fontSize: 12, textTransform: 'uppercase' },
  input: { backgroundColor: 'rgba(93, 64, 55, 0.1)', borderBottomWidth: 2, borderBottomColor: '#5D4037', marginBottom: 15, padding: 8, color: '#5D4037', fontWeight: 'bold' },
  textArea: { height: 80, textAlignVertical: 'top' },
  button: { backgroundColor: '#5D4037', padding: 15, alignItems: 'center', marginTop: 10, elevation: 3 },
  buttonText: { color: '#F5E6C8', fontWeight: 'bold', letterSpacing: 1 }
});