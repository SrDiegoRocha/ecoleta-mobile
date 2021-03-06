import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { AppLoading } from 'expo';
import Map, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import api from '../../services/api';

import styles from './styles';

interface Item {
    id: number;
    image_url: string;
    title: string;
}

interface Point {
    id: number;
    name: string;
    image: string;
    latitude: number;
    longitude: number;
}

const Points = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const [points, setPoints] = useState<Point[]>([]) 

    const navigation = useNavigation();

    useEffect(() => {
        async function loadPosition() {
            const { status } = await Location.requestPermissionsAsync();
        
            if(status !== 'granted') {
                Alert.alert('Oooops...', 'Precisamos de sua permissão para obter a localização!');
                return;
            }

            const location = await Location.getCurrentPositionAsync();

            const { latitude, longitude } = location.coords;

            return setInitialPosition([latitude, longitude]);
        }

        loadPosition();
    }, []);

    useEffect(() => {
        api.get('/items').then(response => {
            setItems(response.data.serializedItems);
        }).catch(error => console.log('Items não armazenados no estado: ', error));
    }, [items]);

    useEffect(() => {
        api.get('/points', {
            params : {
                city: 'Goiânia',
                uf: 'GO',
                items: [1, 2, 3, 4, 5, 6]
            }
        }).then((response => {
            console.log(response.data);
            setPoints(response.data);
        })).catch((err) => console.log('Não foi possivel armazenar os pontos de coleta: ', err))
    }, []);
    
    function handleNavigateBack() {
        navigation.goBack();
    }
    
    function handleNavigateToDetail(){
        navigation.navigate('Detail');
    }
    
    function handleSelectItem(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id);
        
        if(alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);
            
            setSelectedItems(filteredItems);
        }else {
            setSelectedItems([...selectedItems, id]);
        }
    }
    
    if(items.length === 0 && initialPosition[0] === 0) return <AppLoading/>
    
    return (
        <>
        <View style={styles.container}>
            <TouchableOpacity onPress={handleNavigateBack}>
                <Icon name="arrow-left" size={24} color="#34cb79" />
            </TouchableOpacity>

            <Text style={styles.title}>Bem vindo.</Text>
            <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

            <View style={styles.mapContainer}>
            {
                initialPosition[0] !== 0 && (
                    <Map 
                        style={styles.map}
                        initialRegion={{ 
                            latitude: initialPosition[0], 
                            longitude: initialPosition[1],
                            latitudeDelta: 0.014,
                            longitudeDelta: 0.014
                        }}
                    >    
                    {
                        points.map(point => (
                            <Marker key={String(point.id)} coordinate={{ latitude: point.latitude, longitude: point.longitude }} onPress={handleNavigateToDetail} style={styles.mapMarker} >
                                <View style={styles.mapMarkerContainer}>
                                    <Image style={styles.mapMarkerImage} source={{ uri: point.image }} />
                                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                                </View>
                            </Marker>
                        ))
                    }
                    </Map>
                )
            }
            </View>
        </View>
        <View style={styles.itemsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 32 }} >
            {
                items.map(item => (
                    <TouchableOpacity 
                        key={String(item.id)} 
                        style={[
                            styles.item, 
                            selectedItems.includes(item.id) ? styles.selectedItem : {}
                        ]} 
                        activeOpacity={0.6} 
                        onPress={() => handleSelectItem(item.id)}
                    >
                        <SvgUri width={42} height={42} uri={item.image_url}/>
                        <Text style={styles.itemTitle}>{item.title}</Text>                
                    </TouchableOpacity>
                )) 
            }
            </ScrollView>
        </View>
        </>
    );
}

export default Points;