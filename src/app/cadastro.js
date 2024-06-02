import React, { useState } from "react";
import { Box, Button, Center, FormControl, HStack, Heading, IconButton, Input, Link, NativeBaseProvider, Stack, Text, VStack } from "native-base";
import { router } from "expo-router";
import axios from "axios";
import { Alert } from "react-native";

export default function Cadastro() {

    const [cadastro, setCadastro] = useState({ nome: '', email: '', cpf: '', senha: '' })
    const [confirm, setConfirm] = useState({ senha: '' })
    const [errors, setErrors] = useState({})

    const cadastrar = async () => {
        try {
            const response = await axios.post(`http://192.168.0.8:3000/cadastro`, cadastro)
            Alert.alert(response.data)
            setCadastro({ nome: '', email: '', cpf: '', senha: '' })
            setConfirm({ senha: '' })
            setErrors({})
            router.back()
        } catch (error) {
            Alert.alert(error.response.data)
        }
    }

    const validar = () => {
        if (!cadastro.nome) {
            setErrors({
                ...errors,
                nome: 'Nome requerido'
            });
            return false;
        } else if (!cadastro.email) {
            setErrors({
                ...errors,
                email: 'Email requerido'
            });
            return false;
        } else if (!cadastro.cpf) {
            setErrors({
                ...errors,
                cpf: 'CPF requerido'
            });
            return false;
        } else if (!cadastro.senha) {
            setErrors({
                ...errors,
                senha: 'Senha requerida'
            });
            return false;
        } else if (!confirm.senha) {
            setErrors({
                ...errors,
                confirmSenha: 'Campo requerido'
            });
            return false;
        } else if (confirm.senha !== cadastro.senha) {
            setErrors({
                ...errors,
                confirmSenha: 'Senhas não correspondem'
            });
            return false;
        }
        return true;
    }

    const onSubmit = () => {
        validar() ? cadastrar() : null
    }

    return (
        <NativeBaseProvider>
            <Center w="100%" h="100%">
                <Box safeArea p="2" w="90%" maxW="290" py="8">
                    <Heading size="lg" color="coolGray.800" _dark={{
                        color: "warmGray.50"
                    }} fontWeight="semibold">
                        Bem-vindo
                    </Heading>
                    <Heading mt="1" color="coolGray.600" _dark={{
                        color: "warmGray.200"
                    }} fontWeight="medium" size="xs">
                        Inscreva-se para continuar!
                    </Heading>
                    <VStack space={3} mt="5">
                        <FormControl isRequired isInvalid={'nome' in errors}>
                            <FormControl.Label>Nome</FormControl.Label>
                            <Input value={cadastro.nome} onChangeText={(text) => {
                                delete errors.nome
                                setCadastro({ ...cadastro, nome: text })
                            }} />
                            {'nome' in errors ? <FormControl.ErrorMessage>{errors.nome}</FormControl.ErrorMessage> : null}
                        </FormControl>
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
                            <Input value={cadastro.cpf} onChangeText={(text) => {
                                delete errors.cpf
                                setCadastro({ ...cadastro, cpf: text })
                            }} />
                            {'cpf' in errors ? <FormControl.ErrorMessage>{errors.cpf}</FormControl.ErrorMessage> : null}
                        </FormControl>
                        <FormControl isRequired isInvalid={'senha' in errors}>
                            <FormControl.Label>Senha</FormControl.Label>
                            <Input type="password" value={cadastro.senha} onChangeText={(text) => {
                                delete errors.senha
                                setCadastro({ ...cadastro, senha: text })
                            }} />
                            {'senha' in errors ? <FormControl.ErrorMessage>{errors.senha}</FormControl.ErrorMessage> : null}
                        </FormControl>
                        <FormControl isRequired isInvalid={'confirmSenha' in errors}>
                            <FormControl.Label>Confirme sua senha</FormControl.Label>
                            <Input type="password" value={confirm.senha} onChangeText={(text) => {
                                delete errors.confirmSenha
                                setConfirm({ ...confirm, senha: text })
                            }} />
                            {'confirmSenha' in errors ? <FormControl.ErrorMessage>{errors.confirmSenha}</FormControl.ErrorMessage> : null}
                        </FormControl>
                        <Button mt="2" colorScheme="indigo" onPress={onSubmit}>
                            Inscrever-se
                        </Button>
                    </VStack>
                </Box>
            </Center>
        </NativeBaseProvider>
    )
}