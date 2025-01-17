import React, { useEffect, useState } from 'react';
import feedbackApiInstance from "../../utils/ApiInstance/feedbackApiInstance";
import TestimonialCard from '../TestimonialCard';

function TopTestimonialList({ fetchComments, isFetchComments }) {
    const [commentList, setCommentList] = useState(null);

    useEffect(() => {
        fetchTopComments();
    }, [fetchComments]);

    const fetchTopComments = async () => {
        try {
            const res = await feedbackApiInstance.get('/top4');
            if (res.status == 200) {
                setCommentList(res.data._data);
                isFetchComments(true);
            } else {
                setCommentList(null);
            }
        } catch (err) {
            console.log(err);
        } finally {
            isFetchComments(true);
        }
    }

    return (
        <div className='flex justify-center w-full gap-[4rem]'>
            {commentList != null && commentList.length > 0 ? (commentList.map((item, index) => (
                <TestimonialCard key={index} testimonial={item} />
            ))) : (
                <p className='text-[1rem]'>No feedback available</p>
            )}
        </div>
    )
}

export default TopTestimonialList