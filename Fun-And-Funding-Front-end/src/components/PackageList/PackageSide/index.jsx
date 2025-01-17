import React, { useState } from 'react'
import {
    Card, CardContent, CardActions, CardMedia,
    Typography, Divider, Button
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import PackageModal from '../PackageModal';
import Cookies from 'js-cookie';
const PackageSide = ({ packageList, reloadDetail, isButtonActive }) => {
    const token = Cookies.get('_auth')
    const fixedPackageList = packageList && packageList.filter((item) => item.packageTypes === 1)
    const [isLoading, setIsLoading] = useState(false)

    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const handleOpen = (item) => {
        console.log(item)
        setSelectedItem(item);
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setSelectedItem(null);
    };
    const handlePackageDonate = async (item) => {
        console.log(item)
        setIsLoading(true);
        let donateBody =
        {
            "userId": "8C94B07C-209B-4E11-A1B6-BC59E0B29976",
            "packageId": item.id,
            "donateAmount": item.requiredAmount
        }

        console.log(donateBody)
        try {
            await axios.post('https://localhost:7044/api/package-backers', donateBody, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => {
                console.log(res)
                setIsLoading(false);
                setOpenModal(false);
                Swal.fire({
                    title: "Donation Success",
                    text: "Thank you for your donation!",

                    icon: "success"
                });
                reloadDetail()
            })
        } catch (error) {
            setOpenModal(false);
            if (error.status === 401) {

                Swal.fire({
                    title: "Donation Failed",
                    text: "Please Login in Backer role",
                    icon: "error"
                })
            } else {
                Swal.fire({
                    title: "Donation Failed",
                    text: error.response.data._message,
                    icon: "error"
                })
            }
            console.log(error)
        }

        console.log('abcd')
    }


    return (
        <div>
            {fixedPackageList && fixedPackageList.map((item, index) => (
                <Card sx={{
                    borderRadius: 0,
                    border: ".1rem solid rgba(0, 0, 0, 0.12)", mb: 3, mx: 1, position: 'relative', width: '307px',
                    // , height: '399px',
                    cursor: 'pointer',
                }}
                    onClick={() => {
                        if (!isButtonActive) {
                            handleOpen(item)
                        }
                    }}

                    key={index}>
                    <CardMedia
                        component="img"
                        alt="green iguana"
                        image={item.url}
                        sx={{ height: "9rem", objectFit: 'contain' }}
                    />

                    <CardContent>
                        <Typography
                            gutterBottom
                            sx={{ textAlign: "left", fontSize: "18px", fontWeight: 600 }}
                        >
                            {item.name}
                        </Typography>
                        <Typography
                            gutterBottom
                            sx={{ fontWeight: "bold", textAlign: "left", fontSize: "16px", color: '#1BAA64' }}
                        >
                            {item.requiredAmount.toLocaleString('de-DE')} VND
                        </Typography>
                        <Typography
                            gutterBottom
                            sx={{ textAlign: "left", fontSize: "10px", opacity: 0.5 }}
                        >
                            {item.description}
                        </Typography>

                        <Typography sx={{ fontSize: '12px', fontWeight: 500, marginTop: '13px' }}>
                            {item.limitQuantity} items are left
                        </Typography>
                        <Divider />

                    </CardContent>
                    <CardActions>
                        <Button variant="contained" sx={{
                            width: '286px', marginTop: '14px'
                            , backgroundColor: '#1BAA64', fontWeight: 700
                        }}
                            disabled={isButtonActive}
                            // onClick = {() => handlePackageDonate(item)}
                            onClick={() => {
                                if (isButtonActive) {
                                    handleOpen(item);
                                }
                            }}
                        >
                            Pledge {item.requiredAmount.toLocaleString('de-DE')} VND
                        </Button>
                    </CardActions>
                </Card>
            ))}
            {selectedItem && (
                <PackageModal
                    isButtonActive={isButtonActive}
                    open={openModal}
                    handleClose={handleClose}
                    item={selectedItem}
                    onDonate={() => handlePackageDonate(selectedItem)}
                />
            )}
        </div>
    )
}

export default PackageSide
