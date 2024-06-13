import React, { useEffect, useState } from "react";
import { Alert, Box, Button, Center, CloseIcon, FormControl, HStack, IconButton, Input, Menu, Modal, NativeBaseProvider, Pressable, Select, Spacer, Stack, Text, VStack } from "native-base";
import { useRouter } from "expo-router";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { TextInputMask } from "react-native-masked-text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export default function Perfil() {

    const router = useRouter()
    const [usuario, setUsuario] = useState({})
    const [modalAlterarSenha, setModalAlterarSenha] = useState(false)
    const [showSenha, setShowSenha] = useState(false);
    const [showNovaSenha, setShowNovaSenha] = useState(false);
    const [idU, setIdU] = useState(0)
    const [errors, setErrors] = useState({})
    const [errorMessage, setErrorMessage] = useState('');
    const [modalSenha, setModalSenha] = useState(false)

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

    const submitAtualizar = () => {
        setErrorMessage('')
        validar() ? atualizarPerfil() : null
    }

    const submitAtualizarSenha = () => {
        setErrorMessage('')
        validarSenha() ? atualizarPerfil() : null
    }

    const validar = () => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!re.test(String(usuario.email).toLowerCase())) {
            setErrors({
                ...errors,
                email: 'Preencha corretamente'
            });
            return false;
        } else if (!usuario.telefone || usuario.telefone.length != 15) {
            setErrors({
                ...errors,
                telefone: 'Preencha corretamente'
            });
            return false
        } else if (!usuario.nome) {
            setErrors({
                ...errors,
                nome: 'Campo obrigatório'
            });
            return false
        }
        return true
    }
    const validarSenha = () => {
        if (!usuario.novaSenha || usuario.novaSenha.length < 8) {
            setErrors({
                ...errors,
                novaSenha: 'Mínimo 8 caracteres'
            });
            return false;
        } else if (!usuario.confirmSenha || usuario.confirmSenha !== usuario.novaSenha) {
            setErrors({
                ...errors,
                confirmSenha: 'Senhas não correspondem'
            });
            return false;
        }
        return true;
    }

    const atualizarPerfil = async () => {
        await axios.put(`http://192.168.0.8:3000/${idU}/atualizar`, { usuario }).then(function (response) {
            setErrorMessage('')
            delete usuario.senha
            delete usuario.novaSenha
            delete usuario.confirmSenha
            setModalSenha(false)
            setModalAlterarSenha(false)
        }).catch(function (error) {
            setErrorMessage(error.response.data)
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

                    {errorMessage ? (
                        <Alert w="100%" status="error" mt="4">
                            <VStack space={2} flexShrink={1} w="100%">
                                <HStack flexShrink={1} space={2} justifyContent="space-between">
                                    <HStack space={2} flexShrink={1}>
                                        <Alert.Icon mt="1" />
                                        <Text fontSize="md" color="coolGray.800">
                                            {errorMessage}
                                        </Text>
                                    </HStack>
                                    <IconButton
                                        variant="unstyled"
                                        _focus={{ borderWidth: 0 }}
                                        icon={<CloseIcon size="3" />}
                                        _icon={{ color: "coolGray.600" }}
                                        onPress={() => setErrorMessage('')}
                                    />
                                </HStack>
                            </VStack>
                        </Alert>
                    ) : null}

                    <Box flex={1} w='100%' borderWidth={0} justifyContent='space-around'>
                        <FormControl borderWidth={0} w='80%' alignSelf='center' isInvalid={'nome' in errors}>
                            <FormControl.Label>Nome:</FormControl.Label>
                            <Input value={usuario.nome} onChangeText={(text) => {
                                delete errors.nome
                                setUsuario({ ...usuario, nome: text })
                            }} />
                            {'nome' in errors ? <FormControl.ErrorMessage>{errors.nome}</FormControl.ErrorMessage> : null}
                        </FormControl>

                        <FormControl borderWidth={0} w='80%' alignSelf='center' isInvalid={'telefone' in errors}>
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
                                onChangeText={(text) => {
                                    delete errors.telefone
                                    setUsuario({ ...usuario, telefone: text })
                                }} />
                            {'telefone' in errors ? <FormControl.ErrorMessage>{errors.telefone}</FormControl.ErrorMessage> : null}
                        </FormControl>

                        <FormControl borderWidth={0} w='80%' alignSelf='center'>
                            <FormControl.Label>E-mail:</FormControl.Label>
                            <Input value={usuario.email} onChangeText={(text) => {
                                delete errors.email
                                setUsuario({ ...usuario, email: text })
                            }} />
                            {'email' in errors ? <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage> : null}
                        </FormControl>

                        <FormControl borderWidth={0} w='80%' alignSelf='center'>
                            <FormControl.Label>CPF:</FormControl.Label>
                            <Input value={usuario.cpf} isDisabled />
                        </FormControl >

                        <FormControl borderWidth={0} w='80%' alignSelf='center'>
                            <FormControl.Label>Data de nascimento:</FormControl.Label>
                            <Input value={usuario.dataNascimento} isDisabled />
                        </FormControl>

                        <Button.Group borderWidth={0} justifyContent="space-evenly" my='2.5%'>
                            <Button flex={0.4} variant="outline" colorScheme="emerald" onPress={() => setModalAlterarSenha(true)}>Alterar Senha</Button>
                        </Button.Group>

                        <Button.Group justifyContent='space-evenly'>

                            <Button variant="solid" colorScheme="emerald" onPress={() => setModalSenha(true)}
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
            </Box >

            <>
                <Modal isOpen={modalAlterarSenha} onClose={setModalAlterarSenha} size="full" animationPreset="fade">
                    <Modal.Content>
                        <Modal.Body>
                            <FormControl>
                                <FormControl.Label>Digite sua senha atual:</FormControl.Label>
                                <Input
                                    placeholder="Senha"
                                    value={usuario.senha}
                                    onChangeText={(text) => {
                                        setUsuario({ ...usuario, senha: text })}}
                                />
                            </FormControl>
                            <FormControl isRequired isInvalid={'novaSenha' in errors}>
                                <FormControl.Label>Digite a nova senha:</FormControl.Label>
                                <Input
                                    placeholder="Nova Senha"
                                    value={usuario.novaSenha}
                                    onChangeText={(text) => {
                                        delete errors.novaSenha
                                        setUsuario({ ...usuario, novaSenha: text })}}
                                />
                                {'novaSenha' in errors ? <FormControl.ErrorMessage>{errors.novaSenha}</FormControl.ErrorMessage> : null}
                            </FormControl>
                            <FormControl isRequired isInvalid={'confirmSenha' in errors}>
                                <FormControl.Label>Confirme a senha:</FormControl.Label>
                                <Input
                                    placeholder="Confirme a Senha"
                                    value={usuario.confirmSenha}
                                    onChangeText={(text) => {
                                        delete errors.confirmSenha
                                        setUsuario({ ...usuario, confirmSenha: text })}}
                                />
                                {'confirmSenha' in errors ? <FormControl.ErrorMessage>{errors.confirmSenha}</FormControl.ErrorMessage> : null}
                            </FormControl>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group>
                                <Button variant="solid" colorScheme="emerald"
                                    onPress={submitAtualizarSenha}>
                                    Salvar Alterações
                                </Button>
                                <Button variant="outline" colorScheme="danger" onPress={() => {
                                    delete usuario.senha
                                    delete usuario.novaSenha
                                    delete usuario.confirmSenha
                                    setModalAlterarSenha(false)
                                }}>
                                    Cancelar
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>

                <Modal isOpen={modalSenha} onClose={setModalSenha} size="full" animationPreset="fade">
                    <Modal.Content>
                        <Modal.Body>
                            <FormControl>
                                <FormControl.Label>Digite sua senha:</FormControl.Label>
                                <Input
                                    placeholder="Senha"
                                    value={usuario.senha}
                                    onChangeText={(text) => setUsuario({ ...usuario, senha: text })}
                                />
                            </FormControl>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group>
                                <Button variant="solid" colorScheme="emerald"
                                    onPress={submitAtualizar}>
                                    Salvar Alterações
                                </Button>
                                <Button variant="outline" colorScheme="danger" onPress={() => {
                                    delete usuario.senha
                                    setModalSenha(false)
                                }}>
                                    Cancelar
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>

            </>
        </NativeBaseProvider >
    )
}
