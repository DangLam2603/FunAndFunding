import { Grid2 } from '@mui/material';
import Typography from '@mui/material/Typography';
import Aos from 'aos';
import 'aos/dist/aos.css';
import React, { useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';
import Background from "../../assets/images/background-pattern.png";
import Bao from '../../assets/images/Bao.png';
import CTO from '../../assets/images/CTO.png';
import Dang from '../../assets/images/Dang.png';
import Diem from '../../assets/images/Diem.png';
import MemberCard from '../../components/MemberCard';
import './index.css';

function AboutUs() {
    useEffect(() => {
        Aos.init({ duration: 2000 });
    }, []);

    return (
        <div>
            <div className='about-us-banner'>
                <div className='h-[40vh] select-none flex flex-col items-center mb-[2rem]' data-aos="fade-up">
                    <div>
                        <Typography sx={{ fontSize: '2rem', color: '#A7A7A7', fontWeight: 600, textAlign: 'center', textShadow: '.12rem .12rem .3rem rgba(0, 0, 0, 0.2)', mt: '5rem' }}>
                            About Us
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: '2.4rem', mt: '1.5rem', textAlign: 'center', color: '#44494D', fontWeight: 600, textShadow: '.12rem .12rem .3rem rgba(0, 0, 0, 0.2)', mx: '5rem' }}>
                            Fulfilling Dreams, Keeping Every Commitment
                        </Typography>
                        <Typography variant="h1" sx={{ fontSize: '1.6rem', color: '#A7A7A7', fontWeight: 600, textAlign: 'center', textShadow: '.12rem .12rem .3rem rgba(0, 0, 0, 0.2)', mt: '1.6rem' }}>
                            Members of Fun&Funding
                        </Typography>
                    </div>
                </div>
                <div className='mx-[6rem] pt-[2rem] py-[4rem]' data-aos="fade-up">
                    <Grid2 container columnGap={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: '4rem' }}>
                        <Grid2 xs={4}>
                            <MemberCard imgUrl={Diem} name={"Le Quy Diem"} role={"Developer"} description={"Develop and maintain the crowdfunding platform's source code to ensure stability, security, and advancement."} />
                        </Grid2>
                        <Grid2 xs={4}>
                            <MemberCard imgUrl={CTO} name={"Cao Kha Suong"} role={"Chief Technology Officer"} description={"Lead the technical team, ensuring the crowdfunding platform remains stable, secure, and advanced."} />
                        </Grid2>
                        <Grid2 xs={4}>
                            <MemberCard imgUrl={Dang} name={"Lam Minh Dang"} role={"Developer"} description={"Develop and maintain the crowdfunding platform's source code to ensure stability, security, and advancement."} />
                        </Grid2>
                    </Grid2>
                    <Grid2 container columnGap={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Grid2 item xs={6}>
                            <MemberCard name={"Dao Huong Thao"} role={"Developer"} description={"Develop and maintain the crowdfunding platform's source code to ensure stability, security, and advancement."} />
                        </Grid2>
                        <Grid2 item xs={6}>
                            <MemberCard imgUrl={Bao} name={"Cao Duy Bao"} role={"Developer"} description={"Develop and maintain the crowdfunding platform's source code to ensure stability, security, and advancement."} />
                        </Grid2>
                    </Grid2>
                </div>
            </div>
            <div className='hp-question h-[40vh] select-none flex flex-col items-center justify-center' style={{ paddingLeft: 'var(--side-margin)', paddingRight: 'var(--side-margin)', position: 'relative', backgroundColor: 'var(--black)' }}>
                <div className="mission-background">
                    <img
                        src={Background}
                        alt="footer"
                        border="0"
                        style={{ height: "40vh", objectFit: "cover", width: "100%" }}
                    />
                    <div className="mission-overlay !h-[40vh]"></div>
                </div>
                <Typography data-aos="fade-up" sx={{
                    fontSize: '2rem', color: 'var(--white)', fontWeight: 600, textAlign: 'center', width: '100%', textShadow: '.12rem .12rem .3rem rgba(0, 0, 0, 0.4)', lineHeight: '1.625', zIndex: '10'
                }}>
                    <TypeAnimation
                        sequence={[
                            '\"Connecting the community, sparking creativity, and supporting education in Vietnam through the crowdfunding platform.\"',
                            2000,
                            '',
                            2000
                        ]}
                        speed={60}
                        wrapper="span"
                        repeat={Infinity}
                    />
                </Typography>
            </div>
            <div style={{ marginLeft: 'var(--side-margin)', marginRight: 'var(--side-margin)', marginTop: '4rem' }}>
                <div className='mb-[4rem]'>
                    <Typography
                        sx={{
                            fontSize: '3rem',
                            mt: '1.5rem',
                            color: '#44494D',
                            fontWeight: 700,
                            textShadow: '.12rem .12rem .3rem rgba(0, 0, 0, 0.2)'
                        }}
                    >
                        Our Vision
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '1.25rem',
                            color: '#44494D',
                            fontWeight: 600,
                            mt: '2rem',
                            lineHeight: '1.625'
                        }}
                    >
                        Fun&Funding aims to become the largest and most well-known crowdfunding platform in Vietnam, not only providing funding opportunities for creative projects but also bringing the community closer together through cooperation and mutual support.
                    </Typography>
                </div>

                <div>
                    <Typography sx={{
                        fontSize: '3rem',
                        mt: '1.5rem',
                        color: '#44494D',
                        fontWeight: 600,
                        textShadow: '.12rem .12rem .3rem rgba(0, 0, 0, 0.2)'
                    }}>
                        Mission
                    </Typography>
                    <Typography sx={{
                        fontSize: '1.25rem',
                        color: '#44494D',
                        fontWeight: 600,
                        mt: '2rem',
                        lineHeight: '1.625'
                    }}>
                        Fun&Funding aims to become the largest and most well-known crowdfunding platform in Vietnam. It not only creates funding opportunities for creative projects but also brings people closer together through collaboration and mutual support. We are proud to contribute to the development of ideas and dreams, fostering entrepreneurial spirit and innovation in the community.
                    </Typography>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;