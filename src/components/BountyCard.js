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
        <Text style={styles.headerText}>{item.name}</Text>
      </View>
      
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.image_url || 'https://placehold.co/400x500/2e2622/F5E6C8?text=NO+IMAGE' }} 
          style={[styles.image, isCaptured && styles.imageCaptured]} 
        />
        {isCaptured && (
          <View style={styles.stampContainer}>
            <Text style={styles.stamp}>CASE CLOSED</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.nameContainer} numberOfLines={2}>
          <Text style={styles.name}>{item.name}</Text>
          {item.alias ? <Text style={styles.alias}> ({item.alias})</Text> : null}
        </Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>CRIME:</Text>
          <Text style={styles.crime} numberOfLines={1}>{item.crime}</Text>
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
  },
  cardCaptured: {
    opacity: 0.9,
  },
  header: {
    backgroundColor: '#5D4037',
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#3E2723',
  },
  headerText: {
    color: '#F5E6C8',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
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
    opacity: 0.4,
  },
  stampContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  stamp: {
    color: '#D32F2F',
    fontSize: 32,
    fontWeight: '900',
    borderWidth: 5,
    borderColor: '#D32F2F',
    paddingHorizontal: 10,
    paddingVertical: 5,
    transform: [{ rotate: '-15deg' }],
    letterSpacing: 2,
    backgroundColor: 'rgba(245, 230, 200, 0.9)', 
  },
  info: {
    padding: 12,
    backgroundColor: '#F5E6C8',
  },
  nameContainer: {
    textAlign: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: '900',
    color: '#5D4037',
    textTransform: 'uppercase',
  },
  alias: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#795548',
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5D4037',
    opacity: 0.8,
  },
  crime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D32F2F',
    maxWidth: '70%',
  },
  reward: {
    fontSize: 16,
    fontWeight: '900',
    color: '#5D4037',
  },
});