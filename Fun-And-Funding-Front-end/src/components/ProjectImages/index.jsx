import { Box } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './index.css';
function ProjectImages({ files }) {
  const videoFile = files.find(file => file.filetype === 1);
  const thumbnail = files.find(file => file.filetype === 2);
  const stories = files.filter(file => file.filetype === 4);
  console.log(videoFile)

  const medias = [
    { type: 'video', src: videoFile && videoFile.url },
    { type: 'image', src: thumbnail && thumbnail.url },
    ...stories.map(image => ({ type: 'image', src: image.url }))
  ];

  const customRenderThumb = () => {
    return medias.map((media, index) => (
      media.type === 'video'
        ? (
          <video key={index} height={'5rem !important'} muted>
            <source src={media.src} type="video/mp4" />
          </video>
        )
        : (
          <img key={index} src={media.src} alt={`thumb-${index}`} />
        )
    ));
  };
  // return (
  //   <div>
  //     <Carousel showArrows={false} showIndicators={false} interval={3000}
  //       transitionTime={500} showStatus={false} >
  //         {videoFile && <Box
  //           sx={{
  //             height: '30rem', borderRadius: '.2rem', overflow: 'hidden',
  //           }}
  //         >
  //           <video
  //               controls
  //               autoPlay
  //               muted
  //               loop
  //               playsInline
  //               width="100%"
  //               height="auto"
  //               onLoadedMetadata={
  //                 () => {
  //                   console.log("loaded");
  //                 }
  //               }
  //             >
  //               <source src={videoFile.url} type="video/mp4" />
  //             </video>
  //         </Box>}
  //         <Box
  //           sx={{
  //             height: '30rem', borderRadius: '.2rem', overflow: 'hidden',
  //           }}
  //         >
  //           <img src={kuru} />
  //         </Box>
  //     </Carousel>
  //   </div>

  // )


  return (
    <div>
      <Carousel showArrows={false} showIndicators={false} interval={3000}
        transitionTime={500} showStatus={false} renderThumbs={customRenderThumb}>
        {medias.map((media, index) => (
          <Box key={index}
            sx={{
              height: '25rem', borderRadius: '.2rem', overflow: 'hidden',
            }}
          >
            {media.type === 'video' ? (
              // <ReactPlayer url={media.src} width={'100%'} height={'50rem !important'} playing controls />
              // <canvas ref={canvasRef} className="carousel-canvas" />
              <video
                controls
                autoPlay
                muted
                loop
                playsInline
                width="100%"
                height="auto"
              >
                <source src={media.src} type="video/mp4" />
              </video>
            ) : (
              <img src={media.src} alt={`carousel-item-${index}`} />
            )}
          </Box>
        ))}
      </Carousel>
    </div>

  )
}

export default ProjectImages;