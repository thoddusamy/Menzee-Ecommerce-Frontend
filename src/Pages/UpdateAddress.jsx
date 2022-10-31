import { Box, Button, FormControl, FormLabel, Input, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Api } from '../Config/Api'

const UpdateAddress = () => {

    const toast = useToast()
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            name: '',
            mob_no: '',
            alter_mob_no: '',
            house_no: '',
            street_name: '',
            landmark: '',
            city: '',
            state: '',
            pincode: '',
            country: '',
        },

        onSubmit: async (values, { resetForm }) => {
            try {
                let { data } = await axios.post(`${Api.url}/address/updateaddress`, values, {
                    headers: {
                        Authorization: `${localStorage.getItem("menzee_authToken")}`,
                    },
                })
                toast({
                    title: data.message,
                    status: 'success',
                    position: "top-right",
                    duration: 2500,
                    isClosable: true,
                })
                resetForm({ values: '' })
                navigate('/dashboard/summary/:summary')
            } catch (error) {
                console.log(error);
                toast({
                    title: error.response.data.message,
                    status: 'error',
                    position: "top-right",
                    duration: 2500,
                    isClosable: true,
                })
            }
        }
    })

    return (
        <Box
            display='flex'
            gap={5}
            flexDir='column'
            alignItems='center'
            justifyContent='center'
            bg='white'
            w={{ base: "90vw", md: 'auto' }}
            boxShadow='rgba(0, 0, 0, 0.24) 0px 3px 8px'
            overflow='hidden'
            borderRadius='3px'
            mb={{ base: 3, sm: 0 }}
        >
            <Box w='100%'
                bg='#ff914d'
                textAlign='center'
                py={2}>
                <Text fontSize='2xl'>CHANGE ADDRESS</Text>
            </Box>
            <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
                <FormControl w="100%" display='flex'
                    flexDir='column'
                    gap={3}
                    alignItems='center'
                    justifyContent='center'
                    px={10} py={5}
                >
                    {/* ---------- Box 1 ------------ */}
                    <Box display='flex'
                        flexDir={{ base: 'column', sm: 'row' }}
                        alignItems='center'
                        justifyContent='center'
                        gap={5}
                        w='100%'>
                        <Box w="100%">
                            <FormLabel m={0}>Name</FormLabel>
                            <Input type='text' isRequired
                                name='name' onChange={formik.handleChange} value={formik.values.name} />
                        </Box>
                        <Box w="100%">
                            <FormLabel m={0}>Phone Number</FormLabel>
                            <Input type='number' isRequired
                                name='mob_no' onChange={formik.handleChange} value={formik.values.mob_no} />
                        </Box>
                    </Box>
                    {/* ---------- Box 2 ------------ */}
                    <Box display='flex'
                        flexDir={{ base: 'column', sm: 'row' }}
                        alignItems='center'
                        justifyContent='center'
                        gap={5}
                        w="100%">
                        <Box w="100%">
                            <FormLabel m={0}>Alternative Number</FormLabel>
                            <Input type='number'
                                name='alter_mob_no' onChange={formik.handleChange} value={formik.values.alter_mob_no} />
                        </Box>
                        <Box w="100%">
                            <FormLabel m={0}>House/Plat No</FormLabel>
                            <Input type='text' isRequired
                                name='house_no' onChange={formik.handleChange} value={formik.values.house_no} />
                        </Box>
                    </Box>
                    {/* ---------- Box 3 ------------ */}
                    <Box display='flex'
                        flexDir={{ base: 'column', sm: 'row' }}
                        alignItems='center'
                        justifyContent='center'
                        gap={5} w="100%">
                        <Box w="100%">
                            <FormLabel m={0}>Road/Street Name</FormLabel>
                            <Input type='text' isRequired
                                name='street_name' onChange={formik.handleChange} value={formik.values.street_name} />
                        </Box>
                        <Box w="100%">
                            <FormLabel m={0}>Landmark (optional)</FormLabel>
                            <Input type='text'
                                name='landmark' onChange={formik.handleChange} value={formik.values.landmark} />
                        </Box>
                    </Box>
                    {/* ---------- Box 4 ------------ */}
                    <Box display='flex'
                        flexDir={{ base: 'column', sm: 'row' }}
                        alignItems='center'
                        justifyContent='center'
                        gap={5} w="100%">
                        <Box w="100%">
                            <FormLabel m={0}>City</FormLabel>
                            <Input type='text' isRequired
                                name='city' onChange={formik.handleChange} value={formik.values.city} />
                        </Box>
                        <Box w="100%">
                            <FormLabel m={0}>State</FormLabel>
                            <Input type='text' isRequired
                                name='state' onChange={formik.handleChange} value={formik.values.state} />
                        </Box>
                    </Box>
                    {/* ---------- Box 5 ------------ */}
                    <Box display='flex'
                        flexDir={{ base: 'column', sm: 'row' }}
                        alignItems='center'
                        justifyContent='center'
                        gap={5} w="100%">
                        <Box w='100%'>
                            <FormLabel m={0}>Pincode</FormLabel>
                            <Input type='number' isRequired
                                name='pincode' onChange={formik.handleChange} value={formik.values.pincode} />
                        </Box>
                        <Box w="100%">
                            <FormLabel m={0}>Country</FormLabel>
                            <Input type='text' isRequired
                                name='country' onChange={formik.handleChange} value={formik.values.country} />
                        </Box>
                    </Box>
                    <Box w='100%' mt={5}>
                        <Button w='100%'
                            bg="#ff914d"
                            _hover={{ bg: "#ff914d" }}
                            type="submit">Change Address</Button>
                    </Box>
                </FormControl>
            </form>
        </Box>
    )
}

export default UpdateAddress