import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

export default function DetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { role } = useAuth();
  const [bounty, setBounty] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = () => {
    setLoading(true);
    axios.get(`${API_URL}/${id}`)
      .then(res => setBounty(res.data))
      .catch(err => Alert.alert('Error', 'Could not load bounty details'))
      .finally(() => setLoading(false));
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchDetails();
    }, [id])
  );

  const updateStatus = (newStatus) => {
    axios.put(`${API_URL}/${id}/status`, { status: newStatus })
      .then(() => {
        Alert.alert('Success', newStatus === 'captured' ? 'Target Captured!' : 'Status Updated');
        fetchDetails();
      })
      .catch(() => Alert.alert('Error', 'Failed to update status'));
  };

  const deleteBounty = () => {
    Alert.alert('Confirm', 'Delete this record permanently?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: () => {
            axios.delete(`${API_URL}/${id}`)
            .then(() => navigation.goBack())
            .catch(() => Alert.alert('Error', 'Failed to delete'));
        }
      }
    ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#F5E6C8" /></View>;
  if (!bounty) return <View style={styles.center}><Text style={styles.text}>Not Found</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.paper}>
        <Image 
          source={{ uri: bounty.image_url || 'https://placehold.co/400x500/2e2622/F5E6C8?text=CONFIDENTIAL' }} 
          style={[styles.image, bounty.status === 'captured' && styles.grayscale]} 
        />
        
        <Text style={styles.name}>{bounty.name}</Text>
        
        <View style={styles.row}>
            <Text style={styles.label}>ALIAS</Text>
            <Text style={styles.value}>{bounty.alias || '-'}</Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.label}>CRIME</Text>
            <Text style={[styles.value, styles.red]}>{bounty.crime}</Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.label}>REWARD</Text>
            <Text style={styles.reward}>$ {parseInt(bounty.bounty_amount).toLocaleString()}</Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.label}>LAST SEEN</Text>
            <Text style={styles.value}>{bounty.last_seen}</Text>
        </View>
        
        <Text style={styles.descLabel}>DESCRIPTION:</Text>
        <Text style={styles.description}>{bounty.description}</Text>

        {role === 'admin' && bounty.status === 'wanted' && (
            <TouchableOpacity style={styles.captureBtn} onPress={() => updateStatus('captured')}>
                <Text style={styles.btnText}>MARK AS CAPTURED</Text>
            </TouchableOpacity>
        )}
        
        {bounty.status === 'captured' && (
             <View style={styles.capturedBadge}>
                 <Text style={styles.badgeText}>CASE CLOSED</Text>
             </View>
        )}

        {role === 'admin' && (
            <>
                <TouchableOpacity 
                    style={styles.editBtn} 
                    onPress={() => navigation.navigate('EditBounty', { id: bounty.id })}
                >
                    <Text style={styles.editBtnText}>EDIT DOSSIER</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteBtn} onPress={deleteBounty}>
                    <Text style={styles.deleteText}>DELETE RECORD</Text>
                </TouchableOpacity>
            </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2e2622', padding: 16 },
  center: { flex: 1, backgroundColor: '#2e2622', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#F5E6C8' },
  paper: { backgroundColor: '#F5E6C8', padding: 20, borderRadius: 4, borderWidth: 4, borderColor: '#5D4037', marginBottom: 40 },
  image: { width: '100%', height: 300, resizeMode: 'cover', borderWidth: 2, borderColor: '#5D4037', marginBottom: 20 },
  grayscale: { opacity: 0.5 },
  name: { fontSize: 28, fontWeight: '900', color: '#5D4037', textAlign: 'center', marginBottom: 20, textTransform: 'uppercase', borderBottomWidth: 4, borderBottomColor: '#5D4037' },
  row: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'rgba(93,64,55,0.2)', paddingVertical: 8 },
  label: { fontWeight: 'bold', color: '#5D4037', opacity: 0.7 },
  value: { fontWeight: 'bold', color: '#5D4037', maxWidth: '60%', textAlign: 'right' },
  red: { color: '#D32F2F' },
  reward: { fontSize: 20, fontWeight: '900', color: '#5D4037' },
  descLabel: { marginTop: 15, fontWeight: 'bold', color: '#5D4037', opacity: 0.7, fontSize: 12 },
  description: { backgroundColor: 'rgba(0,0,0,0.05)', padding: 10, borderRadius: 4, marginTop: 5, fontStyle: 'italic', color: '#5D4037' },
  captureBtn: { backgroundColor: '#D32F2F', padding: 15, borderRadius: 4, marginTop: 20, alignItems: 'center', borderWidth: 2, borderColor: 'black' },
  btnText: { color: 'white', fontWeight: 'bold', letterSpacing: 1 },
  editBtn: { marginTop: 15, backgroundColor: '#5D4037', padding: 12, alignItems: 'center', borderRadius: 4 },
  editBtnText: { color: '#F5E6C8', fontWeight: 'bold' },
  deleteBtn: { marginTop: 15, alignItems: 'center', padding: 10 },
  deleteText: { color: '#D32F2F', fontWeight: 'bold', fontSize: 12 },
  capturedBadge: { marginTop: 20, padding: 15, borderColor: '#D32F2F', borderWidth: 4, alignItems: 'center', transform: [{rotate: '-2deg'}] },
  badgeText: { color: '#D32F2F', fontWeight: 'bold', fontSize: 20, letterSpacing: 2 }
});