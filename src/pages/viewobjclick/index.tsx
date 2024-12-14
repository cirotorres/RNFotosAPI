import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import axios from 'axios';
import { styles } from "./styles";
import { Buffer } from 'buffer';
import { Token } from '../../Services/token';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

type StackParamList = {
  ObjetoDetalhes: { id: string };
};

type ObjetoDetalhesRouteProp = RouteProp<StackParamList, 'ObjetoDetalhes'>;

interface Objeto {
  id: string;
  title: string;
  uploadedBy: string;
  uploadedAt: string;
  image: string | null;
  height: string;
  width: string;
  applicationId: string;
  imageSize: number;
}

const ObjetoDetalhes = () => {
  const route = useRoute<ObjetoDetalhesRouteProp>();
  const { id } = route.params;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [objeto, setObjeto] = useState<Objeto | null>(null);
  const [isFavorito, setIsFavorito] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get(`http://172.20.10.7:5216/photos/find/${id}`, {
          headers: { Authorization: `Bearer ${Token}` },
        });

        const imageResponse = await axios.get(`http://172.20.10.7:5216/photos/view/${id}`, {
          headers: { Authorization: `Bearer ${Token}` },
          responseType: 'arraybuffer',
        });

        // Calcular tamanho da imagem em MB
        const contentLength = imageResponse.headers['content-length'];
        const imageSizeMB = contentLength ? (parseInt(contentLength, 10) / (1024 * 1024)).toFixed(2) : '0';

        const base64Image = `data:image/jpeg;base64,${Buffer.from(
          imageResponse.data,
          'binary'
        ).toString('base64')}`;

        setObjeto({
          id: response.data.id,
          title: response.data.title,
          uploadedBy: response.data.uploadedBy,
          uploadedAt: response.data.uploadedAt,
          image: base64Image,
          height: response.data.height,
          width: response.data.width,
          applicationId: response.data.applicationId,
          imageSize: parseFloat(imageSizeMB),
        });

        // Verificar se está marcado como favorito
        const favoritos = await AsyncStorage.getItem('favoritos');
        const favoritosParsed = favoritos ? JSON.parse(favoritos) : [];
        setIsFavorito(favoritosParsed.includes(response.data.id));

      } catch (err) {
        console.error('Erro ao buscar os detalhes do objeto:', err);
        setError('Erro ao carregar detalhes do objeto.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const toggleFavorito = async () => {
    try {
      const favoritos = await AsyncStorage.getItem('favoritos');
      const favoritosParsed = favoritos ? JSON.parse(favoritos) : [];

      if (isFavorito) {
        // Remover dos favoritos
        const updatedFavoritos = favoritosParsed.filter((favId: string) => favId !== id);
        await AsyncStorage.setItem('favoritos', JSON.stringify(updatedFavoritos));
        setIsFavorito(false);
      } else {
        // Adicionar aos favoritos
        favoritosParsed.push(id);
        await AsyncStorage.setItem('favoritos', JSON.stringify(favoritosParsed));
        setIsFavorito(true);
      }

    } catch (err) {
      console.error('Erro ao atualizar favoritos:', err);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  const handleDelete = async () => {
    Alert.alert(
      'Excluir Imagem',
      `Você tem certeza que deseja excluir "${objeto?.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          onPress: async () => {
            try {
              await axios.delete(`http://172.20.10.7:5216/photos/delete/${id}`, {
                headers: { Authorization: `Bearer ${Token}` },
              });
              Alert.alert('Sucesso', 'Imagem excluída com sucesso!');
            } catch (err) {
              console.error('Erro ao excluir a imagem:', err);
              Alert.alert('Erro', 'Falha ao excluir a imagem.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleDownload = async () => {
    if (!objeto?.image) return;
  
    try {
      // Solicitar permissão para acessar a biblioteca de mídia
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão para acessar a galeria foi negada.');
        return;
      }
  
      // Gerar um caminho temporário para salvar a imagem
      const base64Code = objeto.image.split('base64,')[1];
      const fileUri = `${FileSystem.cacheDirectory}${objeto.id}.jpg`;
  
      // Salvar o arquivo base64 como imagem no diretório temporário
      await FileSystem.writeAsStringAsync(fileUri, base64Code, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      // Salvar a imagem na galeria usando MediaLibrary
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('Download', asset, false);
  
      Alert.alert('Sucesso', 'Imagem salva na galeria com sucesso!');
    } catch (err) {
      console.error('Erro ao baixar a imagem:', err);
      Alert.alert('Erro', 'Falha ao baixar a imagem.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {objeto && (
        <>
          {objeto.image && (
            <Image source={{ uri: objeto.image }} style={styles.image} resizeMode="contain" />
          )}
          <View style={styles.details}>
            <Text style={styles.title}>Título: {objeto.title}</Text>
            <Text style={styles.title}>ID: {objeto.id}</Text>
            <Text style={styles.detail}>Enviado por: {objeto.uploadedBy}</Text>
            <Text style={styles.detail}>Aplicação: {objeto.applicationId}</Text>
            <Text style={styles.detail}>Altura: {objeto.height}</Text>
            <Text style={styles.detail}>Largura: {objeto.width}</Text>
            <Text style={styles.detail}>Tamanho: {objeto.imageSize} MB</Text>
            <Text style={styles.detail}>Enviado em: {objeto.uploadedAt}</Text>
          </View>

          <View style={styles.buttons}>

            <TouchableOpacity style={styles.favoritoButton} onPress={toggleFavorito}>
              <FontAwesome
                name={isFavorito ? 'star' : 'star-o'}
                size={24}
                color={isFavorito ? 'gold' : 'gray'}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
              <Text style={styles.buttonText}>Baixar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.buttonText}>Deletar</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default ObjetoDetalhes;

