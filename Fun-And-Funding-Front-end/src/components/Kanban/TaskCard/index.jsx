import React, { useState, useEffect } from "react";
import "./index.css";
import { Modal, TextField, Button, ImageList, ImageListItem, Box } from "@mui/material";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';
import ReactPlayer from "react-player";
import Grid from '@mui/material/Grid2';
import { FaRegCheckCircle } from "react-icons/fa";
const TaskCard = ({ task, title, handleDelete, index, setActiveCard, updateTask, isAction }) => {
  isAction = true;
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...task, addedFiles: [] });
  const [images, setImages] = useState(task.requirementFiles.filter((file) => file.file === 6 && !file.isDeleted));
  const [videos, setVideos] = useState(task.requirementFiles.filter((file) => file.file === 7 && !file.isDeleted));
  const [docs, setDocs] = useState(task.requirementFiles.filter((file) => file.file === 8 && !file.isDeleted));
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isImageOpen, setIsImageOpen] = useState(false);
  console.log(task)
  const handleOpenModal = () => {
    setModalOpen(true);
    setIsImageOpen(false); // Ensure Lightbox is closed when opening the modal
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setIsImageOpen(false); // Reset Lightbox when closing the modal
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const categorizeFileType = (mimeType) => {
    if (mimeType.startsWith("image/")) return 6;
    if (mimeType.startsWith("video/")) return 7;
    return 8; // Default to 2 for documents or other types
  };

  const handleFilesChange = (fileItems) => {
    setFormData((prev) => ({
      ...prev,
      addedFiles: fileItems.map((fileItem) => ({
        file: fileItem.file,
        name: fileItem.file.name,
        fileType: categorizeFileType(fileItem.file.type)
      })),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append(`request[0].Id`, formData.id);
    data.append(`request[0].RequirementStatus`, formData.requirementStatus);
    data.append(`request[0].UpdateDate`, formData.updateDate);
    data.append(`request[0].Content`, formData.content);
    formData.addedFiles.forEach((fileObj, index) => {
      data.append(`request[0].AddedFiles[${index}].URL`, fileObj.file);
      data.append(`request[0].AddedFiles[${index}].Name`, fileObj.file.name);
      data.append(`request[0].AddedFiles[${index}].Filetype`, fileObj.fileType);
    });
    formData.requirementFiles.forEach((file, fileIndex) => {
      data.append(`request[0].RequirementFiles[${fileIndex}].Id`, file.id);
      data.append(`request[0].RequirementFiles[${fileIndex}].URL`, file.url);
      data.append(`request[0].RequirementFiles[${fileIndex}].Name`, file.name);
      data.append(`request[0].RequirementFiles[${fileIndex}].IsDeleted`, file.Isdeleted ? file.Isdeleted : false);
    });
    console.log("Submitting:", formData);

    try {
      await updateTask(data);
      handleCloseModal();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleImageClick = (index) => {
    setPhotoIndex(index);
    setIsImageOpen(true);
    // setModalOpen(false)
  };

  console.log(docs)
  // Update formData whenever task changes
  useEffect(() => {
    setFormData({ ...task, addedFiles: [] });
    setImages(task.requirementFiles.filter((file) => file.file === 6 && !file.isDeleted));
    setVideos(task.requirementFiles.filter((file) => file.file === 7 && !file.isDeleted));
    setDocs(task.requirementFiles.filter((file) => file.file === 8 && !file.isDeleted));
  }, [task]);

  return (
    <>
      <Box sx={{ padding: '0 4px', margin: '0 4px' }}>
        <article
          className="task_card"
          draggable={isAction} // Enable dragging only if isAction is true
          onClick={handleOpenModal}
          onDragStart={() => isAction && setActiveCard(index)} // Only set active card if draggable
          onDragEnd={() => isAction && setActiveCard(null)}
        >

          <p className="task_text">
            <FaRegCheckCircle />
            <span style={{ marginLeft: '0.5rem' }}>{title}</span>
          </p>
          {images.length > 0 && (
            <img src={images[0].url} loading="lazy" alt={`Image ${index}`}
              style={{ height: '10rem', width: '100%', objectFit: 'cover' }} />
          )}
        </article>
      </Box>


      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        sx={{ zIndex: isImageOpen ? 1200 : 1300 }} // Lower z-index when Lightbox is open
      >
        <div style={modalStyle}>
          <form onSubmit={handleSubmit} style={formStyle}>
            <TextField
              label="Content"
              name="content"
              fullWidth
              margin="normal"
              value={formData.content}
              onChange={handleChange}
            />
            {images.length > 0 && (
              <div>
                <h3 style={{fontWeight : 600}}>Images:</h3>
                <ImageList sx={{ width: '100%', ml: '0 !important', maxHeight: '40rem', scrollbarWidth: 'thin' }} cols={3} rowHeight={160}>
                  {images.map((image, index) => (
                    <ImageListItem sx={{ bgcolor: '#000000' }} key={index} onClick={() => handleImageClick(index)}>
                      <img style={{ cursor: 'pointer', height: '5rem', objectFit: 'contain' }} src={image.url} alt={`Image ${index}`} />
                    </ImageListItem>
                  ))}
                </ImageList>
              </div>
            )}
            {videos.length > 0 && (
              <div>
                <h3 style={{fontWeight : 600}}>Videos:</h3>
                <ImageList sx={{ width: '100%', ml: '0 !important', maxHeight: '40rem', scrollbarWidth: 'thin' }} cols={2} rowHeight={300}>
                  {videos.map((video, index) => (
                    <ImageListItem sx={{ bgcolor: '#000000' }} key={index}>
                      <ReactPlayer
                        key={index}
                        url={video.url}
                        width="100%"
                        height="100%"
                        controls
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </div>
            )}
            {docs.length > 0 && (
              <>
              <h3 style={{fontWeight : 600}}>Files:</h3>
              <ImageList sx={{ width: '100%', ml: '0 !important', maxHeight: '40rem', scrollbarWidth: 'thin' }} cols={2} rowHeight={300}>
              <div className="h-[10rem] overflow-hidden rounded-lg bg-gray-200 flex justify-center items-center">
                  {docs.map((doc,index) => (
                  <div>
                    <div className="font-light mb-1 italic text-gray-800">
                      {doc.name}
                    </div>
                    <a href={doc.url} download class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 "><svg class="w-3.5 h-3.5 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                      <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                    </svg> Download File</a>
                  </div>
                  ))}
                </div>
              </ImageList>

              </>
            )}


            <FilePond files={formData.addedFiles.map(f => f.file)} onupdatefiles={handleFilesChange} allowMultiple />
            <Button type="submit" style={{ marginTop: "1rem" }}>
              Update Task
            </Button>
          </form>
        </div>
      </Modal>
      {isImageOpen && (
        <Lightbox
          mainSrc={images[photoIndex].url}
          nextSrc={images[(photoIndex + 1) % images.length].url}
          prevSrc={images[(photoIndex + images.length - 1) % images.length].url}
          onCloseRequest={() => setIsImageOpen(false)}
          onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
          wrapperClassName="lightbox-wrapper" // Optional custom class for styling
          reactModalStyle={{ overlay: { zIndex: 1400 } }}
        />
      )}
    </>
  );
};

// Styling for the modal to make it scrollable and large like Trello
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  maxHeight: "80vh",
  overflowY: "auto",
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
  padding: "2rem",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

export default TaskCard;