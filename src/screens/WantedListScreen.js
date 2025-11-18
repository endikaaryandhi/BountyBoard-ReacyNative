import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL } from '../config/api';

export default function WantedListScreen({ navigation }) {
  const [bounties, setBounties] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBounties = async () => {
    try {
      const res = await axios.get(API_URL);
      const wanted = res.data.filter(b => b.status === 'wanted');
      setBounties(wanted);
    } catch (err) {
      console.log(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBounties();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBounties();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('Detail', { id: item.id })}
    >
      <View style={styles.header}>
        <Text style={styles.wantedText}>WANTED</Text>
      </View>
      <Image 
        source={{ uri: item.image_url || 'https://placehold.co/400x500/2e2622/F5E6C8?text=CONFIDENTIAL' }} 
        style={styles.image} 
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.alias}>"{item.alias}"</Text>
        <Text style={styles.reward}>$ {parseInt(item.bounty_amount).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bounties}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F5E6C8" />}
        ListEmptyComponent={<Text style={styles.emptyText}>No active bounties.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e2622',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#F5E6C8',
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#5D4037',
    elevation: 5,
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: '#5D4037',
    marginBottom: 10,
    alignItems: 'center',
  },
  wantedText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#5D4037',
    letterSpacing: 4,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#5D4037',
    marginBottom: 10,
  },
  info: {
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D4037',
    textTransform: 'uppercase',
  },
  alias: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#5D4037',
    marginBottom: 5,
  },
  reward: {
    fontSize: 24,
    fontWeight: '900',
    color: '#5D4037',
    marginTop: 5,
  },
  emptyText: {
    color: '#F5E6C8',
    textAlign: 'center',
    marginTop: 20,
  }
});