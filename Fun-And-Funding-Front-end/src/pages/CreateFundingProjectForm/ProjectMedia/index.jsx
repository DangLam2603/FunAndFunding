import { Grid2, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import FormDivider from "../../../components/CreateProject/ProjectForm/Divider";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import ReactPlayer from "react-player";
import NavigateButton from "../../../components/CreateProject/ProjectForm/NavigateButton";

registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

const ProjectMedia = () => {
  const { setFormIndex, setProjectData, projectData } = useOutletContext();
  const navigate = useNavigate();

  const [thumbnail, setThumbnail] = useState([]);
  const [projectVideo, setProjectVideo] = useState([]);
  const [projectImages, setProjectImages] = useState([]);
  // const { thumbnail, setThumbnail, projectVideo, setProjectVideo, projectImages, setProjectImages } = useOutletContext();
  const [fundingFiles, setFundingFiles] = useState()

  useEffect(() => {
    if (projectData?.fundingFiles) {
      const initialFundingFiles = projectData.fundingFiles || [];
      setThumbnail(initialFundingFiles.filter(file => file.filetype === 2).map(file => file.url));
      setProjectVideo(initialFundingFiles.filter(file => file.filetype === 1).map(file => file.url));
      setProjectImages(initialFundingFiles.filter(file => file.filetype === 4).map(file => file.url));
    }
    setFormIndex(2);
  }, [projectData, setFormIndex]);

  console.log('vid', projectVideo)



  useEffect(() => {
    const updatedFundingFiles = [];

    if (thumbnail?.length > 0) {
      updatedFundingFiles.push({
        name: "thumbnail",
        url: thumbnail[0].file,
        filetype: 2,
      });
    }

    if (projectVideo?.length > 0) {
      updatedFundingFiles.push({
        name: "video",
        url: projectVideo[0].file,
        filetype: 1,
      });
    }

    if (projectImages?.length > 0) {
      projectImages.forEach((image, index) => {
        updatedFundingFiles.push({
          name: `image_${index + 1}`,
          url: image.file,
          filetype: 4,
        });
      });
    }

    setFundingFiles(updatedFundingFiles);
  }, [thumbnail, projectVideo, projectImages]);

  return (
    <>
      <Paper elevation={1} className="bg-white w-full overflow-hidden">
        <div className="bg-primary-green text-white flex justify-center h-[3rem] text-xl font-semibold items-center mb-4">
          Project Media Files
        </div>

        <div className='px-5'>
          <FormDivider title="Project thumbnail image" />
          <Grid2 container spacing={2} className="my-8">
            <Grid2 size={3}>
              <h4 className="font-semibold text-sm mb-1">Project thumbnail*</h4>
              <p className="text-gray-500 text-xs">Provide a sharp, dynamic image for your project thumbnail.</p>
            </Grid2>
            <Grid2 size={9}>
              <FilePond
                files={thumbnail}
                onupdatefiles={setThumbnail}
                allowMultiple={false}
                maxFiles={1}
                acceptedFileTypes={['image/*']}
                name="thumbnail"
                labelIdle='Drag & drop a file here or <span class="filepond--label-action">Browse</span>'
              />
            </Grid2>
          </Grid2>

          <FormDivider title="Project demo video" />
          <Grid2 container spacing={2} className="mt-8">
            <Grid2 size={3}>
              <h4 className="font-semibold text-sm mb-1">Project demo*</h4>
              <p className="text-gray-500 text-xs">Provide a 1-3 minute video introducing your project.</p>
            </Grid2>
            <Grid2 size={9}>
              <FilePond
                files={projectVideo}
                onupdatefiles={setProjectVideo}
                allowMultiple={false}
                maxFiles={1}
                acceptedFileTypes={['video/mp4', 'video/avi', 'video/mov']}
                name="video"
                labelIdle='Drag & drop a file here or <span class="filepond--label-action">Browse</span>'
              />
              {projectVideo.length > 0 && (
                <div className="mt-4">
                  <ReactPlayer
                    url={URL.createObjectURL(projectVideo[0].file || projectVideo[0])}
                    width="100%"
                    height="100%"
                    controls
                  />
                </div>
              )}
            </Grid2>
          </Grid2>
          <div className="mt-4"></div>
          <FormDivider title="Project story images" />
          <Grid2 container spacing={2} className="my-8">
            <Grid2 size={3}>
              <h4 className="font-semibold text-sm mb-1">Project bonus images*</h4>
              <p className="text-gray-500 text-xs">Provide images that showcase different aspects of your project.</p>
            </Grid2>
            <Grid2 size={9}>
              <FilePond
                files={projectImages}
                onupdatefiles={setProjectImages}
                allowMultiple={true}
                maxFiles={4}
                acceptedFileTypes={['image/*']}
                name="images"
                labelIdle='Drag & drop files here or <span class="filepond--label-action">Browse</span>'
              />
            </Grid2>
          </Grid2>

          <div className="flex justify-center gap-5 my-5">
            <NavigateButton text="Back" onClick={() => navigate('/request-funding-project/introduction')} />
            <NavigateButton text="Next" disabled={thumbnail?.length == 0 || projectVideo?.length == 0 || projectImages?.length == 0} onClick={() => {
              setProjectData((prev) => ({
                ...prev,
                fundingFiles,
              }));
              navigate('/request-funding-project/setup-bank-account')
            }} />
          </div>
        </div>
      </Paper>
    </>
  );
};

export default ProjectMedia;
