import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f8f3ee',
        },
        headerTintColor: '#4b3d35',
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Theatre Booking App' }}
      />

      <Stack.Screen
        name="login"
        options={{ title: 'Login' }}
      />

      <Stack.Screen
        name="register"
        options={{ title: 'Register' }}
      />

      <Stack.Screen
        name="booking/[showtimeId]"
        options={{ title: 'Select Seats' }}
      />
    </Stack>
  );
}