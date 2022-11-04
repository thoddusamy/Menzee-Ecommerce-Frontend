import React, { useEffect, useState } from 'react'
import { Box, Button, Divider, Image, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react'
import { FormControl, FormLabel, FormHelperText } from '@chakra-ui/react'
import { useFormik } from 'formik'
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { Api } from '../Config/Api'
import { useToast } from '@chakra-ui/react'
import BrandLogo from '../assets/brand_logo.png'

const ForgetPassword = () => {

    const navigate = useNavigate()
    const { id, token } = useParams()
    const toast = useToast()

    useEffect(async () => {
        try {
            let checkUrl = await axios.post(`${Api.url}/sendresetlink/checkurl`, { id, token })
            toast({
                title: checkUrl.data.message,
                status: 'success',
                position: "top-right",
                duration: 3500,
                isClosable: true,
            })
        } catch (error) {
            console.log(error);
            toast({
                title: error.response.data.message,
                status: 'error',
                position: "top-right",
                duration: 2500,
                isClosable: true,
            })
            setTimeout(() => {
                navigate('/getmail')
            }, 2000)
        }
    }, [])


    useEffect(() => {
        let checkToken = localStorage.getItem("menzee_authToken")
        if (checkToken) {
            navigate('/dashboard/tshirts/:tshirts')
        }
    }, [])

    const [showHidePass, setShowHidePass] = useState(false)
    const [showHideConPass, setShowHideConPass] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const formik = useFormik({
        initialValues: {
            id,
            password: "",
            confirm_password: ""
        },

        validate: (values) => {
            const errors = {}

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
                let updatePassword = await axios.post(`${Api.url}/resetpassword`, values)
                toast({
                    title: updatePassword.data.message,
                    status: 'success',
                    position: "top-right",
                    duration: 2500,
                    isClosable: true,
                })
                resetForm({ values: '' })
                setIsLoading(false)
                setTimeout(() => {
                    navigate('/')
                }, 2000);
            } catch (error) {
                console.log(error);
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
                    <Text textAlign={"center"} fontSize={"3xl"}>RESET PASSWORD</Text>
                </Box>
                <form style={{ width: "100%" }} onSubmit={formik.handleSubmit}>
                    <FormControl display={"flex"}
                        flexDir={"column"} gap={3}
                        pb={3}
                    >
                        <Box>
                            <FormLabel color={"#ff914d"}>New Password</FormLabel>
                            <InputGroup>
                                <Input variant='flushed' type={showHidePass ? 'text' : 'password'} name='password' placeholder='Enter new password'
                                    onChange={formik.handleChange} value={formik.values.password} borderBottomColor={"#ff914d"} />
                                <InputRightElement cursor={"pointer"} onClick={() => setShowHidePass(!showHidePass)}>
                                    {showHidePass ? <BsFillEyeFill fontSize={"20px"} /> : <BsFillEyeSlashFill fontSize={"20px"} />}
                                </InputRightElement>
                            </InputGroup>
                            {formik.errors.password ? <FormHelperText color={"red"}>{formik.errors.password}</FormHelperText> : <></>}
                        </Box>
                        <Box>
                            <FormLabel color={"#ff914d"}>Confirm New Password</FormLabel>
                            <InputGroup>
                                <Input variant='flushed' type={showHideConPass ? 'text' : 'password'} name='confirm_password' placeholder='Enter confirm new password'
                                    onChange={formik.handleChange} value={formik.values.confirm_password} borderBottomColor={"#ff914d"} />
                                <InputRightElement cursor={"pointer"} onClick={() => setShowHideConPass(!showHideConPass)}>
                                    {showHideConPass ? <BsFillEyeFill fontSize={"20px"} /> : <BsFillEyeSlashFill fontSize={"20px"} />}
                                </InputRightElement>
                            </InputGroup>
                            {formik.errors.confirm_password ? <FormHelperText color={"red"}>{formik.errors.confirm_password}</FormHelperText> : <></>}
                        </Box>
                        <Button type='submit' bg="#ff914d" _hover={{ bg: "#ff914d" }} color={"white"} mt={2} isLoading={isLoading}>Reset Password</Button>
                    </FormControl>
                    <Text textAlign={"center"} color={"#ff914d"} fontSize={"14px"}>Don't close the page. If closed, Link will be expired</Text>
                </form>
            </Box>
        </Box>
    )
}

export default ForgetPassword