import React, {useState, useEffect, ChangeEvent} from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import { View, ImageBackground, Image, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUfResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const Home = () => {
    const navigation = useNavigation();

    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    useEffect(() => {
        axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);

            setUfs(ufInitials)
        })
    }, []);
    
    function handleSelectUf(uf: string) {
        setSelectedUf(uf)
    }

    useEffect(() => {
        if(selectedUf === '0') {
            return;
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`).then(response => {
            const cityNames = response.data.map(city => city.nome);

            setCities(cityNames)
        })
    }, [selectedUf]);
    
    function handleSelectCity(city: string) {
        setSelectedCity(city)
    }

    function handleNavigateToPoints() {
        navigation.navigate('Points', {
            uf: selectedUf, 
            city: selectedCity
        });
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ImageBackground source={require('../../assets/home-background.png')} style={styles.container}
            imageStyle={{ width: 274, height: 368 }}> 
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')} />
                    <View>
                        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    {/* <TextInput style={styles.input} value={uf} onChangeText={setUf} maxLength={2} autoCapitalize="characters" autoCorrect={false} placeholder="Digite a UF" />
                    <TextInput style={styles.input} value={city} onChangeText={setCity} autoCorrect={false} placeholder="Digite a Cidade" /> */}

                    <RNPickerSelect 
                        placeholder={{ label: 'Selecione um estado' }}
                        Icon={() => <Icon name="chevron-down" size={20} color="#6C6C80" />}
                        style={{
                            placeholder: {
                                fontFamily: 'Roboto_400Regular',
                                alignItems: 'center',
                                fontSize: 16,
                                color: '#6C6C80',
                            },
                            viewContainer: {
                                height: 60,
                                backgroundColor: '#fff',
                                borderRadius: 10,
                                marginBottom: 8,
                                paddingHorizontal: 24,
                                paddingTop: 5,
                            },
                            iconContainer: {
                                padding: 20,
                            },
                        }}
                        onValueChange={(value) => handleSelectUf(value)}
                        items={ufs?.map(uf =>(
                            {
                                label: uf,
                                value: uf
                            }
                        ))} 
                    />

                    <RNPickerSelect 
                        placeholder={{ label: 'Selecione uma cidade' }}
                        Icon={() => <Icon name="chevron-down" size={20} color="#6C6C80" />}
                        style={{
                            placeholder: {
                                alignItems: 'center',
                                color: '#6C6C80',
                                fontFamily: 'Roboto_400Regular',
                                fontSize: 16,
                            },
                            viewContainer: {
                                backgroundColor: '#fff',
                                borderRadius: 10,
                                height: 60,
                                marginBottom: 8,
                                paddingTop: 5,
                                paddingHorizontal: 24,
                            },
                            iconContainer: {
                                padding: 20,
                            },
                        }}
                        onValueChange={(value) => handleSelectCity(value)}
                        items={cities?.map(city =>(
                            {
                                label: city,
                                value: city
                            }
                        ))} 
                    />

                    <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                        <View style={styles.buttonIcon}>
                            <Icon name="arrow-right" color="#FFF" size={24}></Icon>
                        </View>
                        <Text style={styles.buttonText}>
                            Entrar
                        </Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home;
