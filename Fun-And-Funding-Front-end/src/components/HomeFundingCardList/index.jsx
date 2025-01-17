import React, { useEffect, useState } from 'react';
import fundingProjectApiInstance from "../../utils/ApiInstance/fundingProjectApiInstance";
import HomeFundingProjectCard from '../HomeFundingProjectCard';

function HomeFundingCardList({ fetchFundingProject, isFetchFundingProject }) {
    const [fundingProjectList, setFundingProjectList] = useState(null);

    useEffect(() => {
        fetchTopFundingProjects();
    }, [fetchFundingProject]);

    const fetchTopFundingProjects = async () => {
        try {
            const res = await fundingProjectApiInstance.get('/top3');
            if (res.data._statusCode == 200) {
                setFundingProjectList(res.data._data);
            }
        } catch (err) {
            console.log(err);
        } finally {
            isFetchFundingProject(true);
        }
    }

    return (
        <div className='flex justify-center w-full gap-[4rem]'>
            {fundingProjectList != null && fundingProjectList.length > 0 ? (fundingProjectList.map((item, index) => (
                <HomeFundingProjectCard key={index} fundingProject={item} />
            ))) : (
                <p className='text-[1rem]'>No funding project available</p>
            )}
        </div>
    )
}

export default HomeFundingCardList