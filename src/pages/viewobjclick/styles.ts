import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  favoritoButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: 'transparent',
    marginRight: 10,
  },
  image: {
    width: 400,
    height: 400,
    borderRadius: 10,
    marginBottom: 20,
  },
  details: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    color: '#555',
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 50,
    marginLeft: 10,
  },
  downloadButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 50,
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});