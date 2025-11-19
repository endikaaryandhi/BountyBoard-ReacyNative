import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../config/api';
import BountyCard from '../components/BountyCard';

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
    <View style={styles.wrapper}>
      <View style={styles.actionButtons}>
         <TouchableOpacity 
           style={[styles.btn, styles.btnReject]} 
           onPress={() => handleAction(item.id, 'rejected')}
         >
            <Ionicons name="close" size={28} color="white" />
         </TouchableOpacity>
         
         <TouchableOpacity 
           style={[styles.btn, styles.btnApprove]} 
           onPress={() => handleAction(item.id, 'wanted')}
         >
            <Ionicons name="checkmark" size={28} color="white" />
         </TouchableOpacity>
      </View>

      <BountyCard item={item} onPress={null} />
      
      <View style={styles.badgeContainer}>
         <View style={styles.badge}>
           <Ionicons name="alert-circle" size={16} color="white" style={{marginRight: 4}}/>
           <Text style={styles.badgeText}>PENDING REVIEW</Text>
         </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bounties}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={bounties.length === 0 ? styles.centerEmpty : styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F5E6C8" />}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="checkmark-done-circle-outline" size={80} color="#5D4037" />
            <Text style={styles.emptyText}>All caught up!</Text>
            <Text style={styles.emptySubText}>No pending requests.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2e2622' },
  list: { padding: 16, paddingTop: 30 },
  centerEmpty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  wrapper: { position: 'relative', marginBottom: 20 },
  actionButtons: {
    position: 'absolute',
    top: -15,
    right: -10,
    flexDirection: 'row',
    zIndex: 20,
    gap: 10,
  },
  btn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  btnReject: { backgroundColor: '#D32F2F' },
  btnApprove: { backgroundColor: '#388E3C' },
  badgeContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9A825',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyBox: { alignItems: 'center', opacity: 0.6 },
  emptyText: { color: '#F5E6C8', marginTop: 10, fontSize: 24, fontWeight: 'bold', fontFamily: 'serif' },
  emptySubText: { color: '#F5E6C8', marginTop: 5, fontSize: 16, fontStyle: 'italic' }
});