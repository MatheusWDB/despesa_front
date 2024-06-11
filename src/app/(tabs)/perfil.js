import React, { useEffect, useState } from "react";
import { Alert, Avatar, Box, Button, Center, CheckIcon, CloseIcon, Container, Divider, FlatList, FormControl, HStack, HamburgerIcon, Heading, Icon, IconButton, Image, Input, Link, Menu, Modal, NativeBaseProvider, Pressable, Select, Spacer, Stack, Text, VStack } from "native-base";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { TextInputMask } from "react-native-masked-text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export default function Perfil() {

    const router = useRouter()
    const [usuario, setUsuario] = useState({})
    const [novoUsuario, setNovoUsuario] = useState({})
    const [modalAlterarSenha, setModalAlterarSenha] = useState(false)
    const [modalAlterarEmail, setModalAlterarEmail] = useState(false)
    const [showSenha, setShowSenha] = useState(false);
    const [showNovaSenha, setShowNovaSenha] = useState(false);
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

    const atualizarPerfil = async () => {
        await axios.put(`http://192.168.0.8:3000/${idU}/atualizar`, novoUsuario).then(function (response) {
            setUsuario(novoUsuario)
        }).catch(function (error) {
            console.error(error.response.data)
        })
    }

    const logout = async () => {
        AsyncStorage.removeItem('token')
        router.replace('/')
    }

    return (
        <NativeBaseProvider>
            <Box flex={1} w="100%" safeArea>
                <Box flex={1} borderWidth={0}>

                    <Box borderWidth={0} my='2.5%' ml='1%'>
                        <Text bold fontSize="xl">Meus dados pessoais:</Text>
                    </Box>

                    <Button.Group borderWidth={0} justifyContent="space-evenly" my='2.5%'>
                        <Button flex={0.4} variant="outline" colorScheme="emerald">Alterar E-mail</Button>
                        <Button flex={0.4} variant="outline" colorScheme="emerald">Alterar Senha</Button>
                    </Button.Group>

                    <Box flex={1} w='100%' borderWidth={0} justifyContent='space-around'>
                        <FormControl borderWidth={0} w='80%' alignSelf='center'>
                            <FormControl.Label>Nome:</FormControl.Label>
                            <Input value={usuario.nome} onChangeText={(text) => setUsuario({ ...usuario, nome: text })} />

                            <FormControl.Label>Telefone:</FormControl.Label>
                            <TextInputMask
                                style={{ borderWidth: 1, padding: '2%', borderRadius: 4, borderColor: '#d1d5db', fontSize: 12, paddingLeft: 13 }}
                                type="cel-phone"
                                options={{
                                    maskType: 'BRL',
                                    withDDD: true,
                                    dddMask: '(99) '
                                }}
                                value={usuario.telefone}
                                onChangeText={(text) => setUsuario({ ...usuario, telefone: text })} />

                            <FormControl.Label>E-mail:</FormControl.Label>
                            <Input value={usuario.email} isDisabled />

                            <FormControl.Label>CPF:</FormControl.Label>
                            <Input value={usuario.cpf} isDisabled />

                            <FormControl.Label>Data de nascimento:</FormControl.Label>
                            <Input value={usuario.dataNascimento} isDisabled />
                        </FormControl>

                        <Button.Group justifyContent='space-evenly'>

                            <Button variant="solid" colorScheme="emerald" onPress={() => {
                                setNovoUsuario(usuario)
                                atualizarPerfil()
                            }} 
                                flex={0.4}>
                                Salvar Alterações
                            </Button>

                            <Button variant="outline" colorScheme="danger" borderColor='danger.500' onPress={logout} flex={0.4}>
                                <HStack borderWidth={0} alignItems='center' justifyContent='space-evenly' w={60}>
                                    <Ionicons size={18} name='exit-outline' color='#f43f5e' />
                                    <Text color='#f43f5e' textAlign='center'>Sair</Text>
                                </HStack>
                            </Button>

                        </Button.Group>
                    </Box>

                </Box>
            </Box>

            <>

            <Modal isOpen={modalAlterarEmail}>

            </Modal>

            <Modal isOpen={modalAlterarSenha}>

            </Modal>

            </>
        </NativeBaseProvider>
    )
}
