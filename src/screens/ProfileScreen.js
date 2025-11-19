import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  const { user, role, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      Alert.alert('Success', 'Logged out successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatarContainer}>
            <Image 
                source={{ uri: user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/adventurer/png?seed=${user?.email || 'guest'}` }} 
                style={styles.avatar} 
            />
        </View>
        
        <Text style={styles.name}>{user ? (user.user_metadata?.full_name || 'Unknown Hunter') : 'Guest Hunter'}</Text>
        
        <View style={styles.infoBox}>
            <Text style={styles.label}>EMAIL</Text>
            <Text style={styles.value}>{user?.email || 'Not Logged In'}</Text>
        </View>

        <View style={styles.infoBox}>
            <Text style={styles.label}>ROLE</Text>
            <Text style={styles.value}>{role?.toUpperCase() || 'GUEST'}</Text>
        </View>

        {user ? (
          <>
            <TouchableOpacity 
                style={styles.editBtn}
                onPress={() => navigation.navigate('EditProfile')}
            >
                <Ionicons name="create-outline" size={20} color="#F5E6C8" style={{marginRight: 8}}/>
                <Text style={styles.editBtnText}>EDIT ID CARD</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutText}>RESIGN (LOGOUT)</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity 
              style={styles.loginBtn} 
              onPress={() => navigation.navigate('Login')}
          >
              <Text style={styles.loginText}>LOGIN TO GUILD</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.version}>Endika Aryandhi - Kelompok 27</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2e2622', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#F5E6C8', padding: 20, borderRadius: 4, borderWidth: 4, borderColor: '#5D4037', alignItems: 'center', width: '100%' },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#5D4037', overflow: 'hidden', marginBottom: 20, borderWidth: 3, borderColor: '#2e2622' },
  avatar: { width: '100%', height: '100%' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#5D4037', marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#5D4037', paddingBottom: 5, width: '100%', textAlign: 'center' },
  infoBox: { width: '100%', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(93,64,55,0.2)', paddingBottom: 5 },
  label: { fontSize: 10, color: '#5D4037', opacity: 0.7, fontWeight: 'bold' },
  value: { fontSize: 16, color: '#5D4037', fontWeight: 'bold' },
  editBtn: { flexDirection: 'row', marginTop: 10, padding: 12, width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#5D4037', borderRadius: 4 },
  editBtnText: { color: '#F5E6C8', fontWeight: 'bold' },
  logoutBtn: { marginTop: 15, padding: 10, width: '100%', alignItems: 'center', backgroundColor: 'rgba(211, 47, 47, 0.1)', borderRadius: 4 },
  logoutText: { color: '#D32F2F', fontWeight: 'bold' },
  loginBtn: { marginTop: 20, padding: 15, width: '100%', alignItems: 'center', backgroundColor: '#5D4037', borderRadius: 4 },
  loginText: { color: '#F5E6C8', fontWeight: 'bold', letterSpacing: 1 },
  version: { textAlign: 'center', color: '#F5E6C8', marginTop: 20, opacity: 0.5, fontSize: 12, fontStyle: 'italic' }
});