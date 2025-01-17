import AddCircleIcon from "@mui/icons-material/AddCircle";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import {
  Box,
  Button,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Lightbox from "react-18-image-lightbox";
import "react-18-image-lightbox/style.css";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import { useUpdateMarketplaceProject } from "../../../contexts/UpdateMarketplaceProjectContext";

function MarketplaceProjectMediaFiles() {
  const { id } = useParams();
  const { marketplaceProject, setMarketplaceProject, edited, setEdited } =
    useUpdateMarketplaceProject();

  const [thumbnail, setThumbnail] = useState([]);
  const [projectVideo, setProjectVideo] = useState([]);

  const [projectImages, setProjectImages] = useState([]);
  const [mediaEdited, setMediaEdited] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isThumbnailOpen, setIsThumbnailOpen] = useState(false);

  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    fetchMedia();
  }, [id, marketplaceProject]);

  console.log(marketplaceProject.existingFiles);
  console.log(marketplaceProject.marketplaceFiles);

  const fetchMedia = () => {
    const allFiles = [
      ...(marketplaceProject.existingFiles || []),
      ...(marketplaceProject.marketplaceFiles || []),
    ];

    if (allFiles.length > 0) {
      const videoFile = allFiles.filter((file) => file.fileType === 1);
      let videoData =
        videoFile.length > 0
          ? videoFile.map((file) => ({
            id: file.id,
            url: file.url,
            name: file.name,
            isDeleted: file.isDeleted,
            fileType: file.fileType,
            version: file.version || "",
            description: file.description || "",
          }))
          : [];
      setProjectVideo(videoData);

      const thumbnailFile = allFiles.filter((file) => file.fileType === 2);

      let thumbnailData =
        thumbnailFile.length > 0
          ? thumbnailFile.map((file) => ({
            id: file.id,
            url: file.url,
            name: file.name,
            isDeleted: file.isDeleted,
            fileType: file.fileType,
            version: file.version || "",
            description: file.description || "",
          }))
          : [];
      setThumbnail(thumbnailData);

      const imageFiles = allFiles.filter((file) => file.fileType === 4);
      let imageData =
        imageFiles.length > 0
          ? imageFiles.map((file) => ({
            id: file.id,
            url: file.url,
            name: file.name,
            isDeleted: file.isDeleted,
            fileType: file.fileType,
            version: file.version || "",
            description: file.description || "",
          }))
          : [];
      setProjectImages(imageData);
    }
  };

  const handleThumbnailChange = (e, thumbnailId) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail((prevThumbnails) => {
        const thumbnailIndex = prevThumbnails.findIndex(
          (item) => item.id === thumbnailId
        );
        const updatedThumbnails = [...prevThumbnails];
        if (thumbnailIndex != -1) {
          updatedThumbnails[thumbnailIndex].isDeleted = true;
        } else {
          const filteredThumbnail = updatedThumbnails.filter(
            (item) => item.id !== thumbnailId
          );
          updatedThumbnails.length = 0;
          updatedThumbnails.push(...filteredThumbnail);
        }

        const newThumbnail = {
          id: uuidv4(),
          name: file.name,
          url: file,
          isDeleted: false,
          fileType: 2,
          version: "",
          description: "",
        };

        return [...updatedThumbnails, newThumbnail];
      });

      setMediaEdited(true);
      e.target.value = null;
    }
  };

  const getSelectedThumbnailId = () => {
    const activeThumbnail = thumbnail.find((item) => !item.isDeleted);
    return activeThumbnail ? activeThumbnail.id : null;
  };

  const handleVideoChange = (e, videoId) => {
    const file = e.target.files[0];
    if (file) {
      setProjectVideo((prevVideos) => {
        const videoIndex = prevVideos.findIndex((item) => item.id === videoId);
        const updatedVideos = [...prevVideos];
        if (videoIndex != -1) {
          updatedVideos[videoIndex].isDeleted = true;
        } else {
          const filteredVideo = updatedVideos.filter(
            (item) => item.id !== videoId
          );
          updatedVideos.length = 0;
          updatedVideos.push(...filteredVideo);
        }

        const newVideo = {
          id: uuidv4(),
          name: file.name,
          url: file,
          isDeleted: false,
          fileType: 1,
          version: "",
          description: "",
        };

        return [...updatedVideos, newVideo];
      });

      setMediaEdited(true);
      e.target.value = null;
    }
  };

  const getSelectedVideoId = () => {
    const activeVideo = projectVideo.find((item) => !item.isDeleted);
    return activeVideo ? activeVideo.id : null;
  };

  const handleBonusImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProjectImages((prevImages) => {
        const newImage = {
          id: uuidv4(),
          name: file.name,
          url: file,
          fileType: 4,
          isDeleted: false,
          version: "",
          description: "",
        };

        return [...prevImages, newImage];
      });

      setMediaEdited(true);
      e.target.value = null;
    }
  };

  console.log(projectImages);

  const handleDeleteBonusImage = (bonusImage) => {
    console.log(projectImages);
    const deleteProjectImage = [
      ...projectImages.filter((item) => !item.isDeleted),
    ];
    if (deleteProjectImage.length <= 1) {
      Swal.fire({
        title: "Unable to delete",
        text: "You must have at least 1 image.",
        icon: "error",
      });
    } else {
      Swal.fire({
        title: "Do you want to delete the image?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          setProjectImages((prevImages) => {
            //find index to delete
            const imageIndex = prevImages.findIndex(
              (item) =>
                item.id === bonusImage.id && typeof item.url === "string"
            );

            const updatedImages = [...prevImages];

            if (imageIndex != -1) {
              //index found => change isDeleted
              updatedImages[imageIndex].isDeleted = true;
            } else {
              //not found => remove from the list
              const filteredImages = updatedImages.filter(
                //exclude file to delete
                (item) => item.id !== bonusImage.id
              );
              updatedImages.length = 0;
              updatedImages.push(...filteredImages);
            }

            return [...updatedImages];
          });

          setIsImageOpen(false);
          setMediaEdited(true);
          Swal.fire("Delete successfully!", "", "success");
        }
      });
    }
  };

  const handleImageClick = (index) => {
    setPhotoIndex(index);
    setIsImageOpen(true);
  };

  const handleThumbnailClick = () => {
    setIsThumbnailOpen(true);
  };

  const handleSaveAll = async () => {
    const existingFiles = [...marketplaceProject.existingFiles];
    const marketplaceFiles = [
      ...marketplaceProject.marketplaceFiles.filter((f) => f.fileType === 3),
    ];
    console.log(marketplaceFiles);

    const classifyFiles = (files) => {
      files.forEach((file) => {
        if (typeof file.url === "object") {
          if (!file.isDeleted) {
            marketplaceFiles.push(file);
          }
        } else {
          if (file.isDeleted) {
            const fileToDelete = existingFiles.find((f) => f.id === file.id);
            fileToDelete.isDeleted = true;
          }
        }
      });
    };

    classifyFiles(thumbnail);
    classifyFiles(projectImages);
    classifyFiles(projectVideo);

    const updatedProject = {
      ...marketplaceProject,
      marketplaceFiles: marketplaceFiles,
      existingFiles: existingFiles,
    };

    console.log(updatedProject);

    setMarketplaceProject(updatedProject);
    setEdited(true);
    setMediaEdited(false);
    fetchMedia();
  };

  const handleDiscardAll = () => {
    fetchMedia();
    setMediaEdited(false);
  };

  return (
    <div className="w-full pb-[3rem]">
      <div className="basic-info-section !mb-[2rem]">
        <Typography
          sx={{
            color: "#2F3645",
            fontSize: "1.5rem",
            fontWeight: "700",
            userSelect: "none",
            width: "70%",
            marginBottom: "1rem",
          }}
        >
          Media Files
        </Typography>
        <Typography
          sx={{
            color: "#2F3645",
            fontSize: "1rem",
            fontWeight: "400",
            userSelect: "none",
            width: "70%",
          }}
        >
          Provide dynamic images and videos to showcase your project's unique
          features, giving backers a more immersive experience.
        </Typography>
      </div>
      <div className="basic-info-section">
        <Typography className="basic-info-title" sx={{ width: "70%" }}>
          Project thumbnail<span className="text-[#1BAA64]">*</span>
        </Typography>
        <Typography className="basic-info-subtitle" sx={{ width: "70%" }}>
          Provide a sharp, dynamic image for your project thumbnail.
        </Typography>
        {thumbnail &&
          thumbnail.length > 0 &&
          thumbnail.some((item) => !item.isDeleted) ? (
          thumbnail
            .filter((item) => !item.isDeleted)
            .map((item) => (
              <div
                key={item.id}
                className="relative w-[70%] h-[17.8rem] bg-[#000000] rounded-lg"
              >
                <img
                  src={
                    typeof item.url === "string"
                      ? item.url
                      : URL.createObjectURL(item.url)
                  }
                  alt="Package preview"
                  className="w-full h-[17.8rem] object-contain rounded-lg cursor-pointer"
                  onClick={handleThumbnailClick}
                />
                {isThumbnailOpen && (
                  <Lightbox
                    mainSrc={
                      typeof item.url === "string"
                        ? item.url
                        : URL.createObjectURL(item.url)
                    }
                    onCloseRequest={() => setIsThumbnailOpen(false)}
                  />
                )}
              </div>
            ))
        ) : (
          <label className="flex flex-col items-center justify-center w-[70%] h-[18rem] border-2 border-[#2F3645] border-dashed rounded-lg cursor-pointer bg-[#EAEAEA]">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-[5rem] h-[5rem] mb-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5A5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <h1 className="mb-[1.25rem] text-sm text-gray-500 !text-[1.5rem] font-semibold">
                Click to upload
              </h1>
              <p className="text-xs text-gray-500 !text-[1rem] font-medium">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </p>
              <input
                type="file"
                id="add-thumbnail"
                className="hidden"
                accept="image/*"
              />
            </div>
          </label>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            width: "70%",
            mt: "1.5rem",
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleThumbnailChange(e, getSelectedThumbnailId())}
            style={{ display: "none" }}
            id="thumbnail-input"
          />
          <Button
            variant="contained"
            onClick={() => document.getElementById("thumbnail-input").click()}
            sx={{
              backgroundColor: "#1BAA64",
              textTransform: "none",
              fontWeight: "600",
            }}
            startIcon={<ChangeCircleIcon />}
          >
            Change Thumbnail
          </Button>
        </Box>
      </div>
      <div className="basic-info-section">
        <Typography className="basic-info-title" sx={{ width: "70%" }}>
          Project video<span className="text-[#1BAA64]">*</span>
        </Typography>
        <Typography className="basic-info-subtitle" sx={{ width: "70%" }}>
          Provide a 1-3 minute video introducing your project.
        </Typography>
        {projectVideo &&
          projectVideo.length > 0 &&
          projectVideo.some((item) => !item.isDeleted) ? (
          projectVideo
            .filter((video) => !video.isDeleted)
            .map((video, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-[0.625rem] w-[70%]"
              >
                <ReactPlayer
                  key={video.url}
                  url={
                    typeof video.url === "string"
                      ? video.url
                      : URL.createObjectURL(video.url)
                  }
                  width="100%"
                  height="100%"
                  controls
                />
              </div>
            ))
        ) : (
          <label className="flex flex-col items-center justify-center w-[70%] h-[18rem] border-2 border-[#2F3645] border-dashed rounded-lg cursor-pointer bg-[#EAEAEA]">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-[5rem] h-[5rem] mb-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5A5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <h1 className="mb-[1.25rem] text-sm text-gray-500 !text-[1.5rem] font-semibold">
                Click to upload
              </h1>
              <p className="text-xs text-gray-500 !text-[1rem] font-medium">
                MP4 (max. 4 minutes or 500MB)
              </p>
            </div>
            <input
              type="file"
              id="add-video"
              className="hidden"
              accept="video/mp4,video/x-m4v,video/*"
            />
          </label>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            width: "70%",
            mt: "1.5rem",
          }}
        >
          <input
            type="file"
            id="video-file"
            className="hidden"
            accept="video/mp4,video/x-m4v,video/*"
            onChange={(e) => handleVideoChange(e, getSelectedVideoId())}
          />
          <Button
            variant="contained"
            onClick={() => document.getElementById("video-file").click()}
            sx={{
              backgroundColor: "#1BAA64",
              textTransform: "none",
              fontWeight: "600",
            }}
            startIcon={<ChangeCircleIcon />}
          >
            Change Video
          </Button>
        </Box>
      </div>
      <div className="basic-info-section !mb-[2rem]">
        <Typography className="basic-info-title" sx={{ width: "70%" }}>
          Project images
        </Typography>
        <Typography className="basic-info-subtitle" sx={{ width: "70%" }}>
          Provide images that showcase different aspects of your project.
        </Typography>
        {projectImages &&
          projectImages.length > 0 &&
          projectImages.some((item) => !item.isDeleted) ? (
          <ImageList
            sx={{
              width: "70%",
              ml: "0 !important",
              maxHeight: "40rem",
              scrollbarWidth: "thin",
            }}
            cols={3}
            rowHeight={160}
          >
            {projectImages
              .filter((item) => !item.isDeleted)
              .map((item, index) => (
                <ImageListItem
                  key={index}
                  onClick={() => handleImageClick(index)}
                  sx={{ bgcolor: "#000000" }}
                >
                  <img
                    src={
                      typeof item.url === "string"
                        ? item.url
                        : URL.createObjectURL(item.url)
                    }
                    alt={`Project image ${index + 1}`}
                    loading="lazy"
                    style={{
                      cursor: "pointer",
                      height: "5rem",
                      objectFit: "contain",
                    }}
                  />
                </ImageListItem>
              ))}
          </ImageList>
        ) : (
          <label className="flex flex-col items-center justify-center w-[70%] h-[18rem] border-2 border-[#2F3645] border-dashed rounded-lg cursor-pointer bg-[#EAEAEA]">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-[5rem] h-[5rem] mb-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5A5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <h1 className="mb-[1.25rem] text-sm text-gray-500 !text-[1.5rem] font-semibold">
                Click to upload
              </h1>
              <p className="text-xs text-gray-500 !text-[1rem] font-medium">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </p>
              <input
                type="file"
                id="add-thumbnail"
                className="hidden"
                accept="image/*"
              />
            </div>
          </label>
        )}

        {isImageOpen && (
          <Lightbox
            mainSrc={
              typeof projectImages.filter((item) => !item.isDeleted)[photoIndex]
                .url === "string"
                ? projectImages.filter((item) => !item.isDeleted)[photoIndex]
                  .url
                : URL.createObjectURL(
                  projectImages.filter((item) => !item.isDeleted)[photoIndex]
                    .url
                )
            }
            nextSrc={
              projectImages.filter((item) => !item.isDeleted)[
                (photoIndex + 1) %
                projectImages.filter((item) => !item.isDeleted).length
              ].url
            }
            prevSrc={
              projectImages.filter((item) => !item.isDeleted)[
                (photoIndex +
                  projectImages.filter((item) => !item.isDeleted).length -
                  1) %
                projectImages.filter((item) => !item.isDeleted).length
              ].url
            }
            onCloseRequest={() => setIsImageOpen(false)}
            onMovePrevRequest={() =>
              setPhotoIndex(
                (photoIndex +
                  projectImages.filter((item) => !item.isDeleted).length -
                  1) %
                projectImages.filter((item) => !item.isDeleted).length
              )
            }
            onMoveNextRequest={() =>
              setPhotoIndex(
                (photoIndex + 1) %
                projectImages.filter((item) => !item.isDeleted).length
              )
            }
            toolbarButtons={[
              <button
                title="Delete"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.125rem",
                  marginRight: "0.5rem",
                  opacity: "0.7",
                  color: "#FFFFFF",
                }}
                onMouseEnter={(e) => (e.target.style.opacity = 1)}
                onMouseLeave={(e) => (e.target.style.opacity = 0.7)}
                onClick={() =>
                  handleDeleteBonusImage(projectImages[photoIndex])
                }
              >
                🗑️
              </button>,
            ]}
          />
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            width: "70%",
            mt: "1.5rem",
          }}
        >
          <input
            type="file"
            id="bonus-image-file"
            className="hidden"
            accept="image/*"
            onChange={handleBonusImageChange}
          />
          <Button
            variant="contained"
            onClick={() => document.getElementById("bonus-image-file").click()}
            sx={{
              backgroundColor: "#1BAA64",
              textTransform: "none",
              fontWeight: "600",
            }}
            startIcon={<AddCircleIcon />}
          >
            Add More Image
          </Button>
        </Box>
      </div>
      <div className="basic-info-section !mb-0">
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "70%",
            gap: "1rem",
          }}
        >
          <Button
            variant="outlined"
            color="error"
            disabled={!mediaEdited}
            sx={{ backgroundColor: "transparent", textTransform: "none" }}
            onClick={() => handleDiscardAll()}
          >
            Discard
          </Button>
          <Button
            variant="contained"
            disabled={!mediaEdited}
            sx={{ backgroundColor: "#1BAA64", textTransform: "none" }}
            onClick={() => handleSaveAll()}
          >
            Save
          </Button>
        </Box>
      </div>
    </div>
  );
}

export default MarketplaceProjectMediaFiles;
