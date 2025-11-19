import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function BountyCard({ item, onPress, style }) {
  const isCaptured = item.status === 'captured';

  return (
    <TouchableOpacity 
      style={[styles.card, isCaptured && styles.cardCaptured, style]} 
      onPress={onPress} 
      activeOpacity={0.9}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>{isCaptured ? 'CASE CLOSED' : 'WANTED'}</Text>
      </View>
      
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.image_url || 'https://placehold.co/400x500/2e2622/F5E6C8?text=NO+IMAGE' }} 
          style={[styles.image, isCaptured && styles.imageCaptured]} 
        />
        {isCaptured && (
          <View style={styles.stampContainer}>
            <Text style={styles.stamp}>CAPTURED</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        {item.alias ? <Text style={styles.alias}>"{item.alias}"</Text> : null}
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>CRIME:</Text>
          <Text style={styles.crime} numberOfLines={2}>{item.crime}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>REWARD:</Text>
          <Text style={styles.reward}>$ {parseInt(item.bounty_amount).toLocaleString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5E6C8',
    borderRadius: 2,
    borderWidth: 4,
    borderColor: '#5D4037',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  cardCaptured: {
    opacity: 0.9,
  },
  header: {
    backgroundColor: '#5D4037',
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#3E2723',
  },
  headerText: {
    color: '#F5E6C8',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
    borderBottomWidth: 4,
    borderBottomColor: '#5D4037',
    backgroundColor: '#2e2622',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageCaptured: {
    opacity: 0.5,
  },
  stampContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  stamp: {
    color: '#D32F2F',
    fontSize: 40,
    fontWeight: '900',
    borderWidth: 6,
    borderColor: '#D32F2F',
    paddingHorizontal: 10,
    paddingVertical: 5,
    transform: [{ rotate: '-15deg' }],
    letterSpacing: 3,
    backgroundColor: 'rgba(245, 230, 200, 0.8)', 
  },
  info: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#F5E6C8',
  },
  name: {
    fontSize: 22,
    fontWeight: '900',
    color: '#5D4037',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 2,
  },
  alias: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#795548',
    marginBottom: 12,
  },
  detailRow: {
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#5D4037',
    opacity: 0.7,
    textTransform: 'uppercase',
  },
  crime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F',
    textAlign: 'center',
  },
  reward: {
    fontSize: 24,
    fontWeight: '900',
    color: '#5D4037',
  },
});