import React, { useEffect, useState } from 'react'
import { Box, Button, Divider, Image, Input, Text } from '@chakra-ui/react'
import { FormControl, FormLabel, FormHelperText } from '@chakra-ui/react'
import { useFormik } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { Api } from '../Config/Api'
import BrandLogo from '../assets/brand_logo.png'
import { IoPlayBackSharp } from 'react-icons/io5'

const GetEmail = () => {
    const navigate = useNavigate()
    const toast = useToast()

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        let checkToken = localStorage.getItem("menzee_authToken")
        if (checkToken) {
            navigate('/dashboard/tshirts/:tshirts')
        }
    }, [])

    const formik = useFormik({
        initialValues: {
            email: ""
        },

        validate: (values) => {
            const errors = {}

            if (values.email.trim().length === 0) {
                errors.email = "Email is required"
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email.trim())) {
                errors.email = "Invalid email address"
            }

            return errors
        },

        onSubmit: async (values, { resetForm }) => {
            try {
                setIsLoading(true)
                const { data } = await axios.post(`${Api.url}/sendresetlink`, values)
                toast({
                    title: data.message,
                    status: 'success',
                    position: "top-right",
                    duration: 3500,
                    isClosable: true,
                })
                resetForm({ values: '' })
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
                    <Text textAlign={"center"} fontSize={"3xl"}>RESET LINK</Text>
                </Box>
                <form style={{ width: "100%" }} onSubmit={formik.handleSubmit}>
                    <FormControl display={"flex"}
                        flexDir={"column"} gap={3}
                        pb={3}
                    >
                        <Box>
                            <FormLabel color={"#ff914d"}>Email address</FormLabel>
                            <Input variant='flushed' type='email' name="email" placeholder='Enter your email address' onChange={formik.handleChange}
                                borderBottomColor={"#ff914d"} value={formik.values.email} />
                            {formik.errors.email ? <FormHelperText color={"red"}>{formik.errors.email}</FormHelperText> : <></>}
                        </Box>
                        <Button type='submit' bg="#ff914d" _hover={{ bg: "#ff914d" }} color="white" mt={1} isLoading={isLoading}>Get Reset Link</Button>
                    </FormControl>
                    <Text
                        textAlign="center"
                        display={"flex"}
                        alignItems="center"
                        justifyContent={"center"}
                        gap={2}
                        fontSize="14px"
                        textDecoration={"underline"}
                        color="#ff914d"
                    >
                        <IoPlayBackSharp />
                        <Link to='/' >Go back</Link>
                    </Text>
                </form>
            </Box>
        </Box>
    )
}

export default GetEmail