import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import { styles } from './stylesFtU';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Token } from '../../Services/token';

interface Foto {
  id: string;
  title: string;
  thumbPath: string | null;
  uploadedBy: string;
  uploadedAt: string;
}

type NavigationProp = {
    navigate: (screen: string, params: { id: string }) => void;
  };

type StackParamList = {
  FotosUsuario: { user: string }; // Recebe o nome do usuário da rota
};

type FotosUsuarioRouteProp = RouteProp<StackParamList, 'FotosUsuario'>;

const FotosUsuario = () => {
  const route = useRoute<FotosUsuarioRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { user } = route.params; // Nome do usuário selecionado na página anterior

  const [fotos, setFotos] = useState<Foto[]>([]);
  const [filteredFotos, setFilteredFotos] = useState<Foto[]>([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchFotos = async () => {
    try {
      const response = await axios.get<Foto[]>(
        'http://172.20.10.7:5216/photos/AllList',
        { headers: { Authorization: `Bearer ${Token}` } }
      );

      // Filtrar fotos pelo nome do usuário
      const userFotos = response.data
        .filter((foto) => foto.uploadedBy === user)
        .sort(
          (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        ); // Ordena por data, mais recentes primeiro

      setFotos(userFotos);
      setFilteredFotos(userFotos);
    } catch (error) {
      console.error('Erro ao buscar fotos:', error);
    }
  };

  useEffect(() => {
    fetchFotos();
  }, [user]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = fotos.filter((foto) =>
      foto.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredFotos(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFotos(); 
    setRefreshing(false);
  };

  const handleImageClick = (id: string) => {
    navigation.navigate('ObjetoDetalhes', { id }); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Fotos de {user}</Text>
      <View style={styles.searchFilters}>

        <TextInput
          style={styles.searchBar}
          placeholder="Pesquisar por título"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filteredFotos}
        keyExtractor={(item) => item.id}
        numColumns={3} // Layout em GRID
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => handleImageClick(item.id)}
          >
            <Image
              source={
                item.thumbPath
                  ? { uri: item.thumbPath}
                  : require('../../../assets/adaptive-icon.png')
              }
              style={styles.image}
            />
            <Text style={styles.imageTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={<Text style={styles.emptyMessage}>Nenhuma foto encontrada.</Text>}
      />
    </View>
  );
};

export default FotosUsuario;

