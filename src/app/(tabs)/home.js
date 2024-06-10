import React, { useEffect, useState } from "react";
import { Alert, Avatar, Box, Button, Center, CheckIcon, CloseIcon, Container, Divider, FlatList, FormControl, HStack, HamburgerIcon, Heading, Icon, IconButton, Image, Input, Link, Menu, Modal, NativeBaseProvider, Pressable, Select, Spacer, Stack, Text, VStack } from "native-base";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { TextInputMask } from "react-native-masked-text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export default function Usuario() {

    const router = useRouter()
    const [usuario, setUsuario] = useState({})
    const [anoFiltrado, setAnoFiltrado] = useState();
    const [despesaFiltrada, setDespesaFiltrada] = useState([]);
    const [despesa, setDespesa] = useState([])
    const [conectarDespesa, setConectarDespesa] = useState(false)
    const [modalAdicionar, setModalAdicionar] = useState(false)
    const [modalSelecionar, setModalSelecionar] = useState(false)
    const [despesaSelecionada, setDespesaSelecionada] = useState(null)
    const [novaDespesa, setNovaDespesa] = useState({})
    const [mesFiltrado, setMesFiltrado] = useState()
    const [origemFiltrado, setOrigemFiltrado] = useState()
    const [show, setShow] = useState(false);
    const [idU, setIdU] = useState(0)

    const decodificarToken = async () => {
        await AsyncStorage.getItem('token').then((token) => {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            axios.defaults.headers.common['Content-Type'] = 'application/json';
            const decoded = jwtDecode(token)
            setIdU(decoded.resposta.idUsuario)
        })
    }

    useEffect(() => {
        decodificarToken()
    }, [])

    const pegarUsuario = async () => {
        await axios.get(`http://192.168.0.8:3000/${idU}/usuario`).then(function (resposta) {
            setUsuario(resposta.data)
        }).catch(function (error) {
            console.error(error)
        })

    }

    useEffect(() => {
        if (idU !== 0) {
            pegarUsuario()
        }
    }, [idU])

    const listarDespesa = async () => {
        await axios.get(`http://192.168.0.8:3000/${idU}/listar`).then(function (resposta) {
            setDespesa(resposta.data);
            setAnoFiltrado('all');
            setMesFiltrado('all');
            setOrigemFiltrado('all');
        }).catch(function (erro) {
            console.error(erro)
        })
    };

    useEffect(() => {
        if (idU !== 0) {
            setAnoFiltrado('')
            setMesFiltrado('')
            setOrigemFiltrado('')
            listarDespesa()
        }
    }, [conectarDespesa, idU]);

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
        setModalSelecionar(!modalSelecionar)
    }

    const adicionarDespesa = async () => {
        await axios.post(`http://192.168.0.8:3000/${idU}/adicionar`, novaDespesa).then(function (resposta) {
            setNovaDespesa({})
            setModalAdicionar(false)
            setConectarDespesa(true)
        }).catch(function (error) {
            console.error(error);
        })
    }

    const atualizarDespesa = async (despesaSelecionada) => {
        const idD = despesaSelecionada.idDespesa
        await axios.put(`http://192.168.0.8:3000/${idD}/atualizar-despesa`, despesaSelecionada).then(function (resposta) {
            setConectarDespesa(true)
            setDespesaSelecionada({})
            setModalSelecionar(false)
        }).catch(function (error) {
            console.error(error);
        })
    }

    const deletarDespesa = async (despesaSelecionada) => {
        const idD = despesaSelecionada.idDespesa
        await axios.put(`http://192.168.0.8:3000/${idD}/deletar`).then(function (resposta) {
            setConectarDespesa(true)
            setDespesaSelecionada({})
            setModalSelecionar(false)
        }).catch(function (error) {
            console.error(error);
        })
    }

    return (
        <NativeBaseProvider>
            <Box flex={1} w="100%" safeArea>

                <Box flex={0.25} w="100%">
                    <Box flex={1} w="100%" mt="5%">
                        <HStack borderWidth="0" flex={1} p="1%">
                            <Menu
                                closeOnSelect={true}
                                trigger={triggerProps => {
                                    return <Pressable {...triggerProps} borderWidth={1} h="38.5%">
                                        <Avatar bg="emerald.500" borderWidth={0} source={{
                                            uri: usuario.imagem
                                        }}>
                                            <FontAwesome6 name="circle-user" size={48} color="black" />
                                        </Avatar>
                                    </Pressable>;
                                }}>
                                <Menu.Item >
                                    Adicionar Foto
                                </Menu.Item>
                                <Menu.Item >
                                    Alterar Foto
                                </Menu.Item>
                                <Menu.Item >
                                    Remover Foto
                                </Menu.Item>
                            </Menu>
                            <VStack ml="2" alignItems="flex-start" borderWidth={0} flex={1}>
                                <Text fontWeight="semibold">Bem-vindo(a)</Text>
                                <Text color="emerald.500" fontSize="xl" bold> {usuario.nome}</Text>
                            </VStack>
                        </HStack>
                        <Center>
                            <Text bold fontSize="2xl">Aqui estão suas despesas:</Text>
                        </Center>
                    </Box>
                </Box>

                <Box borderWidth={0} justifyContent="center" alignItems="center" flex={0.15}>
                    <HStack>
                        <Box alignItems="flex-start" borderWidth={0} flex={1} justifyContent="center" h="100%" pl="2">
                            <Menu
                                borderWidth={1}
                                closeOnSelect={true}
                                trigger={triggerProps => {
                                    return <Pressable {...triggerProps} borderWidth={1} p="2" justifyContent="center" flexDirection="row">
                                        <Text mr="5">Filtrar</Text>
                                        <FontAwesome6 name="sliders" size={24} color="black" />
                                    </Pressable>;
                                }}>
                                <Menu.Group title="Ano">
                                    <Menu.Item>
                                        <Select selectedValue={anoFiltrado} minWidth="120" _selectedItem={{
                                            endIcon: <CheckIcon size="5" />
                                        }} onValueChange={itemValue => setAnoFiltrado(itemValue)}>
                                            <Select.Item label="Todos" value="all" />
                                            {[...new Set(despesa.map(item => item.ano))].map((ano, index) => (
                                                <Select.Item key={index} label={ano} value={ano} />
                                            ))}
                                        </Select>
                                    </Menu.Item>
                                </Menu.Group>

                                <Divider mt="1" w="100%" />

                                <Menu.Group title="Mês">
                                    <Menu.Item>
                                        <Select selectedValue={mesFiltrado} minWidth="120" _selectedItem={{
                                            bg: "teal.600",
                                            endIcon: <CheckIcon size="5" />
                                        }} onValueChange={itemValue => setMesFiltrado(itemValue)}>
                                            <Select.Item label="Todos" value="all" />
                                            {[...new Set(despesa.map(item => item.mes))].map((mes, index) => (
                                                <Select.Item key={index} label={mes} value={mes} />
                                            ))}
                                        </Select>
                                    </Menu.Item>
                                </Menu.Group>

                                <Divider mt="1" w="100%" />

                                <Menu.Group title="Origem">
                                    <Menu.Item>
                                        <Select selectedValue={origemFiltrado} minWidth="120" _selectedItem={{
                                            bg: "teal.600",
                                            endIcon: <CheckIcon size="5" />
                                        }} onValueChange={itemValue => setOrigemFiltrado(itemValue)}>
                                            <Select.Item label="Todos" value="all" />
                                            {[...new Set(despesa.map(item => item.origem))].map((origem, index) => (
                                                <Select.Item key={index} label={origem} value={origem} />
                                            ))}
                                        </Select>
                                    </Menu.Item>
                                </Menu.Group>
                            </Menu>
                        </Box>

                        <Box alignItems="flex-end" borderWidth={0} flex={1} justifyContent="flex-end" h="100%" pr="2">
                            <Pressable onPress={() => setModalAdicionar(true)}>
                                <Ionicons name="add-circle" size={30} color="black" />
                            </Pressable>
                        </Box>

                    </HStack>
                </Box>

                <Box borderWidth={0} flex={0.6} >
                    <Box w="100%" flex={1} borderWidth={0}>

                        <Box borderWidth="1" w="100%" flex={0.15} justifyContent="center">
                            <HStack alignItems="center" >

                                <Box flex={1} borderWidth={0} justifyContent="center" alignItems="center" alignSelf="center" h="30">
                                    <Text bold fontSize="md" alignItems="center" justifyContent="center">
                                        Descricao:
                                    </Text>
                                </Box>

                                <Box flex={1} borderWidth={0} justifyContent="center" alignItems="center" h="30">
                                    <Text bold fontSize="md" alignItems="center" justifyContent="center">
                                        Valor:
                                    </Text>
                                </Box>

                                <Box flex={1} borderWidth={0} justifyContent="center" alignItems="center" h="30">
                                    <Text bold fontSize="md" alignItems="center" justifyContent="center">
                                        Data:
                                    </Text>
                                </Box>

                                <Box flex={1} borderWidth={0} justifyContent="center" alignItems="center" h="30">
                                    <Text bold fontSize="md" alignItems="center" justifyContent="center">
                                        Origem:
                                    </Text>
                                </Box>
                            </HStack>
                        </Box>

                        <FlatList
                            w="100%"
                            flex={1}
                            data={despesaFiltrada}
                            keyExtractor={item => item.idDespesa}
                            renderItem={({ item }) =>
                                <Pressable onPress={() => selecionarDespesa(item)} shadow="1">
                                    <HStack alignItems="center" py="3" borderBottomWidth="1">

                                        <Box flex={1} justifyContent="center" alignItems="center" h="30" alignSelf="center">
                                            <Text _dark={{
                                                color: "warmGray.50"
                                            }} color="coolGray.800" alignItems="center" justifyContent="center">
                                                {item.descricao}
                                            </Text>
                                        </Box>

                                        <Box flex={1} justifyContent="center" alignItems="center" h="30" alignSelf="center">
                                            <Text color="coolGray.600" _dark={{
                                                color: "warmGray.200"
                                            }} bold alignItems="center" justifyContent="center">
                                                {`R$${(item.valor).replace('.', ',')}`}
                                            </Text>
                                        </Box>

                                        <Box flex={1} justifyContent="center" alignItems="center" h="30" alignSelf="center">
                                            <Text color="coolGray.600" _dark={{
                                                color: "warmGray.200"
                                            }} alignItems="center" justifyContent="center">
                                                {`${item.dia}/${item.mes}/${item.ano}`}
                                            </Text>

                                        </Box>
                                        <Box flex={1} justifyContent="center" alignItems="center" h="30" alignSelf="center">

                                            <Text color="coolGray.600" _dark={{
                                                color: "warmGray.200"
                                            }} alignItems="center" justifyContent="center">
                                                {`${item.origem}`}
                                            </Text>
                                        </Box>
                                    </HStack>
                                </Pressable>
                            } />

                    </Box>

                </Box>

            </Box>

            <>
                <Modal isOpen={modalSelecionar} onClose={setModalSelecionar} size="full" animationPreset="fade">
                    <Modal.Content>
                        <Modal.Header>Despesa Selecionada</Modal.Header>
                        <Modal.Body>
                            {despesaSelecionada && (
                                <Box borderWidth={0} flex={1}>
                                    <Box w="100%" flex={1} borderWidth={1}>

                                        <Box borderBottomWidth="2" w="100%" justifyContent="center" flex={1} h={12}>
                                            <HStack alignItems="center" >

                                                <Box flex={1} borderWidth={0} justifyContent="center" alignItems="center" alignSelf="center" h="30">
                                                    <Text bold fontSize="md" alignItems="center" justifyContent="center">
                                                        Descricao:
                                                    </Text>
                                                </Box>

                                                <Box flex={1} borderWidth={0} justifyContent="center" alignItems="center" h="30">
                                                    <Text bold fontSize="md" alignItems="center" justifyContent="center">
                                                        Valor:
                                                    </Text>
                                                </Box>

                                                <Box flex={1} borderWidth={0} justifyContent="center" alignItems="center" h="30">
                                                    <Text bold fontSize="md" alignItems="center" justifyContent="center">
                                                        Data:
                                                    </Text>
                                                </Box>

                                                <Box flex={1} borderWidth={0} justifyContent="center" alignItems="center" h="30">
                                                    <Text bold fontSize="md" alignItems="center" justifyContent="center">
                                                        Origem:
                                                    </Text>
                                                </Box>
                                            </HStack>
                                        </Box>

                                        <Box w="100%" justifyContent="center" flex={1} h={12}>
                                            <HStack alignItems="center" >

                                                <Box flex={1} borderWidth={1} justifyContent="center" alignItems="center" alignSelf="center" h={12}>
                                                    <Input
                                                        textAlign="center"
                                                        variant="unstyled"
                                                        placeholder='Descrição'
                                                        value={despesaSelecionada.descricao}
                                                        onChangeText={(text) => setDespesaSelecionada({ ...despesaSelecionada, descricao: text })}
                                                    />
                                                </Box>

                                                <Box flex={1} borderWidth={1} justifyContent="center" alignItems="center" h={12}>
                                                    <TextInputMask
                                                        textAlign="center"
                                                        placeholder='Valor'
                                                        type={'money'}
                                                        options={{
                                                            precision: 2,
                                                            separator: ',',
                                                            delimiter: '.',
                                                            unit: 'R$',
                                                            suffixUnit: ''
                                                        }}
                                                        value={despesaSelecionada.valor}
                                                        onChangeText={(text) => {
                                                            setDespesaSelecionada({ ...despesaSelecionada, valor: (text).replace(/\.|R\$|^0+/g, '').replace(',', '.') });
                                                        }}
                                                    />
                                                </Box>

                                                <Box flex={1} borderWidth={1} justifyContent="center" alignItems="center" h={12}>
                                                    <Input
                                                        textAlign="center"
                                                        variant="unstyled"
                                                        isDisabled
                                                        value={`${despesaSelecionada.dia}/${despesaSelecionada.mes}/${despesaSelecionada.ano}`}
                                                    />
                                                </Box>

                                                <Box flex={1} borderWidth={1} justifyContent="center" alignItems="center" h={12}>
                                                    <Input
                                                        textAlign="center"
                                                        variant="unstyled"
                                                        placeholder='Origem'
                                                        value={despesaSelecionada.origem}
                                                        onChangeText={(text) => setDespesaSelecionada({ ...despesaSelecionada, origem: (text).toLowerCase().trim() })}
                                                    />
                                                </Box>
                                            </HStack>
                                        </Box>

                                    </Box>
                                </Box>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button variant="solid" colorScheme="danger" onPress={() => { deletarDespesa(despesaSelecionada) }}>
                                    Deletar
                                </Button>
                                <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                    setDespesaSelecionada(null)
                                    setModalSelecionar(false);
                                }}>
                                    Cancelar
                                </Button>
                                <Button colorScheme="emerald" onPress={() => { atualizarDespesa(despesaSelecionada) }}>
                                    Atualizar
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>

                <Modal isOpen={modalAdicionar} onClose={setModalAdicionar} size="full" animationPreset="fade">
                    <Modal.Content>
                        <Modal.Header>Adicionar Despesa</Modal.Header>
                        <Modal.Body>
                            <Box borderWidth={0} flex={1}>
                                <Box w="100%" flex={1} borderWidth={1}>

                                    <Box borderBottomWidth="2" w="100%" justifyContent="center" flex={1} h={12}>
                                        <HStack alignItems="center" >

                                            <Box flex={1} borderWidth={0} justifyContent="center" alignItems="center" alignSelf="center" h="30">
                                                <Text bold fontSize="md" alignItems="center" justifyContent="center">
                                                    Descricao:
                                                </Text>
                                            </Box>

                                            <Box flex={1} borderWidth={0} justifyContent="center" alignItems="center" h="30">
                                                <Text bold fontSize="md" alignItems="center" justifyContent="center">
                                                    Valor:
                                                </Text>
                                            </Box>

                                            <Box flex={1} borderWidth={0} justifyContent="center" alignItems="center" h="30">
                                                <Text bold fontSize="md" alignItems="center" justifyContent="center">
                                                    Data:
                                                </Text>
                                            </Box>

                                            <Box flex={1} borderWidth={0} justifyContent="center" alignItems="center" h="30">
                                                <Text bold fontSize="md" alignItems="center" justifyContent="center">
                                                    Origem:
                                                </Text>
                                            </Box>
                                        </HStack>
                                    </Box>

                                    <Box w="100%" justifyContent="center" flex={1} h={12}>
                                        <HStack alignItems="center" >

                                            <Box flex={1} borderWidth={1} justifyContent="center" alignItems="center" alignSelf="center" h={12}>
                                                <Input
                                                    textAlign="center"
                                                    variant="unstyled"
                                                    placeholder='Descrição'
                                                    onChangeText={(text) => setNovaDespesa({ ...novaDespesa, descricao: text })}
                                                />
                                            </Box>

                                            <Box flex={1} borderWidth={1} justifyContent="center" alignItems="center" h={12}>
                                                <TextInputMask
                                                    textAlign="center"
                                                    placeholder='Valor'
                                                    type={'money'}
                                                    value={novaDespesa.valor ? novaDespesa.valor : 0}
                                                    options={{
                                                        precision: 2,
                                                        separator: ',',
                                                        delimiter: '.',
                                                        unit: 'R$',
                                                        suffixUnit: ''
                                                    }}
                                                    onChangeText={(text) => {
                                                        setNovaDespesa({ ...novaDespesa, valor: (text).replace(/\.|R\$|^0+/g, '').replace(',', '.') });
                                                    }}
                                                />
                                            </Box>

                                            <Box flex={1} borderWidth={1} justifyContent="center" alignItems="center" h={12}>
                                                <Input
                                                    textAlign="center"
                                                    variant="unstyled"
                                                    isDisabled
                                                    value={new Date().toLocaleDateString('pt-BR')}
                                                />
                                            </Box>

                                            <Box flex={1} borderWidth={1} justifyContent="center" alignItems="center" h={12}>
                                                <Input
                                                    textAlign="center"
                                                    variant="unstyled"
                                                    placeholder='Origem'
                                                    onChangeText={(text) => setNovaDespesa({ ...novaDespesa, origem: (text).toLowerCase().trim() })}
                                                />
                                            </Box>
                                        </HStack>
                                    </Box>

                                </Box>
                            </Box>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                    setNovaDespesa({})
                                    setModalAdicionar(false);
                                }}>
                                    Cancelar
                                </Button>
                                <Button colorScheme="emerald" onPress={() => { adicionarDespesa(novaDespesa) }}>
                                    Adicionar
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </>
        </NativeBaseProvider>
    )
}