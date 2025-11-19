import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Ionicons name="skull" size={80} color="#5D4037" />
        <Text style={styles.title}>BOUNTY BOARD</Text>
        <Text style={styles.subtitle}>GUILD DATABASE SYSTEM</Text>
        
        <View style={styles.loadingBar}>
          <View style={styles.loadingProgress} />
        </View>
        
        <Text style={styles.footer}>EST. 1889</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6C8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: width * 0.8,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#5D4037',
    marginTop: 20,
    letterSpacing: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8D6E63',
    marginTop: 5,
    letterSpacing: 2,
    marginBottom: 40,
  },
  loadingBar: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(93, 64, 55, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    width: '60%',
    height: '100%',
    backgroundColor: '#5D4037',
  },
  footer: {
    position: 'absolute',
    bottom: -150,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5D4037',
    opacity: 0.5,
  }
});