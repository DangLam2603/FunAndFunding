import React from 'react'
import { Typography, Avatar, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import './index.css'
function CommentBar({ comment }) {
    const date = new Date(comment.createDate);
    const formattedDate = date.toLocaleDateString();
    return (
        <Box sx={{
            background: '#FFFFFF', height: '170px'
            , borderRadius: '5px', padding: '22px', marginBottom: '15px',
            border: '1px solid rgba(0, 0, 0, 0.3)'
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '600px' }}>
                <Avatar sx={{ width: '60px', height: '60px', marginRight: '10px' }}>
                    {comment.avatarUrl ? <img src={comment.avatarUrl} style={{ width: '60px', height: '60px' }} /> : 'H'}
                </Avatar>
                <Box sx={{ marginRight: '10px' }}>
                    <Typography sx={{ fontSize: '18px', fontWeight: '500' }}>
                        {comment.userName}
                    </Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: '400', color: '#1BAA64' }}>
                        {formattedDate}
                    </Typography>
                </Box>
                <Box sx={{
                    width: '82px', height: '27px', color: '#FFFFFF'
                    , background: '#1BAA64', textAlign: 'center', borderRadius: '8px', display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    Backer
                </Box>

            </Box>
            <Box>
                <Typography sx={{ fontSize: '12px', fontWeight: '400', margin: '10px 0' }}>
                    {comment.content}
                </Typography>
            </Box>
        </Box>

    )
}

export default CommentBar