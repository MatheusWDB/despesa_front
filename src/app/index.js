import React, { useState } from "react";
import { Box, Button, Center, FormControl, HStack, Heading, IconButton, Input, Link, NativeBaseProvider, Stack, Text, VStack } from "native-base";
import { SplashScreen, router } from "expo-router";
import axios from "axios";
import { Alert } from "react-native";


export default function Login() {

  SplashScreen.preventAutoHideAsync();
  setTimeout(SplashScreen.hideAsync, 5000);
  const [login, setLogin] = useState({ email: '', senha: '' })
  const [errors, setErrors] = useState({})

  const entrar = async () => {
    try {
      const response = await axios.post(`http://192.168.0.8:3000/login`, login)
      setLogin({ email: '', senha: '' })
      setErrors({})
      router.replace('home/[idU]')
      router.setParams({ idU: response.data.idUsuario })
    } catch (error) {
      Alert.alert(error.response.data);
    }
  }

  const validar = () => {
    if (!login.email) {
      setErrors({
        ...errors,
        email: 'Email requerido'
      });
      return false;
    } else if (!login.senha) {
      setErrors({
        ...errors,
        senha: 'Senha requerida'
      });
      return false;
    }
    return true;
  }

  const onSubmit = () => {
    validar() ? entrar() : null
  };

  return (
    <NativeBaseProvider>
      <Center w="100%" h="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
            color: "warmGray.50"
          }}>
            Bem-vindo
          </Heading>
          <Heading mt="1" _dark={{
            color: "warmGray.200"
          }} color="coolGray.600" fontWeight="medium" size="xs">
            Faça login para continuar!
          </Heading>

          <VStack space={3} mt="5">
            <FormControl isRequired isInvalid={'email' in errors}>
              <FormControl.Label>Email</FormControl.Label>
              <Input value={login.email} onChangeText={(text) => {
                delete errors.email
                setLogin({ ...login, email: text })
              }} />
              {'email' in errors ? <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage> : null}
            </FormControl>
            <FormControl isRequired isInvalid={'senha' in errors}>
              <FormControl.Label>Senha</FormControl.Label>
              <Input type="password" value={login.senha} onChangeText={(text) => {
                delete errors.senha
                setLogin({ ...login, senha: text })
              }} />
              {'senha' in errors ? <FormControl.ErrorMessage>{errors.senha}</FormControl.ErrorMessage> : null}
              <Link _text={{
                fontSize: "xs",
                fontWeight: "500",
                color: "indigo.500"
              }} alignSelf="flex-end" mt="1">
                Esqueceu a senha?
              </Link>
            </FormControl>
            <Button mt="2" colorScheme="indigo" onPress={onSubmit}>
              Entrar
            </Button>
            <HStack mt="6" justifyContent="center">
              <Text fontSize="sm" color="coolGray.600" _dark={{
                color: "warmGray.200"
              }}>
                Sou um novo usuário.{" "}
              </Text>
              <Link _text={{
                color: "indigo.500",
                fontWeight: "medium",
                fontSize: "sm"
              }} onPress={() => {
                setErrors({})
                router.navigate('cadastro')
              }}>
                Inscrever-se
              </Link>
            </HStack>
          </VStack>
        </Box>
      </Center>
    </NativeBaseProvider>
  )
}