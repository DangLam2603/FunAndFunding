import React, { useState, useEffect } from 'react'
import CommentBar from './CommentBar'
import { Box, Typography, Avatar, TextField, Button } from '@mui/material';
import userApiInstace from '../../utils/ApiInstance/userApiInstance';
import commentApiInstace from '../../utils/ApiInstance/commentApiInstance';
import Cookie from 'js-cookie';
const CommentSection = ({ isBacker, projectId }) => {
  const token = Cookie.get("_auth");
  console.log(token);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState({});
  const present = Date.now();
  const formattedDate = new Date(present).toLocaleDateString();
  // get comment list
  const fetchComment = async () => {
    commentApiInstace.get(`/funding/${projectId}`).then(res => {
      console.log(res.data);
      setComments(res.data);
    })
  }
  // get user info

  const getUser = async () => {
    token && userApiInstace.get("/info", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      setUser(res.data._data);
      console.log(res.data);
    })
  }
  useEffect(() => {
    fetchComment();
    getUser();
  }, [])

  //handle addComment
  const addComment = async () => {
    //comment body
    const commentBody =
    {
      "content": comment,
      "projectId": projectId
    }

    commentApiInstace.post("/funding", commentBody, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      fetchComment();
      console.log(res);
    })
  }
  return (
    <>
      <Box>
        {isBacker
          ? (
            <Box sx={{
              background: '#FFFFFF'
              , borderRadius: '5px', padding: '22px', marginBottom: '15px',
              border: '1px solid rgba(0, 0, 0, 0.3)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ width: '60px', height: '60px', marginRight: '10px' }}>
                  {user.avatar ? <img src={user.avatar} style={{ width: '60px', height: '60px' }} /> : 'H'
                  }</Avatar>
                <Box sx={{ marginRight: '10px' }}>
                  <Typography sx={{ fontSize: '18px', fontWeight: '500' }}>
                    {user.fullName}
                  </Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: '400', color: '#1BAA64' }}>
                    {formattedDate}
                  </Typography>
                </Box>

              </Box>
              <Box sx={{ margin: '20px 10px' }}>
                <TextField
                  id="outlined-multiline-static"
                  placeholder='Write your comment here...'
                  sx={{ width: '600px' }}
                  multiline
                  rows={2}
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '600px' }}>
                  <Button sx={{
                    color: '#FFFFFF', background: '#1BAA64', width: '143px', fontSize: '12px',
                    height: '21px', marginTop: '8px'
                  }}
                    onClick={addComment}>
                    Comment
                  </Button>
                </Box>
              </Box>
            </Box>
          )
          :
          (
            <div className='text-gray-500/90 text-2xl font-bold w-[100%] bg-gray-50 rounded-md p-5 h-[30rem] flex justify-center items-center'>
              <span className='text-center'>
                You must be a backer to comment
              </span>
            </div>
          )

        }
        {comments.map(comment => (
          <CommentBar comment={comment} />
        ))}
      </Box>

    </>
  )
}

export default CommentSection