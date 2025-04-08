import { Tabs } from 'expo-router';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image, View } from 'react-native';

export default function TabLayout() {

  return (
    <Tabs
      // screenOptions={{
      //   headerShown: false,
      // }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let imageSource;

          if (route.name === 'index') {
            imageSource = focused
              ? require('@/assets/images/home(3).png') // Active image for Home
              : require('@/assets/images/home(2).png'); // Inactive image for Home
          } else if (route.name === 'message') {
            imageSource = focused
              ? require('@/assets/images/customer1.png') // Active image for Messages
              : require('@/assets/images/customer2.png'); // Inactive image for Messages
          } else if (route.name === 'notification') {
            imageSource = focused
              ? require('@/assets/images/bell.png') // Active image for Updates
              : require('@/assets/images/bell1.png'); // Inactive image for Updates
          }          

          return (
            <View
            style={{
              width: 64,
              height: 32,
              backgroundColor: focused ? '#BCE5FF' : 'transparent',
              borderRadius: 16,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <Image
              source={imageSource}
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
              }}
            />
            {/* Pending Count Badge */}
            {/* {route.name === 'Notification' && pendingCount > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  backgroundColor: 'red',
                  borderRadius: 10,
                  width: 18,
                  height: 18,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                  {pendingCount}
                </Text>
              </View>
            )} */}
          </View>
          );
        },
        tabBarActiveTintColor: '#ffffff', // Active icon color (white)
        tabBarInactiveTintColor: '#d3d3d3', // Inactive icon color (light gray)
        tabBarStyle: {
          backgroundColor: '#5FA7FF',  // Background color for the tab bar
          borderTopLeftRadius: 20, // Optional: rounded corners
          borderTopRightRadius: 20, // Optional: rounded corners
          height: 60, // Adjust tab bar height if needed
        },
        headerShown: false, // Hide headers for tab screens
      })}
      />
      // <Tabs.Screen
      //   name="index"
      //   options={{
      //     title: 'Home',
      //     tabBarIcon: ({ color }) => <MaterialIcons color={color} size={28} name={'home'} />,
      //   }}
      // />
  );
}
