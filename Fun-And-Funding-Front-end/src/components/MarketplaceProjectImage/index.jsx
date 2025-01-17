import { Box } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './index.css';
function MarketplaceProjectImage({ files }) {
  const videoFile = files.find(file => file.fileType === 1);
  const thumbnail = files.find(file => file.fileType === 2);
  const stories = files.filter(file => file.fileType === 4);

  const medias = [
    ...(videoFile ? [{ type: 'video', src: videoFile.url }] : []),
    ...(thumbnail ? [{ type: 'image', src: thumbnail.url }] : []),
    ...stories.map(image => ({ type: 'image', src: image.url }))
  ].filter(media => media.src);

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


  return (
    <div>
      <Carousel showArrows={false} showIndicators={false} interval={3000}
        transitionTime={500} showStatus={false} renderThumbs={customRenderThumb}>
        {medias.map((media, index) => (
          <Box key={index}
            sx={{
              height: '30rem', borderRadius: '.2rem', overflow: 'hidden',
            }}
          >
            {media.type === 'video' ? (
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

export default MarketplaceProjectImage;