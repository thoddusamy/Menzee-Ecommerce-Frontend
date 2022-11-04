import React, { useEffect, useState } from 'react'
import { Box, Button, Divider, HStack, Image, PinInput, PinInputField, Text } from '@chakra-ui/react'
import { FormControl, FormLabel } from '@chakra-ui/react'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { Api } from '../Config/Api'
import BrandLogo from '../assets/brand_logo.png'
import { useContext } from 'react'
import { ContextApi } from '../ContextApi'
import { useTimer } from 'use-timer';

const VerifyOTP = () => {

    const context = useContext(ContextApi)
    const navigate = useNavigate()
    const toast = useToast()

    console.log(context.regEmail);

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        let checkToken = localStorage.getItem("menzee_authToken")
        if (checkToken) {
            navigate('/dashboard/tshirts/:tshirts')
        }
    }, [])

    const formik = useFormik({
        initialValues: {
            email: context.regEmail,
            otp: ''
        },

        onSubmit: async (values, { resetForm }) => {
            try {
                setIsLoading(true)
                const { data } = await axios.post(`${Api.url}/verifyotp`, values)
                toast({
                    title: data.message,
                    status: 'success',
                    position: "top-right",
                    duration: 3500,
                    isClosable: true,
                })
                resetForm({ values: '' })
                context.setRegEmail('')
                navigate('/')
                setIsLoading(false)
            } catch (error) {
                console.log(error);
                toast({
                    title: error.response.data.message,
                    status: 'error',
                    position: "top-right",
                    duration: 3500,
                    isClosable: true,
                })
                setIsLoading(false)
            }
        }
    })

    const { time, start } = useTimer({
        initialTime: 300,
        timerType: 'DECREMENTAL',
        endTime: 0,
        onTimeOver: async () => {
            let { data } = await axios.delete(`${Api.url}/removeotp/${context.regEmail}`)
            toast({
                title: data.message1,
                status: 'error',
                position: "top-right",
                duration: 3500,
                isClosable: true,
            })
            toast({
                title: data.message2,
                status: 'error',
                position: "top-right",
                duration: 3500,
                isClosable: true,
            })
            context.setRegEmail('')
            setTimeout(() => {
                navigate('/register')
            }, 3500);
        }
    });

    useEffect(() => {
        start()
    }, [])

    const handleOTP = (val) => {
        formik.values.otp = val
    }

    return (
        <Box display='flex'
            alignItems='center'
            justifyContent='center'
            h='100vh'>
            <Box
                display={'flex'}
                flexDir="column"
                alignItems='center'
                justifyContent={'center'}
                gap={"20px"}
                bg="white"
                px={10}
                py={5}
                h="auto"
                w={{ base: "90vw", md: "500px" }}
                boxShadow={"rgba(0, 0, 0, 0.1) 0px 4px 12px"}
                borderRadius="2px"
            >
                <Box display={"flex"}
                    alignItems="center"
                    justifyContent={"center"}
                    flexDir="column"
                    gap={2}
                >
                    <Box>
                        <Image w={"auto"} h="80px" src={BrandLogo} alt='brandLogo' />
                        <Divider />
                    </Box>
                    <Text textAlign={"center"} fontSize={"3xl"}>VERIFY OTP</Text>
                </Box>
                <form style={{ width: "100%" }} onSubmit={formik.handleSubmit}>
                    <FormControl display={"flex"}
                        flexDir={"column"} gap={3}
                        pb={3}
                    >
                        <Box alignSelf={"center"} w="auto">
                            <FormLabel color={"#ff914d"}>Enter OTP</FormLabel>
                            <HStack>
                                <PinInput onChange={(e) => handleOTP(e)}
                                    autoFocus placeholder='•'
                                    size={{ base: "sm", md: 'md' }}>
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                </PinInput>
                            </HStack>
                        </Box>
                        <Button type='submit' bg="#ff914d" _hover={{ bg: "#ff914d" }} color="white" mt={1} isLoading={isLoading}>Verify OTP</Button>
                    </FormControl>
                    <Text textAlign={"center"}>OTP Expires in {time} seconds</Text>
                    <Text textAlign={"center"} mt={2} color={"#ff914d"} fontSize={"13px"}>Don't go back & do not close the page</Text>
                </form>
            </Box>
        </Box>
    )
}

export default VerifyOTP