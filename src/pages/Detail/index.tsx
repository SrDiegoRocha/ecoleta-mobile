import React from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';

import styles from './styles';

const Detail = () => {
    const navigation = useNavigation();

    function handleNavigateBack() {
        navigation.goBack();
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <TouchableOpacity onPress={handleNavigateBack}>
                <Icon name="arrow-left" size={24} color="#34cb79" />
            </TouchableOpacity>

            <Image style={styles.pointImage} source={{ uri: 'https://images.unsplash.com/photo-1583300919410-7b9186dac94a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60' }} />
        
            <Text style={styles.pointName}>Mercadingo do Diguinhu</Text>
            <Text style={styles.pointItems}>Lâmpadas, Garrafa Pet, Arroz com frango fritod</Text>
        
            <View style={styles.address}>
                <Text style={styles.addressTitle}>Endereço</Text>
                <Text style={styles.addressContent}>O seu endereço bota aqui, meu irmão</Text>
            </View>
        </View>
        <View style={styles.footer}>
            <RectButton style={styles.button} onPress={() => {}}>
                <FontAwesome name="whatsapp" size={24} color="#FFF" />
                <Text style={styles.buttonText}>Whatsapp</Text>
            </RectButton>

            <RectButton style={styles.button} onPress={() => {}}>
                <Icon name="mail" size={24} color="#FFF" />
                <Text style={styles.buttonText}>E-mail</Text>
            </RectButton>
        </View>
        </SafeAreaView>
    );
}

export default Detail;