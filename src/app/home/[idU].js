import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, Text, View, Platform, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios, { isCancel, AxiosError } from 'axios';
import { TextInputMask } from 'react-native-masked-text';



export default function Home() {

    const { idU } = useLocalSearchParams();
    const [anoFiltrado, setAnoFiltrado] = useState();
    const [despesaFiltrada, setDespesaFiltrada] = useState([]);
    const [despesa, setDespesa] = useState([])
    const [conectar, setConectar] = useState(true)
    const [modalSelecionar, setModalSelecionar] = useState(false)
    const [despesaSelecionada, setDespesaSelecionada] = useState(null)
    const [modalAdicionar, setModalAdicionar] = useState(false)
    const [novaDespesa, setNovaDespesa] = useState({})
    const [mesFiltrado, setMesFiltrado] = useState()
    const [origemFiltrado, setOrigemFiltrado] = useState()
    const [modalFiltro, setModalFiltro] = useState(false)

    const listarDespesa = async () => {
        await axios.get(`http://192.168.0.8:3000/${idU}/listar`).then(function (resposta) {
            setDespesa(resposta.data);
            setAnoFiltrado('all');
            setMesFiltrado('all');
            setOrigemFiltrado('all');
            setConectar(false)
        }).catch(function (erro) {
            console.error(erro)
        })
    };

    useEffect(() => {
        setAnoFiltrado('')
        setMesFiltrado('')
        listarDespesa()
    }, [conectar]);

    useEffect(() => {
        if (anoFiltrado === 'all' && mesFiltrado === 'all' && origemFiltrado === 'all') {
            setDespesaFiltrada(despesa);
            //Todos são all
        } else if (anoFiltrado === 'all' && mesFiltrado === 'all') {
            setDespesaFiltrada(despesa.filter(item => item.origem === origemFiltrado))
            //Ano e mês são all
        } else if (anoFiltrado === 'all' && origemFiltrado === 'all') {
            setDespesaFiltrada(despesa.filter(item => item.mes === mesFiltrado));
            //Ano e origem são all
        } else if (anoFiltrado === 'all') {
            setDespesaFiltrada(despesa.filter(item => item.mes === mesFiltrado && item.origem === origemFiltrado));
            //Ano é all
        } else if (mesFiltrado === 'all' && origemFiltrado === 'all') {
            setDespesaFiltrada(despesa.filter(item => item.ano === anoFiltrado));
            //Mês e origem são all
        } else if (mesFiltrado === 'all') {
            setDespesaFiltrada(despesa.filter(item => item.ano === anoFiltrado && item.origem === origemFiltrado));
            //Mês é all
        } else if (origemFiltrado === 'all') {
            setDespesaFiltrada(despesa.filter(item => item.ano === anoFiltrado && item.mes === mesFiltrado));
            //Origem é all
        } else {
            setDespesaFiltrada(despesa.filter(item => item.ano === anoFiltrado && item.mes === mesFiltrado && item.origem === origemFiltrado));
            //Nenhum é all
        }
    }, [anoFiltrado, mesFiltrado, origemFiltrado]);

    const selecionarDespesa = async (despesa) => {
        setDespesaSelecionada(despesa)
        setModalSelecionar(true)
    }

    const adicionarDespesa = async () => {
        await axios.post(`http://192.168.0.8:3000/${idU}/adicionar`, novaDespesa).then(function (resposta) {
            setNovaDespesa({})
            setModalAdicionar(false)
            setConectar(true)
        }).catch(function (error) {
            console.error(error);
        })
    }

    const atualizarDespesa = async (despesaSelecionada) => {
        const idD = despesaSelecionada.idDespesa
        await axios.put(`http://192.168.0.8:3000/${idD}/atualizar`, despesaSelecionada).then(function (resposta) {
            setConectar(true)
            setDespesaSelecionada({})
            setModalSelecionar(false)
        }).catch(function (error) {
            console.error(error);
        })
    }

    const deletarDespesa = async (despesaSelecionada) => {
        const idD = despesaSelecionada.idDespesa
        await axios.put(`http://192.168.0.8:3000/${idD}/deletar`).then(function (resposta) {
            setConectar(true)
            setDespesaSelecionada({})
            setModalSelecionar(false)
        }).catch(function (error) {
            console.error(error);
        })
    }

    return (
        <View style={styles.container}>

            <View style={styles.containerHeader}>

            </View>



            <View style={styles.containerFiltro}>
                <View style={[styles.containerFiltrar]}>
                    <TouchableOpacity style={[styles.botaoFiltrar]} onPress={() => setModalFiltro(true)}>
                        <Text style={[styles.filtrar]}>Filtrar</Text>
                    </TouchableOpacity>

                    <Modal visible={modalFiltro} transparent={false} animationType='slide'>
                        <View>
                            <View style={styles.filtro}>
                                <Text style={{ width: 50 }}>Ano:</Text>
                                <View style={{ borderWidth: 1, height: 50, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Picker
                                        selectedValue={anoFiltrado}
                                        style={styles.picker}
                                        onValueChange={(itemValue, itemIndex) => setAnoFiltrado(itemValue)}
                                    >
                                        <Picker.Item label='Todos' value="all" />
                                        {[...new Set(despesa.map(item => item.ano))].map((ano, index) => (
                                            <Picker.Item key={index} label={ano} value={ano} />
                                        ))}
                                    </Picker>
                                </View>

                            </View>

                            <View style={styles.filtro}>
                                <Text style={{ width: 50 }}>Mês:</Text>
                                <View style={{ borderWidth: 1, height: 50, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Picker
                                        selectedValue={mesFiltrado}
                                        style={styles.picker}
                                        onValueChange={(itemValue, itemIndex) => setMesFiltrado(itemValue)}
                                    >
                                        <Picker.Item label='Todos' value="all" />
                                        {[...new Set(despesa.map(item => item.mes))].map((mes, index) => (
                                            <Picker.Item key={index} label={mes} value={mes} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            <View style={styles.filtro}>
                                <Text style={{ width: 50 }}>Origem:</Text>
                                <View style={{ borderWidth: 1, height: 50, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Picker
                                        selectedValue={origemFiltrado}
                                        style={styles.picker}
                                        onValueChange={(itemValue, itemIndex) => setOrigemFiltrado(itemValue)}
                                    >
                                        <Picker.Item label='Todos' value="all" />
                                        {[...new Set(despesa.map(item => item.origem))].map((origem, index) => (
                                            <Picker.Item key={index} label={origem} value={origem} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => setModalFiltro(false)}>
                                <Text>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>

                </View>


            </View>





            <TouchableOpacity onPress={() => setModalAdicionar(true)}>
                <Text>ADD</Text>
            </TouchableOpacity>

            <Modal visible={modalAdicionar} transparent={false} animationType='slide'>
                <View style={styles.containerModal}>
                    <View style={styles.tabela}>

                        <View style={styles.containerItem}>

                            <View style={styles.item}>
                                <Text style={[styles.itemPropriedade, styles.title]}>Descrição:</Text>
                            </View>

                            <View style={styles.item}>
                                <Text style={[styles.itemPropriedade, styles.title]}>Valor:</Text>
                            </View>

                            <View style={styles.item}>
                                <Text style={[styles.itemPropriedade, styles.title]}>Origem:</Text>
                            </View>
                        </View>

                        <View style={styles.containerItem}>

                            <View style={styles.item}>
                                <TextInput
                                    placeholder='Descrição'
                                    value={despesa.descricao}
                                    onChangeText={(text) => setNovaDespesa({ ...novaDespesa, descricao: text })}
                                />
                            </View>

                            <View style={styles.item}>
                                <TextInputMask
                                    placeholder='Valor'
                                    type={'money'}
                                    options={{
                                        precision: 2,
                                        separator: ',',
                                        delimiter: '.',
                                        unit: '',
                                        suffixUnit: ''
                                    }}
                                    onChangeText={(text) => {
                                        setNovaDespesa({ ...novaDespesa, valor: (text).replace(/\./g, '').replace(',', '.') });
                                    }}
                                />
                            </View>

                            <View style={styles.item}>
                                <TextInput
                                    placeholder='Origem'
                                    value={despesa.origem}
                                    onChangeText={(text) => setNovaDespesa({ ...novaDespesa, origem: text })}
                                />
                            </View>
                        </View>

                    </View>

                    <View>
                        <TouchableOpacity onPress={() => adicionarDespesa()}>
                            <Text>Adicionar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.tabela}>
                <View style={styles.lista}>
                    <View style={styles.containerItem}>

                        <View style={styles.item}>
                            <Text style={[styles.itemPropriedade, styles.title]}>Descrição:</Text>
                        </View>

                        <View style={styles.item}>
                            <Text style={[styles.itemPropriedade, styles.title]}>Valor:</Text>
                        </View>

                        <View style={styles.item}>
                            <Text style={[styles.itemPropriedade, styles.title]}>Data:</Text>
                        </View>

                        <View style={styles.item}>
                            <Text style={[styles.itemPropriedade, styles.title]}>Origem:</Text>
                        </View>
                    </View>
                </View>

                <FlatList
                    style={styles.lista}
                    data={despesaFiltrada}
                    keyExtractor={item => item.idDespesa.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => selecionarDespesa(item)}>

                            <View style={styles.containerItem}>

                                <View style={styles.item}>
                                    <Text style={styles.itemPropriedade}>{`${item.descricao}`}</Text>
                                </View>

                                <View style={styles.item}>
                                    <Text style={styles.itemPropriedade}>{`R$${(item.valor).replace('.', ',')}`}</Text>
                                </View>

                                <View style={styles.item}>
                                    <Text style={styles.itemPropriedade}>{`${item.dia}/${item.mes}/${item.ano}`}</Text>
                                </View>
                                <View style={styles.item}>
                                    <Text style={styles.itemPropriedade}>{`${item.origem}`}</Text>
                                </View>

                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>

            <Modal visible={modalSelecionar} transparent={false} animationType='slide'>
                {despesaSelecionada && (
                    <View style={styles.containerModal}>

                        <View style={styles.tabela}>
                            <View style={styles.containerItem}>

                                <View style={styles.item}>
                                    <Text style={[styles.itemPropriedade, styles.title]}>Descrição:</Text>
                                </View>
                                <View style={styles.item}>
                                    <Text style={[styles.itemPropriedade, styles.title]}>Valor:</Text>
                                </View>
                                <View style={styles.item}>
                                    <Text style={[styles.itemPropriedade, styles.title]}>Data:</Text>
                                </View>
                                <View style={styles.item}>
                                    <Text style={[styles.itemPropriedade, styles.title]}>Origem:</Text>
                                </View>
                            </View>

                            <View style={styles.containerItem}>

                                <View style={styles.item}>
                                    <TextInput
                                        placeholder='Descrição'
                                        value={despesaSelecionada.descricao}
                                        onChangeText={(text) => setDespesaSelecionada({ ...despesaSelecionada, descricao: text })}
                                    />
                                </View>

                                <View style={styles.item}>
                                    <TextInputMask
                                        placeholder='Valor'
                                        type={'money'}
                                        options={{
                                            precision: 2,
                                            separator: ',',
                                            delimiter: '.',
                                            unit: '',
                                            suffixUnit: ''
                                        }}
                                        value={despesaSelecionada.valor}
                                        onChangeText={(text) => {
                                            setDespesaSelecionada({ ...despesaSelecionada, npm: (text).replace(/\./g, '').replace(',', '.') });
                                        }}
                                    />
                                </View>

                                <View style={styles.item}>
                                    <Text>
                                        {`${despesaSelecionada.dia}/${despesaSelecionada.mes}/${despesaSelecionada.ano}`}
                                    </Text>

                                </View>

                                <View style={styles.item}>
                                    <TextInput
                                        placeholder='Origem'
                                        value={despesaSelecionada.origem}
                                        onChangeText={(text) => setDespesaSelecionada({ ...despesaSelecionada, origem: text })}
                                    />
                                </View>
                            </View>
                        </View>

                        <View>
                            <TouchableOpacity onPress={() => atualizarDespesa(despesaSelecionada)}>
                                <Text>Atualizar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deletarDespesa(despesaSelecionada)}>
                                <Text>Deletar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Modal>

            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        borderWidth: 0,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        ...Platform.select({
            android: {

            }
        })
    },

    containerHeader: {
        borderWidth: 0,
        height: '15%',
        backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            android: {

            }
        })
    },

    tabela: {
        flex: 0.7,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            android: {
                width: '100%',
            }
        })
    },
    lista: {
        borderWidth: 0,
        backgroundColor: 'red',
        width: '50%',
        ...Platform.select({
            android: {
                width: '100%',
            }
        })
    },
    containerItem: {
        borderWidth: 0,
        backgroundColor: 'blue',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 2,
        ...Platform.select({
            android: {

            }
        })
    },
    title: {
        fontWeight: 'bold',
        color: 'black',
        ...Platform.select({
            android: {

            }
        })
    },
    item: {
        borderWidth: 0,
        backgroundColor: 'yellow',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        height: 30,
        flex: 1,
        ...Platform.select({
            android: {
                borderWidth: 1
            }
        })
    },
    itemPropriedade: {
        borderWidth: 0,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            android: {

            }
        })
    },

    containerModal: {
        borderWidth: 1,
        flex: 1,
        backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            android: {

            }
        })
    },

    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    picker: {
        height: 50,
        width: 125,
        color: 'red'
    },
    selectedText: {
        fontSize: 18,
        marginTop: 20,
    },

    filtro: {
        borderWidth: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: '38%',
        marginBottom: 10,
    },

    containerFiltroRow: {
        borderWidth: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: 50,
        width: '100%',
    },
    containerFiltro: {
        borderWidth: 0,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: '100%',
    },

});
