import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';

export default function ProfileScreen() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatarContainer}>
            <Image 
                source={{ uri: `https://api.dicebear.com/7.x/adventurer/png?seed=${user?.email}` }} 
                style={styles.avatar} 
            />
        </View>
        
        <Text style={styles.name}>HUNTER PROFILE</Text>
        
        <View style={styles.infoBox}>
            <Text style={styles.label}>EMAIL</Text>
            <Text style={styles.value}>{user?.email}</Text>
        </View>

        <View style={styles.infoBox}>
            <Text style={styles.label}>STATUS</Text>
            <Text style={styles.value}>ACTIVE LICENSE</Text>
        </View>

        <View style={styles.infoBox}>
            <Text style={styles.label}>GUILD</Text>
            <Text style={styles.value}>BOUNTY BOARD INC.</Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>RESIGN (LOGOUT)</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.version}>System v2.0 Mobile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e2622',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#F5E6C8',
    padding: 20,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: '#5D4037',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#5D4037',
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#2e2622',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#5D4037',
    paddingBottom: 5,
    width: '100%',
    textAlign: 'center',
  },
  infoBox: {
    width: '100%',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(93,64,55,0.2)',
    paddingBottom: 5,
  },
  label: {
    fontSize: 10,
    color: '#5D4037',
    opacity: 0.7,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: '#5D4037',
    fontWeight: 'bold',
  },
  logoutBtn: {
    marginTop: 20,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    borderRadius: 4,
  },
  logoutText: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  version: {
    textAlign: 'center',
    color: '#F5E6C8',
    marginTop: 20,
    opacity: 0.5,
    fontSize: 10,
  }
});