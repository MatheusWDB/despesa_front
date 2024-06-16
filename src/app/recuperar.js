import React, { useState } from "react";
import { Alert, Box, Button, Center, CloseIcon, Divider, FormControl, HStack, Heading, Icon, IconButton, Input, NativeBaseProvider, Stack, Text, VStack } from "native-base";
import axios from "axios";
import { TextInputMask } from "react-native-masked-text";
import { useRouter } from "expo-router";

export default function Recuperar() {

    const router = useRouter()
    const [cpf, setCpf] = useState()
    const [errors, setErrors] = useState({})
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const api = process.env.EXPO_PUBLIC_API

    const validar = () => {
        if (!cpf || cpf.length != 14) {
            setErrors({
                ...errors,
                cpf: 'Preencha corretamente'
            });
            return false;
        }
        return true;
    }

    const enviarEmail = async () => {
        await axios.post(api + 'recuperar', { cpf }).then((response) => {
            setSuccessMessage(`Sua nova senha foi enviada para:\n${response.data.email}`)
            setTimeout(() => {
                router.back()
            }, 5000)

        }).catch((error) => {
            setErrorMessage(error.response.data)
            console.error(error)
        })
    }

    const onSubmit = () => {
        setErrorMessage('')
        validar() ? enviarEmail() : null
    }

    return (
        <NativeBaseProvider>
            <Center w="100%" h="100%" safeArea>
                <Box p="2" w="90%" maxW="290" py="8" safeArea>
                    <Heading size="lg" color="coolGray.800" _dark={{
                        color: "warmGray.50"
                    }} fontWeight="semibold">
                        Digite seu CPF e lhe mandaremos uma nova senha para o email vinculado
                    </Heading>

                    {successMessage ? (
                        <Alert w="100%" status="success" mt="4">
                            <VStack space={2} flexShrink={1} w="100%">
                                <HStack flexShrink={1} space={2} justifyContent="space-between">
                                    <HStack space={2} flexShrink={1}>
                                        <Alert.Icon mt="1" />
                                        <Text fontSize="md" color="coolGray.800">
                                            {successMessage}
                                        </Text>
                                    </HStack>
                                    <IconButton
                                        variant="unstyled"
                                        _focus={{ borderWidth: 0 }}
                                        icon={<CloseIcon size="3" />}
                                        _icon={{ color: "coolGray.600" }}
                                        onPress={() => setSuccessMessage('')}
                                    />
                                </HStack>
                            </VStack>
                        </Alert>
                    ) : null}

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
                        <FormControl isRequired isInvalid={'cpf' in errors}>
                            <FormControl.Label>CPF</FormControl.Label>
                            <TextInputMask
                                style={{ borderWidth: 1, padding: '2%', borderRadius: 4, borderColor: '#d1d5db', fontSize: 12, paddingLeft: 13 }}
                                type={'cpf'}
                                value={cpf}
                                onChangeText={(text) => {
                                    delete errors.cpf
                                    setCpf(text)
                                }} />
                            {'cpf' in errors ? <FormControl.ErrorMessage>{errors.cpf}</FormControl.ErrorMessage> : null}
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