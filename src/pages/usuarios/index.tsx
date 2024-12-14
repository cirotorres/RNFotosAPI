// src/screens/Usuarios.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { styles } from './styles'
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Token } from '../../Services/token';

interface Foto {
  id: string;
  title: string;
  thumbPath: string | null;
  uploadedBy: string;
  uploadedAt: string;
}

interface Usuario {
  name: string;
  uploadsCount: number;
}

type NavigationProp = {
  navigate: (screen: string, params: { user: string }) => void;
};

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [totals, setTotals] = useState({ users: 0, images: 0 });
  const navigation = useNavigation<NavigationProp>();
  const [refreshing, setRefreshing] = useState(false);

  
    const fetchPhotos = async () => {
      try {
        const response = await axios.get<Foto[]>(
          'http://172.20.10.7:5216/photos/AllList',
          { headers: { Authorization: `Bearer ${Token}` } }
        );
        const photos = response.data;

        // Agrupar por "uploadedBy"
        const groupedByUser = photos.reduce((acc: { [key: string]: Foto[] }, photo) => {
          const user = photo.uploadedBy;
          if (!acc[user]) acc[user] = [];
          acc[user].push(photo);
          return acc;
        }, {});

        // Criar a lista de usuários com quantidade de uploads
        const usersList = Object.keys(groupedByUser)
        .map((user) => ({
          name: user,
          uploadsCount: groupedByUser[user].length,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)); // Ordenação alfabética

        setUsuarios(usersList);
        setFilteredUsuarios(usersList);

        // Calcular os totais
        setTotals({ users: usersList.length, images: photos.length });
      } catch (error) {
        console.error('Erro ao buscar fotos:', error);
      }
    };

     useEffect(() => {
    fetchPhotos();
        }, []);


  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPhotos(); // Recarrega os dados
    setRefreshing(false);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = usuarios.filter((user) =>
      user.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsuarios(filtered);
  };

  const handleUserClick = (user: string) => {
    navigation.navigate('FotosUsuario', { user });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Total de Usuários: {totals.users}</Text>
        <Text style={styles.headerText}>Total de Imagens: {totals.images}</Text>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Pesquisar usuários"
        value={searchText}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredUsuarios}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleUserClick(item.name)}>
            <View style={styles.userItem}>
              <Text style={styles.userText}>
                 {item.name} ({item.uploadsCount})
              </Text>
            </View>
          </TouchableOpacity>
        )}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh}/>
          }
      />
    </View>
  );
};

export default Usuarios;
