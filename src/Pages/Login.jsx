import React, { useEffect, useState } from 'react'
import { Box, Button, Divider, Image, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react'
import { FormControl, FormLabel, FormHelperText } from '@chakra-ui/react'
import { Link, useNavigate } from "react-router-dom"
import { useFormik } from 'formik'
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs'
import { Api } from '../Config/Api'
import axios from "axios"
import { useToast } from '@chakra-ui/react'
import BrandLogo from '../assets/brand_logo.png'


const Login = () => {

    const toast = useToast()
    const navigate = useNavigate()

    const [showHidePass, setShowHidePass] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        let checkToken = localStorage.getItem("menzee_authToken")
        if (checkToken) {
            navigate('/dashboard/tshirts/:tshirts')
        }
    }, [])

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },

        validate: (values) => {
            const errors = {}

            if (values.email.trim().length === 0) {
                errors.email = "Email is required"
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email.trim())) {
                errors.email = "Invalid email address"
            }

            if (values.password.trim().length === 0) {
                errors.password = "Password is required"
            }

            return errors
        },

        onSubmit: async (values, { resetForm }) => {
            try {
                setIsLoading(true)
                let { data } = await axios.post(`${Api.url}/login`, values)
                localStorage.setItem("menzee_authToken", data.token)
                toast({
                    title: data.message,
                    status: 'success',
                    position: "top-right",
                    duration: 3500,
                    isClosable: true,
                })
                resetForm({ values: "" })
                navigate('/dashboard/tshirts/:tshirts')
                setIsLoading(false)
            } catch (error) {
                console.log(error.response.data.message);
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

    return (
        <Box display='flex'
            alignItems='center'
            justifyContent='center'
            h='100vh'
        >
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
                w={{ base: "90vw", md: "400px" }}
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
                    <Text fontSize={"3xl"}>LOGIN</Text>
                </Box>
                <form style={{ width: "100%" }} onSubmit={formik.handleSubmit}>
                    <FormControl display={"flex"}
                        flexDir={"column"} gap={5}
                        pb={3}
                    >
                        <Box>
                            <FormLabel color={"#ff914d"}>Email address</FormLabel>
                            <Input variant='flushed' type='email' name="email" placeholder='Enter your email' onChange={formik.handleChange}
                                borderBottomColor={"#ff914d"} value={formik.values.email = "freeforsignup18@gmail.com"} />
                            {formik.errors.email ? <FormHelperText color={"red"}>{formik.errors.email}</FormHelperText> : <></>}
                        </Box>
                        <Box>
                            <FormLabel color={"#ff914d"}>Password</FormLabel>
                            <InputGroup>
                                <Input variant='flushed' type={showHidePass ? 'text' : 'password'} name='password' placeholder='Enter your password'
                                    onChange={formik.handleChange} borderBottomColor={"#ff914d"} value={formik.values.password = "123456789"} />
                                <InputRightElement cursor={"pointer"} onClick={() => setShowHidePass(!showHidePass)}>
                                    {showHidePass ? <BsFillEyeFill fontSize={"20px"} /> : <BsFillEyeSlashFill fontSize={"20px"} />}
                                </InputRightElement>
                            </InputGroup>
                            {formik.errors.password ? <FormHelperText color={"red"}>{formik.errors.password}</FormHelperText> : <></>}
                            <Text textAlign={"right"} pt={2}>
                                <Link style={{ textDecoration: "underline", color: "#ff914d" }} to="/getmail">forgot password</Link>
                            </Text>
                        </Box>
                        <Button type='submit' color={"white"} bg="#ff914d" _hover={{ bg: "#ff914d" }} isLoading={isLoading}>Login</Button>
                        <Text textAlign={"center"}>New to MenZee? <Link style={{ color: "#ff914d" }} to="/register">register</Link></Text>
                    </FormControl>
                </form>
            </Box>
        </Box>
    )
}

export default Login