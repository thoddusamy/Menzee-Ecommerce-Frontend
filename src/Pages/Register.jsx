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
import { useContext } from 'react'
import { ContextApi } from '../ContextApi'

const Register = () => {

    const navigate = useNavigate()
    const context = useContext(ContextApi)

    useEffect(() => {
        let checkToken = localStorage.getItem("menzee_authToken")
        if (checkToken) {
            navigate('/dashboard/tshirts')
        }
    }, [])

    const toast = useToast()

    const [showHidePass, setShowHidePass] = useState(false)
    const [showHideConPass, setShowHideConPass] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirm_password: ""
        },

        validate: (values) => {
            const errors = {}

            if (values.name.trim().length === 0) {
                errors.name = "Name is required"
            }

            if (values.email.trim().length === 0) {
                errors.email = "Email is required"
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email.trim())) {
                errors.email = "Invalid email address"
            }

            if (values.password.trim().length === 0) {
                errors.password = "Password is required"
            } else if (values.password.trim().length < 8) {
                errors.password = "password length should be minimum 8charaters"
            }

            if (values.confirm_password.trim().length === 0) {
                errors.confirm_password = "Confrim password is required"
            }

            if (values.password.trim() !== values.confirm_password.trim()) {
                errors.password = "password & confirm password not same"
                errors.confirm_password = "password & confirm password not same"
            }

            return errors
        },

        onSubmit: async (values, { resetForm }) => {
            try {
                setIsLoading(true)
                const { data } = await axios.post(`${Api.url}/register`, values)
                context.setRegEmail(values.email)
                resetForm({ values: '' })
                toast({
                    title: data.message,
                    status: 'success',
                    position: "top-right",
                    duration: 3500,
                    isClosable: true,
                })
                navigate('/verifyotp')
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
                alignSelf='center'
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
                    <Text fontSize={"3xl"}>REGISTER</Text>
                </Box>
                <form style={{ width: "100%" }} onSubmit={formik.handleSubmit}>
                    <FormControl display={"flex"}
                        flexDir={"column"} gap={3}
                        pb={3}
                    >
                        <Box>
                            <FormLabel color={"#ff914d"}>Name</FormLabel>
                            <Input variant='flushed' type='text' name="name" placeholder='Enter your name' onChange={formik.handleChange}
                                value={formik.values.name} borderBottomColor={"#ff914d"} />
                            {formik.errors.name ? <FormHelperText color={"red"}>{formik.errors.name}</FormHelperText> : <></>}
                        </Box>
                        <Box>
                            <FormLabel color={"#ff914d"}>Email address</FormLabel>
                            <Input variant='flushed' type='email' name="email" placeholder='Enter your email' onChange={formik.handleChange}
                                value={formik.values.email} borderBottomColor={"#ff914d"} />
                            {formik.errors.email ? <FormHelperText color={"red"}>{formik.errors.email}</FormHelperText> : <></>}
                        </Box>
                        <Box>
                            <FormLabel color={"#ff914d"}>Password</FormLabel>
                            <InputGroup>
                                <Input variant='flushed' type={showHidePass ? 'text' : 'password'} name='password' placeholder='Enter your password'
                                    onChange={formik.handleChange} value={formik.values.password} borderBottomColor={"#ff914d"} />
                                <InputRightElement cursor={"pointer"} onClick={() => setShowHidePass(!showHidePass)}>
                                    {showHidePass ? <BsFillEyeFill fontSize={"20px"} /> : <BsFillEyeSlashFill fontSize={"20px"} />}
                                </InputRightElement>
                            </InputGroup>
                            {formik.errors.password ? <FormHelperText color={"red"}>{formik.errors.password}</FormHelperText> : <></>}
                        </Box>
                        <Box>
                            <FormLabel color={"#ff914d"}>Confirm Password</FormLabel>
                            <InputGroup>
                                <Input variant='flushed' type={showHideConPass ? 'text' : 'password'} name='confirm_password' placeholder='Enter your confirm password'
                                    onChange={formik.handleChange} value={formik.values.confirm_password} borderBottomColor={"#ff914d"} />
                                <InputRightElement cursor={"pointer"} onClick={() => setShowHideConPass(!showHideConPass)}>
                                    {showHideConPass ? <BsFillEyeFill fontSize={"20px"} /> : <BsFillEyeSlashFill fontSize={"20px"} />}
                                </InputRightElement>
                            </InputGroup>
                            {formik.errors.confirm_password ? <FormHelperText color={"red"}>{formik.errors.confirm_password}</FormHelperText> : <></>}
                        </Box>
                        <Button type='submit' bg="#ff914d" _hover={{ bg: "#ff914d" }} color="white" mt={1} isLoading={isLoading}>Register</Button>
                        <Text textAlign="center">Are you MenZee user? <Link style={{ color: "#ff914d" }} to="/">login</Link></Text>
                    </FormControl>
                </form>
            </Box>
        </Box>
    )
}

export default Register