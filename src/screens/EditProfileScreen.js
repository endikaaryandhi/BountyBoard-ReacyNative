import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || '');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadAvatar = async () => {
    if (!imageUri) return avatarUrl;

    try {
      const ext = imageUri.substring(imageUri.lastIndexOf('.') + 1);
      const fileName = `${user.id}-${Date.now()}.${ext}`;
      
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        name: fileName,
        type: `image/${ext}`
      });

      const { error } = await supabase.storage
        .from('avatars')
        .upload(fileName, formData, { contentType: `image/${ext}` });

      if (error) throw error;

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      throw new Error('Avatar upload failed');
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const finalAvatarUrl = await uploadAvatar();
      
      await updateProfile({ 
        full_name: fullName, 
        avatar_url: finalAvatarUrl 
      });

      Alert.alert('Success', 'ID Card Updated Successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>UPDATE ID</Text>
        
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            <Image 
              source={{ uri: imageUri || avatarUrl || `https://api.dicebear.com/7.x/adventurer/png?seed=${user?.email}` }} 
              style={styles.avatar} 
            />
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={16} color="#F5E6C8" />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Code Name (Full Name)</Text>
        <TextInput 
            style={styles.input} 
            value={fullName} 
            onChangeText={setFullName}
            placeholder="Enter your name" 
            placeholderTextColor="#8D6E63"
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#F5E6C8" />
          ) : (
            <Text style={styles.buttonText}>UPDATE CREDENTIALS</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2e2622', justifyContent: 'center', padding: 20 },
  card: { width: '100%', backgroundColor: '#F5E6C8', padding: 20, borderRadius: 4, borderWidth: 4, borderColor: '#5D4037' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#5D4037', textAlign: 'center', marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#5D4037', paddingBottom: 10 },
  avatarSection: { alignItems: 'center', marginBottom: 20 },
  avatarContainer: { position: 'relative', width: 100, height: 100 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#5D4037' },
  cameraIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#5D4037', padding: 8, borderRadius: 20 },
  label: { color: '#5D4037', fontWeight: 'bold', marginBottom: 5, fontSize: 12, textTransform: 'uppercase' },
  input: { backgroundColor: 'rgba(93, 64, 55, 0.1)', borderBottomWidth: 2, borderBottomColor: '#5D4037', marginBottom: 20, padding: 10, color: '#5D4037', fontWeight: 'bold' },
  button: { backgroundColor: '#5D4037', padding: 15, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#F5E6C8', fontWeight: 'bold' }
});