import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../config/api';

export default function CapturedListScreen({ navigation }) {
  const [bounties, setBounties] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const fetchBounties = async () => {
    try {
      const res = await axios.get(API_URL);
      const captured = res.data.filter(b => b.status === 'captured');
      setBounties(captured);
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

  const filteredBounties = bounties.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.crime.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, { opacity: 0.8 }]} 
      onPress={() => navigation.navigate('Detail', { id: item.id })}
    >
      <Image 
        source={{ uri: item.image_url || 'https://placehold.co/400x500/2e2622/F5E6C8?text=CONFIDENTIAL' }} 
        style={styles.image} 
      />
      <View style={styles.stampContainer}>
        <Text style={styles.stamp}>CAPTURED</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.crime}>{item.crime}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#5D4037" style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search logs..."
          placeholderTextColor="#8D6E63"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList
        data={filteredBounties}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F5E6C8" />}
        ListEmptyComponent={<Text style={styles.emptyText}>No captured logs found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e2622',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5E6C8',
    margin: 16,
    marginBottom: 0,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#5D4037',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    color: '#5D4037',
    fontWeight: 'bold',
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
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#5D4037',
    marginBottom: 10,
    opacity: 0.6,
  },
  stampContainer: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  stamp: {
    color: '#D32F2F',
    fontSize: 32,
    fontWeight: 'bold',
    borderWidth: 4,
    borderColor: '#D32F2F',
    padding: 5,
    transform: [{ rotate: '-15deg' }],
    letterSpacing: 2,
  },
  info: {
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5D4037',
    textTransform: 'uppercase',
    textDecorationLine: 'line-through',
  },
  crime: {
    fontSize: 14,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#F5E6C8',
    textAlign: 'center',
    marginTop: 20,
  }
});