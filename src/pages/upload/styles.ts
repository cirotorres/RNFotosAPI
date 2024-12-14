import { StyleSheet } from "react-native";


export const styles = StyleSheet.create ({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ecf0f1',
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
    titleBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        backgroundColor: '#fff',
      },
      titleBar: {
        flex: 1,
        height: 50,
        paddingHorizontal: 15,
        fontSize: 16,
      },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,

    },
    switch: {
      
      width: 400, // Largura
      height: 40, // Altura 
    },
    label: {
        fontSize: 16,
        marginVertical: 5,
        padding: 5,
        paddingLeft: 12
    },
    logo: {
      height: 150,
      width: 230,
    },
    buttonIcons:{
      height: 30,
      width: 30,
    },
    textbuttonIcons: {
      paddingLeft:20,
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: '#009688',
      textTransform: "uppercase"
      },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 2,
        marginBottom: 10,
        paddingHorizontal: 15,
    },
    
    message: {
        marginTop: 20,
        color: 'green',
        fontWeight: 'bold',
    },
    imageInfo: {
        marginVertical: 10,
        color: 'blue',
        paddingLeft: 12
    },
    qualityValue: {
        fontWeight: 'bold',
        color: '#3366FF',
      },
    
    switchContainer: {   
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: "38%",
        marginBottom: 20,
        paddingLeft: 15
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 40,
        elevation: 8,
        marginVertical: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "45%",
        height: 50,
    },
    buttonEnviar: {
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 40,
      elevation: 3,
      marginVertical: 10,
      justifyContent: "center",
      alignItems: "center",
      width: "80%", // Tamanho do botão
      height: 55, // Altura do botão
    },
    
    buttonbox1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    },

    buttonbox2: {
    justifyContent: 'center',
    alignItems: 'center',
    },

    textbutton: {
    paddingLeft:20,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
    textTransform: "uppercase"
    }
})