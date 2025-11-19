import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../config/api';

export default function ApprovalScreen({ navigation }) {
  const [bounties, setBounties] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPending = async () => {
    try {
      const res = await axios.get(API_URL);
      const pending = res.data.filter(b => b.status === 'pending');
      setBounties(pending);
    } catch (err) {
      console.log(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPending();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPending();
    setRefreshing(false);
  };

  const handleAction = async (id, status) => {
    Alert.alert(
      status === 'wanted' ? 'Approve Bounty' : 'Reject Bounty',
      `Are you sure you want to ${status === 'wanted' ? 'publish' : 'reject'} this request?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await axios.put(`${API_URL}/${id}/status`, { status });
              Alert.alert('Success', `Bounty ${status === 'wanted' ? 'Approved' : 'Rejected'}`);
              fetchPending();
            } catch (error) {
              Alert.alert('Error', 'Action failed');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.badgeContainer}>
        <Text style={styles.badge}>PENDING REVIEW</Text>
      </View>
      
      <Image 
        source={{ uri: item.image_url || 'https://placehold.co/400x500/2e2622/F5E6C8?text=EVIDENCE' }} 
        style={styles.image} 
      />
      
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.crime}>{item.crime}</Text>
        <Text style={styles.reward}>$ {parseInt(item.bounty_amount).toLocaleString()}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.btn, styles.btnReject]} 
          onPress={() => handleAction(item.id, 'rejected')}
        >
          <Ionicons name="close-circle" size={24} color="white" />
          <Text style={styles.btnText}>REJECT</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.btn, styles.btnApprove]} 
          onPress={() => handleAction(item.id, 'wanted')}
        >
          <Ionicons name="checkmark-circle" size={24} color="white" />
          <Text style={styles.btnText}>APPROVE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bounties}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F5E6C8" />}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="checkmark-done-circle-outline" size={64} color="#5D4037" />
            <Text style={styles.emptyText}>No pending requests.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2e2622' },
  list: { padding: 16 },
  card: { backgroundColor: '#F5E6C8', padding: 12, marginBottom: 20, borderWidth: 1, borderColor: '#5D4037', elevation: 5 },
  badgeContainer: { position: 'absolute', top: 10, right: 10, zIndex: 10, backgroundColor: '#FBC02D', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: '#F57F17' },
  badge: { fontSize: 10, fontWeight: 'bold', color: '#3E2723' },
  image: { width: '100%', height: 200, resizeMode: 'cover', borderWidth: 2, borderColor: '#5D4037', marginBottom: 10 },
  info: { alignItems: 'center', marginBottom: 15 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#5D4037', textTransform: 'uppercase' },
  crime: { fontSize: 14, color: '#D32F2F', fontWeight: 'bold', marginBottom: 5 },
  reward: { fontSize: 18, fontWeight: '900', color: '#5D4037' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  btn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 4, gap: 5 },
  btnReject: { backgroundColor: '#D32F2F' },
  btnApprove: { backgroundColor: '#388E3C' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  emptyBox: { alignItems: 'center', marginTop: 50, opacity: 0.7 },
  emptyText: { color: '#F5E6C8', marginTop: 10, fontSize: 16 }
});