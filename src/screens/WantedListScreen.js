import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TextInput } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../config/api';
import BountyCard from '../components/BountyCard';

export default function WantedListScreen({ navigation }) {
  const [bounties, setBounties] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

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

  const filteredBounties = bounties.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.crime.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#5D4037" style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search targets..."
          placeholderTextColor="#8D6E63"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList
        data={filteredBounties}
        renderItem={({ item }) => (
          <BountyCard 
            item={item} 
            onPress={() => navigation.navigate('Detail', { id: item.id })} 
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F5E6C8" />}
        ListEmptyComponent={<Text style={styles.emptyText}>No active bounties found.</Text>}
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
    marginBottom: 5,
    paddingHorizontal: 12,
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
  emptyText: {
    color: '#F5E6C8',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    opacity: 0.7,
  }
});