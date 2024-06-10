import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function Layout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'green',  tabBarHideOnKeyboard: true}}>
            <Tabs.Screen name='home' options={{
                title: "Home", headerShown: false,
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
            }} />
            
            <Tabs.Screen name='perfil' options={{
                title: "Perfil",
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
            }} />
        </Tabs>
    );
}