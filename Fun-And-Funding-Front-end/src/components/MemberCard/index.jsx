import { CardMedia } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import React from 'react';
import CTO from '../../assets/images/CTO.png';

function MemberCard({ imgUrl, name, role, description, secondDescription }) {
    return (
        <Card sx={{ position: 'relative', overflow: 'visible', backgroundColor: '#f4f4f4', borderRadius: '1rem', maxWidth: '20rem' }}>
            <div style={{ position: 'relative', height: '16rem', overflow: 'visible' }}>
                <CardMedia
                    component="img"
                    image={imgUrl != null ? imgUrl : CTO}
                    alt={name}
                    sx={{
                        position: 'absolute',
                        top: '-4rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        objectFit: 'cover',
                        width: '20rem',
                        height: '20rem',
                        backgroundColor: 'transparent'
                    }}
                />
            </div>
            <CardContent sx={{ px: 0, pt: 0, backgroundColor: 'var(--white)', borderRadius: '1rem' }}>
                <div className='bg-[#C6EAD8] w-full h-fit'>
                    <h1 className='!text-[1.5rem] text-left px-[20px] font-bold py-[20px]'>{name}</h1>
                </div>
                <div>
                    <h1 className='!text-[1.2rem] text-left px-[20px] font-bold py-[20px]'>{role}</h1>
                    <p className='text-[1rem] text-left px-[20px] font-medium leading-relaxed pb-[10px]'>
                        {description}
                    </p>
                    <p className='!text-[1rem] text-left px-[20px] font-medium leading-relaxed'>
                        {secondDescription}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export default MemberCard;