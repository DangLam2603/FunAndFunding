import React, { useEffect, useState } from 'react';
import userApiInstance from '../../utils/ApiInstance/userApiInstance';
import BackerCard from '../BackerCard';

function TopBackerList({ fetchBackers, isFetchBackers }) {
    const [backerList, setBackerList] = useState(null);

    useEffect(() => {
        fetchTopBackers();
    }, [fetchBackers]);

    const fetchTopBackers = async () => {
        try {
            const res = await userApiInstance.get('/top4');
            if (res.data._statusCode == 200) {
                setBackerList(res.data._data);
                isFetchBackers(true);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className='flex justify-center w-full gap-[4rem]'>
            {backerList != null && backerList.length > 0 ? (
                backerList.map((item, index) => (
                    <BackerCard key={index} backer={item} />
                ))
            ) : (
                <p className='text-[1rem]'>No donators available</p>
            )}
        </div>
    )
}

export default TopBackerList