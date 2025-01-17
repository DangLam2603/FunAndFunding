import React, { useEffect, useState } from 'react';
import marketplaceProjectApiInstance from "../../utils/ApiInstance/marketplaceProjectApiInstance";
import HomeMarketingProjectCard from '../HomeMarketingProjectCard';

function HomeMarketingCardList({ fetchMarketplaceProject, isFetchMarketplaceProject }) {
    const [marketplaceProjectList, setMarketplaceProjectList] = useState(null);

    useEffect(() => {
        fetchTopMarketplaceProjects();
    }, [fetchMarketplaceProject]);

    const fetchTopMarketplaceProjects = async () => {
        try {
            const res = await marketplaceProjectApiInstance.get('/top3');
            if (res.status == 200) {
                setMarketplaceProjectList(res.data._data);
            } else {
                setMarketplaceProjectList(null);
            }
        } catch (err) {
            console.log(err);
        } finally {
            isFetchMarketplaceProject(true);
        }
    }
    return (
        <div className='flex justify-center w-full gap-[4rem]'>
            {marketplaceProjectList != null && marketplaceProjectList.length > 0 ? (marketplaceProjectList.map((item, index) => (
                <HomeMarketingProjectCard key={index} marketplaceProject={item} />
            ))) : (
                <p className='text-[1rem]'>No marketplace project available</p>
            )}
        </div>
    )
}

export default HomeMarketingCardList