import { Stack } from 'expo-router/stack';

export default function Layout() {
    return (
        <Stack
        screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="index" options={{ title: 'Login' }} />
            <Stack.Screen name="cadastro" options={{ title: 'Cadastro' }} />
            <Stack.Screen name="home/[idU]" options={{ title: 'Home' }} />

        </Stack>
    );
}