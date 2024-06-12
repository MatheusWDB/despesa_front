import React, { useState } from "react";
import { Alert, Box, Button, Center, CloseIcon, FormControl, HStack, Heading, Icon, IconButton, Input, Modal, NativeBaseProvider, Text, VStack } from "native-base";
import { router } from "expo-router";
import axios from "axios";
import { Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TextInputMask } from "react-native-masked-text";

export default function Cadastro() {

    const [cadastro, setCadastro] = useState({ nome: '', email: '', cpf: '', senha: '', telefone: '', dataNascimento: '' })
    const [confirm, setConfirm] = useState({ senha: '' })
    const [errors, setErrors] = useState({})
    const [errorMessage, setErrorMessage] = useState('');
    const [show, setShow] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [modalDados, setModalDados] = useState(false)

    const verificar = async () => {
        await axios.post('http://192.168.0.8:3000/verificar', cadastro).then((response) => {
            setModalDados(true)
        }).catch((error) => {
            setErrorMessage(error.response.data)
        })
    }

    const cadastrar = async () => {
        try {
            const response = await axios.post(`http://192.168.0.8:3000/cadastro`, cadastro)
            setCadastro({ nome: '', email: '', cpf: '', senha: '' })
            setConfirm({ senha: '' })
            setErrors({})
            setModalDados(false)
            setErrorMessage('')
            router.back()
        } catch (error) {
            setErrorMessage(error.response.data);
        }
    }

    const validar = () => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!re.test(String(cadastro.email).toLowerCase())) {
            setErrors({
                ...errors,
                email: 'Preencha corretamente'
            });
            return false;
        } else if (!cadastro.cpf || cadastro.cpf.length != 14) {
            setErrors({
                ...errors,
                cpf: 'Preencha corretamente'
            });
            return false;
        } else if (!cadastro.senha || cadastro.senha.length < 8) {
            setErrors({
                ...errors,
                senha: 'Mínimo 8 caracteres'
            });
            return false;
        } else if (!confirm.senha || confirm.senha !== cadastro.senha) {
            setErrors({
                ...errors,
                confirmSenha: 'Senhas não correspondem'
            });
            return false;
        }
        return true;
    }

    const submitVerificar = () => {
        setErrorMessage('')
        validar() ? verificar() : null
    }

    const validarDados = () => {
        if (!cadastro.nome) {
            setErrors({
                ...errors,
                nome: 'Campo requerido'
            });
            return false;
        } else if (!cadastro.telefone || cadastro.telefone.length != 15) {
            setErrors({
                ...errors,
                telefone: 'Preencha corretamente'
            });
            return false;
        } else if (!cadastro.dataNascimento || cadastro.dataNascimento.length != 10) {
            setErrors({
                ...errors,
                dataNascimento: 'Preencha corretamente'
            });
            return false;
        }
        return true
    }

    const onSubmit = () => {
        validarDados() ? cadastrar() : null
    }

    return (
        <NativeBaseProvider>
            <Center w="100%" h="100%" safeArea>
                <Box p="2" w="90%" maxW="290" py="8" safeArea>
                    <Heading size="lg" color="coolGray.800" _dark={{
                        color: "warmGray.50"
                    }} fontWeight="semibold">
                        Inscreva-se para continuar!
                    </Heading>

                    {errorMessage && !modalDados ? (
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

                    <VStack space={3} mt="5">
                        <FormControl isRequired isInvalid={'email' in errors}>
                            <FormControl.Label>Email</FormControl.Label>
                            <Input value={cadastro.email} onChangeText={(text) => {
                                delete errors.email
                                setCadastro({ ...cadastro, email: text })
                            }} />
                            {'email' in errors ? <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage> : null}
                        </FormControl>

                        <FormControl isRequired isInvalid={'cpf' in errors}>
                            <FormControl.Label>CPF</FormControl.Label>
                            <TextInputMask
                                style={{ borderWidth: 1, padding: '2%', borderRadius: 4, borderColor: '#d1d5db', fontSize: 12, paddingLeft: 13 }}
                                type={'cpf'}
                                value={cadastro.cpf}
                                onChangeText={(text) => {
                                    delete errors.cpf
                                    setCadastro({ ...cadastro, cpf: text })
                                }} />
                            {'cpf' in errors ? <FormControl.ErrorMessage>{errors.cpf}</FormControl.ErrorMessage> : null}
                        </FormControl>

                        <FormControl isRequired isInvalid={'senha' in errors}>
                            <FormControl.Label>Senha</FormControl.Label>
                            <Input
                                value={cadastro.senha}
                                type={show ? "text" : "password"}
                                InputRightElement={<Pressable onPress={() => setShow(!show)}>
                                    <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                                </Pressable>}
                                onChangeText={(text) => {
                                    delete errors.senha
                                    setCadastro({ ...cadastro, senha: text })
                                }} />
                            {'senha' in errors ? <FormControl.ErrorMessage>{errors.senha}</FormControl.ErrorMessage> : null}
                        </FormControl>

                        <FormControl isRequired isInvalid={'confirmSenha' in errors}>
                            <FormControl.Label>Confirme sua senha</FormControl.Label>
                            <Input
                                value={confirm.senha}
                                type={showConfirm ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShowConfirm(!showConfirm)}>
                                    <Icon as={<MaterialIcons name={showConfirm ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                                </Pressable>}
                                onChangeText={(text) => {
                                    delete errors.confirmSenha
                                    setConfirm({ ...confirm, senha: text })
                                }}
                            />
                            {'confirmSenha' in errors ? <FormControl.ErrorMessage>{errors.confirmSenha}</FormControl.ErrorMessage> : null}
                        </FormControl>
                        <Button mt="2" colorScheme="indigo" onPress={submitVerificar}>
                            Inscrever-se
                        </Button>
                    </VStack>
                </Box>
            </Center>
            <>
                <Modal isOpen={modalDados} size="full" animationPreset="fade">
                    <Modal.Content>
                        <Modal.Header>
                            Dados pessoais:
                        </Modal.Header>
                        <Modal.Body>
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

                            <FormControl isRequired isInvalid={'nome' in errors}>
                                <FormControl.Label>Nome</FormControl.Label>
                                <Input value={cadastro.nome} onChangeText={(text) => {
                                    delete errors.nome
                                    setCadastro({ ...cadastro, nome: text })
                                }} />
                                {'nome' in errors ? <FormControl.ErrorMessage>{errors.nome}</FormControl.ErrorMessage> : null}
                            </FormControl>

                            <FormControl isRequired isInvalid={'dataNascimento' in errors}>
                                <FormControl.Label>Data de Nascimento</FormControl.Label>
                                <TextInputMask
                                    style={{ borderWidth: 1, padding: '2%', borderRadius: 4, borderColor: '#d1d5db', fontSize: 12, paddingLeft: 13 }}
                                    type="datetime"
                                    options={{ format: 'DD/MM/YYYY' }}

                                    value={cadastro.dataNascimento}
                                    onChangeText={(text) => {
                                        delete errors.dataNascimento
                                        setCadastro({ ...cadastro, dataNascimento: text })
                                    }} />
                                {'dataNascimento' in errors ? <FormControl.ErrorMessage>{errors.dataNascimento}</FormControl.ErrorMessage> : null}
                            </FormControl>

                            <FormControl isRequired isInvalid={'telefone' in errors}>
                                <FormControl.Label>Telefone</FormControl.Label>
                                <TextInputMask
                                    style={{ borderWidth: 1, padding: '2%', borderRadius: 4, borderColor: '#d1d5db', fontSize: 12, paddingLeft: 13 }}
                                    type="cel-phone"
                                    options={{
                                        maskType: 'BRL',
                                        withDDD: true,
                                        dddMask: '(99) '
                                    }}
                                    value={cadastro.telefone}
                                    onChangeText={(text) => {
                                        delete errors.telefone
                                        setCadastro({ ...cadastro, telefone: text })
                                    }} />
                                {'telefone' in errors ? <FormControl.ErrorMessage>{errors.telefone}</FormControl.ErrorMessage> : null}
                            </FormControl>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button mt="2" colorScheme="indigo" onPress={onSubmit}>
                                Inscrever-se
                            </Button>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </>
        </NativeBaseProvider>
    )
}