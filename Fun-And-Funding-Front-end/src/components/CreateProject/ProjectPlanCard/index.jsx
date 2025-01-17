import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import React, { useState } from "react";
import CreatorContract from "../../CreatorContract";
const ProjectPlanCard = ({ option, title, brief, bullets, buttonText, commission }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const words = brief.split(" ");

  return (
    <>
      <div className='rounded p-12 bg-gradient-to-br from-white/20 via-white/35 to-white/25 backdrop-blur-3xl text-white'>
        <div className='text-lg mb-4 font-semibold'>{option}</div>
        <div className='text-4xl font-semibold font1 mb-4'>{title}</div>
        <div className='text-lg mb-2 font-semibold'>
          <span className='text-primary-green text-2xl'>{words[0]}</span> {words.slice(1).join(" ")}
        </div>
        <ul className='list-disc text-sm min-h-[8rem] list-inside my-5 leading-8'>
          {bullets.map((bullet, index) => (
            <li key={index}>{bullet}</li>
          ))}
        </ul>
        <Link onClick={handleOpen} className='inline-block bg-primary-green text-white font-bold py-3 px-4 mb-4 rounded' type='button'>{buttonText}</Link>
        <CreatorContract open={modalOpen} handleClose={handleClose} />
        <hr />
        <div className='py-3 font-semibold'>
          Fee: {commission}
        </div>
      </div>
    </>
  )
}

export default ProjectPlanCard