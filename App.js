import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import WantedListScreen from './src/screens/WantedListScreen';
import CapturedListScreen from './src/screens/CapturedListScreen';
import AddBountyScreen from './src/screens/AddBountyScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DetailScreen from './src/screens/DetailScreen';
import ApprovalScreen from './src/screens/ApprovalScreen';
import EditBountyScreen from './src/screens/EditBountyScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator({ navigation }) {
  const { user, role } = useAuth();

  const handleAuthGuard = (e) => {
    if (!user) {
      e.preventDefault();
      navigation.navigate('Login');
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#5D4037',
          borderTopWidth: 2,
          borderTopColor: '#2e2622',
          height: 60,
        },
        tabBarActiveTintColor: '#F5E6C8',
        tabBarInactiveTintColor: 'rgba(245, 230, 200, 0.5)',
        tabBarLabelStyle: { paddingBottom: 5, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Wanted') iconName = focused ? 'skull' : 'skull-outline';
          else if (route.name === 'Captured') iconName = focused ? 'document-text' : 'document-text-outline';
          else if (route.name === 'Add') iconName = focused ? 'add-circle' : 'add-circle-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          else if (route.name === 'Approval') iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Wanted" component={WantedListScreen} />
      
      <Tab.Screen name="Captured" component={CapturedListScreen} />
      
      <Tab.Screen 
        name="Add" 
        component={AddBountyScreen} 
        listeners={{ tabPress: handleAuthGuard }}
      />

      {user && role === 'admin' && (
        <Tab.Screen name="Approval" component={ApprovalScreen} />
      )}

      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        listeners={{ tabPress: handleAuthGuard }}
      />
    </Tab.Navigator>
  );
}

function Navigation() {
  const { loading } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen 
          name="Detail" 
          component={DetailScreen} 
          options={{ 
            headerShown: true, 
            headerStyle: { backgroundColor: '#5D4037' }, 
            headerTintColor: '#F5E6C8',
            headerTitle: 'FILE DETAIL' 
          }} 
        />
        <Stack.Screen 
          name="EditBounty" 
          component={EditBountyScreen} 
          options={{ 
            headerShown: true, 
            headerStyle: { backgroundColor: '#5D4037' }, 
            headerTintColor: '#F5E6C8',
            headerTitle: 'UPDATE RECORD' 
          }} 
        />
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfileScreen} 
          options={{ 
            headerShown: true, 
            headerStyle: { backgroundColor: '#5D4037' }, 
            headerTintColor: '#F5E6C8',
            headerTitle: 'UPDATE ID' 
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}