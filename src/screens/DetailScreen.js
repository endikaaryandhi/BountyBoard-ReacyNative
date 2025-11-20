import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { BountyService } from '../services/bountyService'; 

export default function DetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { role } = useAuth();
  const [bounty, setBounty] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const data = await BountyService.getById(id);
      setBounty(data);
    } catch (err) {
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchDetails();
    }, [id])
  );

  const updateStatus = async (newStatus) => {
    try {
      await BountyService.updateStatus(id, newStatus);
      Alert.alert('Success', newStatus === 'captured' ? 'Target Captured!' : 'Status Updated');
      fetchDetails();
    } catch (error) {
    }
  };

  const deleteBounty = () => {
    Alert.alert('Confirm', 'Delete this record permanently?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: async () => {
          try {
            await BountyService.delete(id);
            navigation.goBack();
          } catch (error) {
          }
        }
      }
    ]);
  };

  if (loading) return <SafeAreaView style={styles.center}><ActivityIndicator size="large" color="#F5E6C8" /></SafeAreaView>;
  if (!bounty) return <SafeAreaView style={styles.center}><Text style={styles.text}>Not Found</Text></SafeAreaView>;

  const isCaptured = bounty.status === 'captured';

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.paper}>
          {/* Image Section */}
          <View style={styles.imageWrapper}>
            <Image 
              source={{ uri: bounty.image_url || 'https://placehold.co/400x500/2e2622/F5E6C8?text=CONFIDENTIAL' }} 
              style={[styles.image, isCaptured && styles.grayscale]} 
            />
            {isCaptured && (
              <View style={styles.stampContainer}>
                <Text style={styles.stamp}>CASE CLOSED</Text>
              </View>
            )}
          </View>
          
          {/* Details Section */}
          <Text style={styles.nameContainer}>
            <Text style={styles.name}>{bounty.name}</Text>
            {bounty.alias ? <Text style={styles.alias}> ({bounty.alias})</Text> : null}
          </Text>
          
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

          {/* Admin Actions */}
          {role === 'admin' && (
            <>
              {bounty.status === 'wanted' && (
                <TouchableOpacity style={styles.captureBtn} onPress={() => updateStatus('captured')}>
                    <Text style={styles.btnText}>MARK AS CAPTURED</Text>
                </TouchableOpacity>
              )}

              {bounty.status === 'captured' && (
                <TouchableOpacity style={styles.revokeBtn} onPress={() => updateStatus('wanted')}>
                    <Text style={styles.btnText}>REVOKE CAPTURE</Text>
                </TouchableOpacity>
              )}

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2e2622' },
  scrollContent: { padding: 16 },
  center: { flex: 1, backgroundColor: '#2e2622', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#F5E6C8' },
  paper: { backgroundColor: '#F5E6C8', padding: 20, borderRadius: 4, borderWidth: 4, borderColor: '#5D4037', marginBottom: 20 },
  imageWrapper: { position: 'relative', marginBottom: 20 },
  image: { width: '100%', height: 300, resizeMode: 'cover', borderWidth: 2, borderColor: '#5D4037' },
  grayscale: { opacity: 0.5 },
  stampContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  stamp: { color: '#D32F2F', fontSize: 36, fontWeight: '900', borderWidth: 5, borderColor: '#D32F2F', padding: 10, transform: [{ rotate: '-15deg' }], letterSpacing: 2, backgroundColor: 'rgba(245, 230, 200, 0.9)' },
  nameContainer: { textAlign: 'center', marginBottom: 20, borderBottomWidth: 4, borderBottomColor: '#5D4037', paddingBottom: 10 },
  name: { fontSize: 28, fontWeight: '900', color: '#5D4037', textTransform: 'uppercase' },
  alias: { fontSize: 20, fontWeight: 'bold', color: '#795548', fontStyle: 'italic' },
  row: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'rgba(93,64,55,0.2)', paddingVertical: 8 },
  label: { fontWeight: 'bold', color: '#5D4037', opacity: 0.7 },
  value: { fontWeight: 'bold', color: '#5D4037', maxWidth: '60%', textAlign: 'right' },
  red: { color: '#D32F2F' },
  reward: { fontSize: 20, fontWeight: '900', color: '#5D4037' },
  descLabel: { marginTop: 15, fontWeight: 'bold', color: '#5D4037', opacity: 0.7, fontSize: 12 },
  description: { backgroundColor: 'rgba(0,0,0,0.05)', padding: 10, borderRadius: 4, marginTop: 5, fontStyle: 'italic', color: '#5D4037' },
  captureBtn: { backgroundColor: '#D32F2F', padding: 15, borderRadius: 4, marginTop: 20, alignItems: 'center', borderWidth: 2, borderColor: 'black' },
  revokeBtn: { backgroundColor: '#5D4037', padding: 15, borderRadius: 4, marginTop: 20, alignItems: 'center', borderWidth: 2, borderColor: 'black' },
  btnText: { color: 'white', fontWeight: 'bold', letterSpacing: 1 },
  editBtn: { marginTop: 15, backgroundColor: '#5D4037', padding: 12, alignItems: 'center', borderRadius: 4 },
  editBtnText: { color: '#F5E6C8', fontWeight: 'bold' },
  deleteBtn: { marginTop: 15, alignItems: 'center', padding: 10 },
  deleteText: { color: '#D32F2F', fontWeight: 'bold', fontSize: 12 }
});