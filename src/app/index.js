import React, { useEffect, useState } from "react";
import { Alert, Box, Button, Center, CloseIcon, FormControl, HStack, Heading, Icon, IconButton, Input, NativeBaseProvider, Pressable, Text, VStack } from "native-base";
import { Link, SplashScreen, useRouter } from "expo-router";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode"

export default function Login() {

  const router = useRouter();
  const [login, setLogin] = useState({ email: 'mwendell.dantas@gmail.com', senha: '99318814m' })
  const [errors, setErrors] = useState({})
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingToken, setIsLoadingToken] = useState(false)
  const api = process.env.EXPO_PUBLIC_API

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 5000);

    AsyncStorage.getItem('token').then((token) => {
      if (token) {
        entrarComToken(token)
      }
    })
  }, []);

  const entrarComToken = async (token) => {
    setIsLoadingToken(true)
    const decoded = jwtDecode(token)
    setLogin(decoded.resposta)
    await axios.post(api + `login/token`, { login }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      setLogin({})
      router.replace(`/(tabs)/home`);
      setIsLoadingToken(false)
    }).catch((error) => {
      setIsLoadingToken(false)
      setLogin({ email: 'mwendell.dantas@gmail.com', senha: '99318814m' })
    })

  }

  const entrar = async () => {
    await axios.post(api + `login`, { login }).then((response) => {
      AsyncStorage.setItem('token', response.data.token)
      setLogin({ email: '', senha: '' })
      setErrors({})
      router.replace(`/(tabs)/home`);
    }).catch((error) => {
      setErrorMessage(error.response.data);
    })
  }

  const validar = () => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!re.test(String(login.email).toLowerCase())) {
      setErrors({
        ...errors,
        email: 'Preencha corretamente'
      });
      return false;
    } else if (!login.senha) {
      setErrors({
        ...errors,
        senha: 'Campo requerido'
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
      {!isLoadingToken &&
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
                <Input
                  value={login.senha}
                  onChangeText={(text) => {
                    delete errors.senha
                    setLogin({ ...login, senha: text })
                  }}
                  type={show ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShow(!show)}>
                    <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                  </Pressable>}
                />
                {'senha' in errors ? <FormControl.ErrorMessage>{errors.senha}</FormControl.ErrorMessage> : null}
                <Link alignSelf="flex-end" mt="1" href="/recuperar">
                  <Text fontSize="xs" fontWeight="500" color="indigo.500">
                    Esqueceu a senha?
                  </Text>

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
                <Link href="/cadastro">
                  <Text color="indigo.500" fontWeight="medium" fontSize="sm" underline>
                    Inscrever-se
                  </Text>
                </Link>
              </HStack>
            </VStack>

          </Box>
        </Center>
      }
    </NativeBaseProvider>
  )
}