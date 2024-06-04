import React, { useEffect, useState } from "react";
import { Alert, Avatar, Box, Button, Center, CheckIcon, CloseIcon, Container, Divider, FlatList, FormControl, HStack, HamburgerIcon, Heading, Icon, IconButton, Image, Input, Link, Menu, NativeBaseProvider, Pressable, Select, Spacer, Stack, Text, VStack } from "native-base";
import { SplashScreen, router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { FontAwesome6 } from "@expo/vector-icons";


export default function Login() {

    const usuario = useLocalSearchParams()
    const idU = usuario.idUsuario
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
        <NativeBaseProvider>
            <Box h="100%" safeArea>

                <Heading fontSize="xl" p="4" h="30%" alignItems="center" justifyContent="center">

                    <HStack w="100%" borderWidth={1} bg="amber.100" >
                        <Pressable>
                            <Image source={usuario.imagem ? null : <FontAwesome6 name="circle-user" size={50} color="black" /> }/>
                                                       
                        </Pressable>

                        <VStack ml="2" alignItems="flex-start">
                            <Text>Bem-vindo(a)</Text>
                            <Text color="emerald.500" fontSize="xl" bold> {usuario.nome}</Text>
                        </VStack>

                    </HStack>

                </Heading>

                <Box alignItems="flex-end" mr="2" borderWidth={0} justifyContent="center" h="10%">
                    <Menu borderWidth={1} closeOnSelect={false} placement="bottom right" onOpen={() => console.log("opened")} onClose={() => console.log("closed")} trigger={triggerProps => {
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

                        <Divider mt="3" w="100%" />

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

                        <Divider mt="3" w="100%" />

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

                <Box borderWidth="1" maxH="50%" alignItems="center" justifyContent="center">
                    <Box borderBottomWidth="1" w="100%">
                        <HStack alignItems="center" py="2">

                            <Box flex="1" borderWidth={0} justifyContent="center" alignItems="center" alignSelf="center" h="30">
                                <Text bold fontSize="md" alignItems="center" justifyContent="center">
                                    Descricao:
                                </Text>
                            </Box>

                            <Box flex="1" borderWidth={0} justifyContent="center" alignItems="center" h="30">
                                <Text bold fontSize="md" alignItems="center" justifyContent="center">
                                    Valor:
                                </Text>
                            </Box>

                            <Box flex="1" borderWidth={0} justifyContent="center" alignItems="center" h="30">
                                <Text bold fontSize="md" alignItems="center" justifyContent="center">
                                    Data:
                                </Text>
                            </Box>

                            <Box flex="1" borderWidth={0} justifyContent="center" alignItems="center" h="30">
                                <Text bold fontSize="md" alignItems="center" justifyContent="center">
                                    Origem:
                                </Text>
                            </Box>
                        </HStack>
                    </Box>

                    <FlatList
                        w="100%"
                        data={despesaFiltrada}
                        keyExtractor={item => item.idDespesa}
                        renderItem={({ item }) =>
                            <Pressable onPress={() => selecionarDespesa(item)} shadow="1">
                                <HStack alignItems="center" py="2" borderBottomWidth="1">

                                    <Box flex="1" justifyContent="center" alignItems="center" h="30" alignSelf="center">
                                        <Text _dark={{
                                            color: "warmGray.50"
                                        }} color="coolGray.800" alignItems="center" justifyContent="center">
                                            {item.descricao}
                                        </Text>
                                    </Box>

                                    <Box flex="1" justifyContent="center" alignItems="center" h="30" alignSelf="center">
                                        <Text color="coolGray.600" _dark={{
                                            color: "warmGray.200"
                                        }} bold alignItems="center" justifyContent="center">
                                            {`R$${item.valor}`}
                                        </Text>
                                    </Box>

                                    <Box flex="1" justifyContent="center" alignItems="center" h="30" alignSelf="center">
                                        <Text color="coolGray.600" _dark={{
                                            color: "warmGray.200"
                                        }} alignItems="center" justifyContent="center">
                                            {`${item.dia}/${item.mes}/${item.ano}`}
                                        </Text>

                                    </Box>
                                    <Box flex="1" justifyContent="center" alignItems="center" h="30" alignSelf="center">

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
        </NativeBaseProvider>
    )
}
