import React, { useEffect, useState } from 'react'
import { Box, Button, Image, Input, Text } from '@chakra-ui/react'
import { FormControl, FormLabel, FormHelperText } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { Api } from '../Config/Api'
import { useFormik } from 'formik'

const SetProfilePic = () => {

    const navigate = useNavigate()
    const toast = useToast()

    const [isLoading, setIsLoading] = useState(false)
    const [pic, setPic] = useState()

    const fetchUserData = async () => {
        try {
            let { data } = await axios.get(`${Api.url}/user`, {
                headers: {
                    Authorization: `${localStorage.getItem("menzee_authToken")}`,
                },
            })
            setPic(data.img)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchUserData()
    }, [])

    const handleGetPic = (pic) => {
        setIsLoading(true)
        if (pic === undefined) {
            toast({
                title: "Please select a pic",
                status: 'error',
                position: "top-right",
                duration: 3500,
                isClosable: true,
            })
            return;
        }
        if (pic.type === "image/jpeg" || pic.type === "image/png") {
            const data = new FormData()
            data.append("file", pic)
            data.append("upload_preset", "menzee")
            data.append("cloud_name", "thoddusamy")
            fetch("https://api.cloudinary.com/v1_1/thoddusamy/image/upload", {
                method: "post",
                body: data
            }).then((res) => res.json()).then((data) => {
                setPic(data.url.toString())
                setIsLoading(false)
            }).catch((error) => {
                console.log(error);
                setIsLoading(false)
            })
        } else {
            setIsLoading(false)
            toast({
                title: 'Invalid file format',
                status: 'error',
                position: "top-right",
                duration: 3500,
                isClosable: true,
            })
            return
        }
    }

    const formik = useFormik({
        initialValues: {
            img: ''
        },

        onSubmit: async (values) => {
            try {
                setIsLoading(true)
                values.img = pic
                const { data } = await axios.put(`${Api.url}/user/updatepic`, values, {
                    headers: {
                        Authorization: `${localStorage.getItem("menzee_authToken")}`,
                    },
                })
                toast({
                    title: data.message,
                    status: 'success',
                    position: "top-right",
                    duration: 3500,
                    isClosable: true,
                })
                setIsLoading(false)
                navigate('/dashboard/tshirts/:tshirts')
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
            h='85vh'>
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
                    <Box border={"1px solid #ff914d"}>
                        <Image w={"150px"} h="150px"
                            src={pic} objectFit='cover' />
                    </Box>
                    <Text>Preview</Text>
                </Box>
                <form style={{ width: "100%" }} onSubmit={formik.handleSubmit}>
                    <FormControl display={"flex"}
                        flexDir={"column"} gap={3}
                        pb={3}
                    >
                        <Box>
                            <FormLabel color={"#ff914d"}>Select a pic</FormLabel>
                            <Input variant='flushed' type='file' onChange={(e) => handleGetPic(e.target.files[0])} />
                            <FormHelperText color={"Green"}>Supported Formats: Jpeg, png</FormHelperText>
                        </Box>
                        <Button type='submit' bg="#ff914d"
                            _hover={{ bg: "#ff914d" }}
                            color="white"
                            mt={1}
                            isLoading={isLoading}>Set Pic</Button>
                    </FormControl>
                </form>
            </Box>
        </Box>
    )
}

export default SetProfilePic