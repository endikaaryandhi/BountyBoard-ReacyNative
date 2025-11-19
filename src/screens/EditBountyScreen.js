import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { API_URL } from '../config/api';
import { supabase } from '../config/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function EditBountyScreen({ route, navigation }) {
  const { id } = route.params;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageUri, setImageUri] = useState(null);
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

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadImage = async () => {
    if (!imageUri) return formData.image_url;

    try {
      const ext = imageUri.substring(imageUri.lastIndexOf('.') + 1);
      const fileName = `bounty-${Date.now()}.${ext}`;
      
      const formDataUpload = new FormData();
      formDataUpload.append('file', {
        uri: imageUri,
        name: fileName,
        type: `image/${ext}`
      });

      const { error } = await supabase.storage
        .from('avatars')
        .upload(fileName, formDataUpload, { contentType: `image/${ext}` });

      if (error) throw error;

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      throw new Error('Image upload failed');
    }
  };

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      let finalImageUrl = formData.image_url;
      if (imageUri) {
        finalImageUrl = await uploadImage();
      }

      await axios.put(`${API_URL}/${id}`, { ...formData, image_url: finalImageUrl });
      
      Alert.alert('Success', 'Dossier updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
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
        
        <View style={styles.imageSection}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            <Image 
              source={{ uri: imageUri || formData.image_url || 'https://placehold.co/400x500' }} 
              style={styles.imagePreview} 
            />
            <View style={styles.editOverlay}>
              <Ionicons name="camera" size={20} color="#F5E6C8" />
            </View>
          </TouchableOpacity>
        </View>

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

        <Text style={styles.label}>Description</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          value={formData.description} 
          onChangeText={v => handleChange('description', v)} 
          multiline={true} 
          numberOfLines={4} 
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#F5E6C8" />
          ) : (
            <Text style={styles.buttonText}>SAVE CHANGES</Text>
          )}
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
  imageSection: { alignItems: 'center', marginBottom: 20 },
  imageContainer: { width: 120, height: 160, backgroundColor: '#D7CCC8', borderWidth: 2, borderColor: '#5D4037', overflow: 'hidden', position: 'relative' },
  imagePreview: { width: '100%', height: '100%' },
  editOverlay: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#5D4037', padding: 6, borderTopLeftRadius: 8 },
  label: { color: '#5D4037', fontWeight: 'bold', marginBottom: 5, fontSize: 12, textTransform: 'uppercase' },
  input: { backgroundColor: 'rgba(93, 64, 55, 0.1)', borderBottomWidth: 2, borderBottomColor: '#5D4037', marginBottom: 15, padding: 8, color: '#5D4037', fontWeight: 'bold' },
  textArea: { height: 80, textAlignVertical: 'top' },
  button: { backgroundColor: '#5D4037', padding: 15, alignItems: 'center', marginTop: 10, elevation: 3 },
  buttonText: { color: '#F5E6C8', fontWeight: 'bold', letterSpacing: 1 }
});