import { Grid2 } from '@mui/material';
import React from 'react';

function BrowseMarketingCard({ item }) {
    return (
        <Grid2 size={3}>
            <div className='mb-[3rem]'>
                <div className="group relative rounded-lg overflow-hidden">
                    <div className="relative h-[18rem] w-full overflow-hidden">
                        <img
                            className="h-full w-full object-cover rounded-lg"
                            src={item?.marketplaceFiles?.find(file => file.fileType === 2)?.url || "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png"}
                            alt="Game product image"
                        />
                        <div className="absolute inset-0 flex items-end justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <button
                                onClick={() => navigate(`/marketplace-detail/${item.id}`)}
                                type="button"
                                className="mb-4 rounded bg-white px-5 py-2.5 text-lg w-[90%] text-gray-600 font-semibold hover:bg-primary-800 focus:outline-none transition-transform duration-300 group-hover:translate-y-0 transform translate-y-10"
                            >
                                View Detail
                            </button>
                        </div>
                    </div>


                </div>
                <div className="mt-3">
                    <ul className="flex items-center gap-4 ml-0">
                        {item?.categories.map((cate) => (
                            <li key={cate.name} className="flex items-center gap-2">
                                <p className="text-xs text-gray-50 bg-primary-green font-semibold rounded-sm px-1">{cate.name}</p>
                            </li>
                        ))}
                    </ul>
                    <div className='mt-2 mb-6'>
                        <a
                            onClick={() => navigate(`/marketplace-detail/${item.id}`)}
                            className="text-3xl font-semibold leading-tight hover:cursor-pointer text-gray-900 hover:underline"
                        >
                            {item?.name}
                        </a>
                        <div className='max-w-[90%] font-light italic text-sm overflow-hidden text-ellipsis whitespace-nowrap'>{item?.description}</div>
                    </div>


                    <div className="flex items-center justify-between gap-4">
                        <p className="text-xl font-semibold leading-tight text-gray-800">
                            {item?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} <span className='text-sm'>VND</span>
                        </p>
                    </div>
                </div>
            </div>
        </Grid2>
    )
}

export default BrowseMarketingCard