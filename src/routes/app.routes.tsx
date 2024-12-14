import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Upload from '../pages/upload';
import ListObj from '../pages/allList';
import ObjetoDetalhes from '../pages/viewobjclick';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Favoritos from '../pages/favoritos';
import Feather from '@expo/vector-icons/Feather';
import FotosUsuario from '../pages/usuarios/FotosUsuario';
import Usuarios from '../pages/usuarios';


// Define os navegadores
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Configura o Stack Navigator para a aba "Cadastros"
function CadastrosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="ListObj"
        component={ListObj}
        options={{ title: 'Lista de todas as Fotos' }}
      />
      <Stack.Screen
        name="ObjetoDetalhes"
        component={ObjetoDetalhes}
        options={{ title: 'Detalhes do Objeto' }}
      />
    </Stack.Navigator>
  );
}

function FavoritoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="Fav"
        component={Favoritos}
        options={{ title: 'Lista de Favoritos' }}
      />
      <Stack.Screen
        name="ObjetoDetalhes"
        component={ObjetoDetalhes}
        options={{ title: 'Detalhes do Objeto' }}
      />
    </Stack.Navigator>
  );
}

function UsuarioStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="Fav"
        component={Usuarios}
        options={{ title: 'Lista de Usuários' }}
      />
      <Stack.Screen
        name="FotosUsuario"
        component={FotosUsuario}
        options={{ title: 'Fotos' }}
      />
      <Stack.Screen
        name="ObjetoDetalhes"
        component={ObjetoDetalhes}
        options={{ title: 'Detalhes do Objeto' }}
      />
    </Stack.Navigator>
  );
}

// Configura o Tab Navigator
export function AppRoutes() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: true }}>
        <Tab.Screen
          name="Upload"
          component={Upload}
          options={{
            tabBarIcon: () => (
              <MaterialCommunityIcons name="upload" size={24} color="black" />
            ),
          }}
        />

        <Tab.Screen
          name="Cadastros"
          component={CadastrosStack} // Usa o Stack Navigator
          options={{
            tabBarIcon: () => (
              <FontAwesome name="list-alt" size={24} color="black" />
            ),
          }}
        />

        <Tab.Screen
          name="Usuários"
          component={UsuarioStack}
          options={{
            tabBarIcon: () => (
              <Feather name="user" size={24} color="black" />
            ),
          }}
        />


        <Tab.Screen
          name="Favoritos"
          component={FavoritoStack}
          options={{
            tabBarIcon: () => (
              <Feather name="star" size={26} color="black" />
            ),
          }}
        />

      </Tab.Navigator>
    </NavigationContainer>
  );
}
