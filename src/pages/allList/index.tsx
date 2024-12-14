import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


type NavigationProp = {
  navigate: (screen: string, params: { id: string }) => void;
};

interface Objeto {
  id: string;
  title: string;
  thumbPath: string | null;
  uploadedBy: string;
  uploadedAt: string;
}

const ListObj = () => {
  const [objetos, setObjetos] = useState<Objeto[]>([]);
  const [filteredObjetos, setFilteredObjetos] = useState<Objeto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://172.20.10.7:5216/photos/AllList');

        //Ordenar lista por id
        const sortedData = response.data.sort(
          (a: Objeto, b: Objeto) => parseInt(b.id) - parseInt(a.id)
        );

        setObjetos(sortedData);
        setFilteredObjetos(sortedData);

        
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  // Função campo de busca
  const handleSearch = (text: string) => {
    setSearchTerm(text);
    if (text.trim() === '') {
      setFilteredObjetos(objetos); // Exibe todos os objetos se o campo estiver vazio
    } else {
      const filtered = objetos.filter(
        (obj) =>
          obj.title.toLowerCase().includes(text.toLowerCase()) ||
          obj.uploadedBy.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredObjetos(filtered);
    }
  };

  // Limpar o campo de busca
  const clearSearch = () => {
    setSearchTerm('');
    setFilteredObjetos(objetos);
  };

  // Puxar para recarregar
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get('http://172.20.10.7:5216/photos/AllList');

      const sortedData = response.data.sort(
        (a: Objeto, b: Objeto) => parseInt(b.id) - parseInt(a.id) // Ordem crescente
      );

      setObjetos(sortedData);
      setFilteredObjetos(sortedData);
    } catch (error) {
      console.error('Erro ao recarregar dados:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handlePress = (id: string) => {
    navigation.navigate('ObjetoDetalhes', { id }); // Redireciona para a página de detalhes
  };

  const renderItem = ({ item }: { item: Objeto }) => (
    <TouchableOpacity onPress={() => handlePress(item.id)} style={styles.item}>
      <View style={styles.imageContainer}>
        {item.thumbPath ? (
          <Image
            source={{ uri: item.thumbPath }}
            style={styles.image}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Sem Miniatura</Text>
          </View>
        )}
      </View>
      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.detail}>ID: {item.id}</Text>
        <Text style={styles.detail}>Enviado por: {item.uploadedBy}</Text>
        <Text style={styles.detail}>Data: {item.uploadedAt}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Pesquisar por Título ou Usuário"
          value={searchTerm}
          onChangeText={handleSearch}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>X</Text>
          </TouchableOpacity>
        )}
      </View>
     
      <FlatList
        data={filteredObjetos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6200ee']}
            progressBackgroundColor={'#f5f5f5'}
          />
        }
      />
    </SafeAreaView>
  );
};

export default ListObj;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  searchBar: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  clearButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#888',
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  imageContainer: {
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  placeholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#888',
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
});
