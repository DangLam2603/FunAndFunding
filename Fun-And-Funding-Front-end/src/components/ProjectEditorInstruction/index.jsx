import { Backdrop, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import instruction1 from '../../assets/images/instruction1.png';
import instruction2 from '../../assets/images/instruction2.png';
import instruction3 from '../../assets/images/instruction3.png';
import instruction4 from '../../assets/images/instruction4.png';
import instruction5 from '../../assets/images/instruction5.png';

const banners = [
    {
        id: 1,
        image: instruction1,
        text: 'The Project Editor <span class="text-[var(--primary-green)] font-bold">streamlines</span> funding project with an intuitive interface, enabling easy <span class="text-[var(--primary-green)] font-bold">streamlines</span> for creators. Click on <span class="text-[var(--primary-green)] font-bold">View Details</span> to access.',
    },
    {
        id: 2,
        image: instruction2,
        text: 'All <span class="text-[var(--primary-green)] font-bold">previews and statistics</span> of your funding projects will be shown here, including <span class="text-[var(--primary-green)] font-bold">transactions, donations and money graphics</span>.',
    },
    {
        id: 3,
        image: instruction3,
        text: 'The Project Editor tab <span class="text-[var(--primary-green)] font-bold">allows</span> game owner to edit their <span class="text-[var(--primary-green)] font-bold">project appearances </span>, with a total of <span class="text-[var(--primary-green)] font-bold">4</span> tabs of information to change. These changes will apply immediately after the updates.',
    },
    {
        id: 4,
        image: instruction4,
        text: 'Owner can withdraw their project <span class="text-[var(--primary-green)] font-bold">first donation money</span> WHILE currently in donation progress for project development through 2 milestones, <span class="text-[var(--primary-green)] font-bold">Milestone 1 & 2.</span> Milestone Overview can view <span class="text-[var(--primary-green)] font-bold">donation history</span> for easier <span class="text-[var(--primary-green)] font-bold">reward managements and chats</span>.',
    },
    {
        id: 5,
        image: instruction5,
        text: 'After successful crowdfunding, the final <span class="text-[var(--primary-green)] font-bold">2 milestone</span> will be available for Owner to apply their <span class="text-[var(--primary-green)] font-bold">developing progress of the project and their brief demonstration of the project</span>. By completing all the milestones, Owner can <span class="text-[var(--primary-green)] font-bold">support their backers</span> using backer informations showed in Milestone Overview tab.',
    },
];

function ProjectEditorInstruction({ showInstruction, setShowInstruction, selectedIndex }) {
    const [currentIndex, setCurrentIndex] = useState(selectedIndex);

    useEffect(() => {
        setCurrentIndex(selectedIndex);
    }, [selectedIndex]);

    const nextBanner = () => {
        if (currentIndex == banners.length - 1) {
            setShowInstruction(false);
        }
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    };

    const previousBanner = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1) % banners.length);
    };

    const goToBanner = (index) => {
        setCurrentIndex(index);
    };

    return (
        <Backdrop
            sx={{
                color: 'var(--white)',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                zIndex: (theme) => theme.zIndex.drawer + 2
            }}
            open={showInstruction}
        >
            <div className='flex flex-col justify-center items-center gap-[1rem]'>
                <Typography sx={{ fontSize: '1.75rem', fontWeight: '600', mb: '0.5rem' }}>
                    Welcome to Project Editor
                </Typography>
                {banners.map((banner, index) =>
                    <div key={index} className={`${index !== currentIndex ? 'hidden' : 'flex justify-center flex-col items-center'}`}>
                        <img src={banner.image} className='w-[50rem] h-[25rem] rounded-md object-fill mb-[1rem] select-none' />
                        <Typography sx={{ fontSize: '1rem', fontWeight: '600', width: '60rem', textAlign: 'center', mb: '0.25rem' }} dangerouslySetInnerHTML={{
                            __html: banners[currentIndex].text,
                        }}>
                        </Typography>
                    </div>
                )}
                <div className="flex gap-[10px] mb-[0.5rem]">
                    {banners.map((banner, index) => (
                        <div
                            key={banner.id}
                            className={`banner-carousel-dot ${index === currentIndex ? 'banner-carousel-dot-active' : ''
                                }`}
                            onClick={() => goToBanner(index)}
                        ></div>
                    ))}
                </div>
                <div className='flex justify-center gap-[1rem]'>
                    <Button
                        variant="contained"
                        disabled={currentIndex == 0}
                        sx={{
                            backgroundColor: "var(--grey) !important",
                            textTransform: "none",
                            color: 'var(--black)',
                            fontSize: '1rem', fontWeight: 600
                        }}
                        onClick={() => previousBanner()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: "#1BAA64", textTransform: "none", fontSize: '1rem', fontWeight: 600 }}
                        onClick={() => nextBanner()}
                    >
                        {currentIndex != banners.length - 1 ? 'Next' : 'I Understand'}
                    </Button>
                </div>
            </div>
        </Backdrop>
    )
}

export default ProjectEditorInstruction;