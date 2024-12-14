import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import { styles } from './styles';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Token } from '../../Services/token';

interface Objeto {
  id: string;
  title: string;
  thumbPath: string | null;
  uploadedBy: string;
  uploadedAt: string;
}

type NavigationProp = {
  navigate: (screen: string, params: { id: string }) => void;
};

const Favoritos = () => {
  const [favoritos, setFavoritos] = useState<Objeto[]>([]);
  const [filteredFavorito, setFilteredFavorito] = useState<Objeto[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchFavoritos = async () => {
    setLoading(true);
    try {
      // Obter os IDs dos favoritos salvos em AsyncStorage
      const favoritosIds = await AsyncStorage.getItem('favoritos');
      const favoritosParsed: string[] = favoritosIds ? JSON.parse(favoritosIds) : [];

      if (favoritosParsed.length === 0) {
        setFavoritos([]);
        setFilteredFavorito([]);
        return;
      }

      // Buscar todos os objetos
      const response = await axios.get('http://172.20.10.7:5216/photos/AllList', {
        headers: { Authorization: `Bearer ${Token}` },
      });

      // Filtrar apenas os favoritos
      const favoritosData = response.data.filter((item: Objeto) =>
        favoritosParsed.includes(item.id)
      );

      setFavoritos(favoritosData);
      setFilteredFavorito(favoritosData);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar favoritos ao focar na tela
  useFocusEffect(
    useCallback(() => {
      fetchFavoritos();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchFavoritos();
    } catch (error) {
      console.error('Erro ao recarregar dados:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleImageClick = (id: string) => {
    navigation.navigate('ObjetoDetalhes', { id });
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = favoritos.filter((foto) =>
      foto.title.toLowerCase().includes(text.toLowerCase()) ||
      foto.uploadedBy.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredFavorito(filtered);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando favoritos...</Text>
      </View>
    );
  }

  if (favoritos.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Nenhum favorito encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchFilters}>
        {/* Barra de pesquisa por título */}
        <TextInput
          style={styles.searchBar}
          placeholder="Pesquisar por título ou usuário"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filteredFavorito}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleImageClick(item.id)}
          >
            <Image
              source={
                item.thumbPath
                  ? { uri: item.thumbPath }
                  : require('../../../assets/adaptive-icon.png')
              }
              style={styles.image}
            />
            <View style={styles.details}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.info}>Enviado por: {item.uploadedBy}</Text>
              <Text style={styles.info}>Enviado em: {item.uploadedAt}</Text>
            </View>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6200ee']}
            progressBackgroundColor={'#f5f5f5'}
          />
        }
      />
    </View>
  );
};

export default Favoritos;

