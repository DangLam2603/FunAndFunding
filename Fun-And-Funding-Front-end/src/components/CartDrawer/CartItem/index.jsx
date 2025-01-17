import DeleteIcon from '@mui/icons-material/Delete';
import { CircularProgress, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import NoImage from '../../../assets/images/no-image.png';

function CartItem({ itemDetail, handleDeleteCartItem }) {
    const [item, setItem] = useState(itemDetail.marketplaceProject);
    const [createdDate, setCreatedDate] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        setItem(itemDetail.marketplaceProject);
        setCreatedDate(itemDetail.createdDate);
        if (itemDetail && itemDetail.marketplaceProject.marketplaceFiles.length >= 0) {
            const projectThumbnail = itemDetail.marketplaceProject.marketplaceFiles.find(
                (file) => file.fileType === 2
            );
            if (projectThumbnail) {
                setThumbnail(projectThumbnail);
            }
        }
    }, [itemDetail]);

    const formatDate = (date) => {
        const formattedDate = new Date(date);
        const day = String(formattedDate.getDate()).padStart(2, '0');
        const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
        const year = formattedDate.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US').format(price);
    };

    const deleteCartItem = async (id) => {
        try {
            setIsDeleting(true);
            await handleDeleteCartItem(id);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='flex flex-row justify-between items-center gap-[1rem] h-[5rem] mb-[1.5rem]'>
            <div className='!w-[5rem] !h-[5rem] flex-shrink-0'>
                {thumbnail ?
                    <img className='w-[5rem] h-[5rem] object-cover rounded-[0.25rem]' src={thumbnail.url} alt={thumbnail.name} />
                    :
                    <img className='w-[5rem] h-[5rem] object-cover rounded-[0.25rem]' src={NoImage} alt='No Image Available' />
                }
            </div>
            <div className='w-full flex-grow h-full flex flex-row justify-between items-center'>
                <div className='flex flex-col justify-between h-full'>
                    <div className='w-full flex-grow'>
                        <Typography
                            sx={{
                                fontWeight: "600",
                                fontSize: "1rem",
                                color: "var(--black)",
                                textAlign: "left",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                maxWidth: "15rem"
                            }}
                        >
                            {item.name}
                        </Typography>
                        <Typography
                            sx={{
                                fontWeight: "300",
                                fontSize: "0.875rem",
                                color: "var(--black)",
                                textAlign: "left",
                            }}
                        >
                            Added date: {formatDate(createdDate)}
                        </Typography>
                    </div>
                    <Typography
                        sx={{
                            fontWeight: "600",
                            fontSize: "1rem",
                            color: "var(--primary-green)",
                            textAlign: "left",
                            flexShrink: 0
                        }}
                    >
                        {formatPrice(item.price)} VND
                    </Typography>
                </div>
                <div>
                    <Tooltip title="Remove from cart" placement="bottom">
                        <IconButton onClick={() => deleteCartItem(item.id)}>
                            {isDeleting ? (
                                <CircularProgress size={20} sx={{ color: 'var(--black)' }} />
                            ) : (
                                <DeleteIcon sx={{ color: 'var(--black)' }} />
                            )}
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}

export default CartItem;