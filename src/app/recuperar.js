import React, { useState } from "react";
import { Alert, Box, Button, Center, CloseIcon, Divider, FormControl, HStack, Heading, Icon, IconButton, Input, NativeBaseProvider, Stack, Text, VStack } from "native-base";
import { router } from "expo-router";
import axios from "axios";
import { Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function Recuperar() {

    const [cadastro, setCadastro] = useState({  email: '', cpf: '' })
    const [confirm, setConfirm] = useState({ senha: '' })
    const [errors, setErrors] = useState({})
    const [errorMessage, setErrorMessage] = useState('');
    const [show, setShow] = useState(false);

    const validar = () => {
        if (!cadastro.cpf || cadastro.cpf.length != 14) {
            setErrors({
                ...errors,
                cpf: 'Preencha corretamente'
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
            <Center w="100%" h="100%" safeArea>
                <Box p="2" w="90%" maxW="290" py="8" safeArea>
                    <Heading size="lg" color="coolGray.800" _dark={{
                        color: "warmGray.50"
                    }} fontWeight="semibold">
                        Inscreva-se para continuar!
                    </Heading>

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
                                type={show ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShow(!show)}>
                                    <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                                </Pressable>}
                                onChangeText={(text) => {
                                    delete errors.confirmSenha
                                    setConfirm({ ...confirm, senha: text })
                                }}
                            />
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