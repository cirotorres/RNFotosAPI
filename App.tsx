import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Upload from './src/pages/upload';
import {AppRoutes} from './src/routes/app.routes'

import { styleglobal } from "./src/global/styles";


export default function App() {
  return (
    <View style={{flex: 1}}>
       <StatusBar style='auto' translucent={true} />
       <AppRoutes />
    </View>
     
  );
}


