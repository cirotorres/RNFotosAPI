import React, { useState } from 'react';
import { View, Text, Image, TextInput, Switch, Alert, SafeAreaView, TouchableWithoutFeedback, Keyboard, Pressable, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { styles } from "./styles";
import * as ImagePicker from 'expo-image-picker';
import { Token } from '../../Services/token';
import api from '../../Services/Api';

// @ts-ignore
import SwitchSelector from "react-native-switch-selector";

export default function Upload() {
    const [photo, setPhoto] = useState< ImagePicker.ImagePickerAsset | null>(null);
    const [title, setTitle] = useState('');
    const [quality, setQuality] = useState(75);
    const [thumbnail, setThumbnail] = useState(true);
    const [message, setMessage] = useState('');

    const uploadUrl = Platform.OS === 'ios'
      ? 'http://172.20.10.7:5216/photos/upload'
      : 'http://10.0.2.2:5216/photos/upload'
            
      if (!uploadUrl) {
        throw new Error('URL endpoint incorreta.');
      }


    const selectImage = async () => {
       
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
            if (permissionResult.granted === false) {
                Alert.alert("Permissão negada", "É necessário permitir acesso à galeria.");
                return;
            }
    
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, // Apenas imagens
                allowsEditing: true,
                allowsMultipleSelection: false,
                quality: 1, // Qualidade máxima da imagem
            });
    
            if (!result.canceled) {
                setPhoto(result.assets[0]); // Atualize com a estrutura de expo-image-picker
            }
        } catch (error) {
            console.error("Erro ao selecionar imagem:", error);
            Alert.alert("Erro", "Ocorreu um erro ao selecionar a imagem.");
        }
    };

    const openCamera = async () => {
        try {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
            if (permissionResult.granted === false) {
                Alert.alert("Permissão negada", "É necessário permitir acesso à câmera.");
                return;
            }
    
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 1, // Qualidade máxima da imagem
            });
    
            if (!result.canceled) {
                setPhoto(result.assets[0]);
            }
        } catch (error) {
            console.error("Erro ao capturar imagem:", error);
            Alert.alert("Erro", "Ocorreu um erro ao capturar a imagem.");
        }
    }

    const handleUpload = async () => {
        if (!photo) {
            Alert.alert("Erro", "Por favor, selecione uma imagem.");
            return;
        }

        const formData = new FormData();
        formData.append('Picture', {
            uri: photo?.uri.startsWith('file://') ? photo.uri : `file://${photo.uri}`,
            name: photo?.uri.split('/').pop(),
            type: photo?.type || 'image/jpeg',
        } as any);
        formData.append('Title', title);
        formData.append('Quality', quality.toString());
        formData.append('Thumbnail', thumbnail.toString());

        try {

            const response = await axios.post(uploadUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${Token}`,
                }
            });
            console.log('FormData:', formData);
            console.log('Upload URL:', uploadUrl);
            console.log('Upload success:', response.data);
            setMessage(`Foto enviada com sucesso: ${response.data.title}`);
            Alert.alert("Sucesso", "Foto enviada com sucesso!");
        } catch (error) {

            console.log('FormData:', formData);
            console.log('Upload URL:', uploadUrl);
            setMessage("Erro ao fazer upload. Tente novamente.");
            Alert.alert("Erro", "Erro ao fazer upload. Tente novamente.");
            console.error(error);
        }
        
    };

    const clearSearch = () => {
        setTitle('');
      };

    const optionsQuality = [
        { label: "50%", value: 50 },
        { label: "75%", value: 75 },
        { label: "100%", value: 100 }
    ];
    const onChange = (value: number) => {
        setQuality(value);
      };
    
    return (
        <SafeAreaView style={styles.container}>
           <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>    
           
           
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
                <View style={{justifyContent: "center", alignItems: "center", paddingBottom:15}}> 
                    <Image style={styles.logo} source={require('../../assets/pngwing.com.png')} />
                </View>
            </TouchableWithoutFeedback>
        
            <View style={styles.buttonbox2}>
			  <Text style={styles.header}>Adicione sua Imagem aqui!</Text>
              <Text style={{paddingBottom: 20}}>Definindo o título e a qualidade. </Text>
            </View>

            
            <View style={styles.buttonbox1}>

                <Pressable 
                    onPress={selectImage} 
                    style={({ pressed }) => [
                    {
                        backgroundColor: pressed ? 'rgb(210, 230, 255)' : '#e1e1e1',
                    },
                    styles.button,
                    ]}
                >
                    <Image style={styles.buttonIcons} source={require("../../assets/gallery2.png")}/>
                    <Text style={styles.textbuttonIcons}>Galeria</Text>
                </Pressable>

                <Pressable 
                    onPress={openCamera} 
                    style={({ pressed }) => [
                        {
                        backgroundColor: pressed ? 'rgb(210, 230, 255)' : '#e1e1e1',
                        },
                        styles.button,
                    ]}>
                    <Image style={styles.buttonIcons} source={require("../../assets/camera3.png")}/>
                    <Text style={styles.textbuttonIcons}>Câmera</Text>
                </Pressable>

            </View>
                 
            {photo && <Text style={styles.imageInfo}>Imagem selecionada: {photo.fileName}</Text>}

            
               <View style={styles.titleBarContainer}>    
                <TextInput
                    style={styles.titleBar}
                    placeholder="Título da imagem"
                    value={title}
                    onChangeText={setTitle}
                    maxLength={100}/>
                    {title.length > 0 && (
                        <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                            <Text style={styles.clearButtonText}>X</Text>
                        </TouchableOpacity>
                        )}
                </View> 
            

            <Text style={styles.label}>Qualidade: <Text style={styles.qualityValue}>{quality}%</Text></Text>
            <View style={{justifyContent: "center", alignItems: "center", paddingBottom:15}}>
            <SwitchSelector
                    options={optionsQuality}
                    initial={1} // Índice inicial: "75"
                    onPress={onChange}
                    textColor="#000" // Cor do texto não selecionado
                    selectedColor="#fff" // Cor do texto selecionado
                    buttonColor="#009688" // Cor do botão selecionado
                    backgroundColor="#f5f6fa" // Cor de fundo do switch
                    borderRadius={10} // Bordas arredondadas
                    style={styles.switch}
                />
            </View>

            <View style={styles.switchContainer}>
                <Switch	value={thumbnail}   
                    onValueChange = {setThumbnail} 
                    />
				<Text style={styles.label}>Criar Miniatura</Text>
            </View>

            <View style={styles.buttonbox2}>
                <Pressable
                onPress={handleUpload}
                style={({ pressed }) => [
                    {
                    backgroundColor: pressed ? 'rgb(210, 230, 255)' : '#009688',
                    },
                    styles.buttonEnviar,
                ]}
                >
                <Text style={styles.textbutton}>Enviar imagem</Text>
                </Pressable>
            </View>
            

            {message ? <Text style={styles.message}>{message}</Text> : null}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
