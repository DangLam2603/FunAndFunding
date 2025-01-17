import {
  Box,
  Button,
  Grid2,
  ImageList,
  ImageListItem,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import FormDivider from "../../../components/CreateProject/ProjectForm/Divider";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import ReactPlayer from "react-player";
import NavigateButton from "../../../components/CreateProject/ProjectForm/NavigateButton";
import { useCreateMarketplaceProject } from "../../../contexts/CreateMarketplaceProjectContext";
import Lightbox from "react-18-image-lightbox";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";

registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

const MarketplaceProjectMedia = () => {
  const { marketplaceProject, setMarketplaceProject, setFormIndex } =
    useCreateMarketplaceProject();
  const { id } = useParams();
  const navigate = useNavigate();
  const [next, setNext] = useState(false);

  // Initialize state from context for persistent files
  const [thumbnail, setThumbnail] = useState(
    marketplaceProject.marketplaceFiles
      ?.filter((file) => file.filetype === 2)
      .map((file) => ({ source: file.url, options: { type: "local" } })) || []
  );
  const [projectVideo, setProjectVideo] = useState(
    marketplaceProject.marketplaceFiles
      ?.filter((file) => file.filetype === 1)
      .map((file) => ({ source: file.url, options: { type: "local" } })) || []
  );
  const [projectImages, setProjectImages] = useState(
    marketplaceProject.marketplaceFiles
      ?.filter((file) => file.filetype === 4)
      .map((file) => ({ source: file.url, options: { type: "local" } })) || []
  );

  useEffect(() => {
    setFormIndex(2); // Set the form index for navigation
  }, []);

  // Sync state with context whenever files change
  useEffect(() => {
    const marketplaceFiles = [];

    if (thumbnail.length > 0) {
      marketplaceFiles.push({
        name: thumbnail[0].file?.name,
        url: thumbnail[0].file || thumbnail[0].source, // Use source if previously uploaded
        filetype: 2,
      });
    }

    if (projectVideo.length > 0) {
      marketplaceFiles.push({
        name: projectVideo[0].file?.name,
        url: projectVideo[0].file || projectVideo[0].source,
        filetype: 1,
      });
    }

    if (projectImages.length > 0) {
      projectImages.forEach((image, index) => {
        marketplaceFiles.push({
          name: image.file?.name,
          url: image.file || image.source,
          filetype: 4,
        });
      });
    }

    setMarketplaceProject((prev) => ({
      ...prev,
      marketplaceFiles,
    }));

    if (
      thumbnail.length > 0 &&
      projectVideo.length > 0 &&
      projectImages.length > 0
    ) {
      setNext(true);
    }
  }, [thumbnail, projectVideo, projectImages, setMarketplaceProject]);

  console.log(marketplaceProject.marketplaceFiles);

  return (
    <Paper elevation={1} className="bg-white w-full overflow-hidden">
      <div className="bg-primary-green text-white flex justify-center h-[3rem] text-xl font-semibold items-center mb-4">
        Project Media Files
      </div>

      <div className="px-5">
        <FormDivider title="Project thumbnail image" />
        <Grid2 container spacing={2} className="my-8">
          <Grid2 size={3}>
            <h4 className="font-semibold text-sm mb-1">Project thumbnail*</h4>
            <p className="text-gray-500 text-xs">
              Provide a sharp, dynamic image for your project thumbnail.
            </p>
          </Grid2>
          <Grid2 size={9}>
            <FilePond
              files={thumbnail}
              onupdatefiles={setThumbnail}
              allowMultiple={false}
              maxFiles={1}
              acceptedFileTypes={["image/*"]}
              name="thumbnail"
              labelIdle='Drag & drop a file here or <span class="filepond--label-action">Browse</span>'
            />
          </Grid2>
        </Grid2>

        <FormDivider title="Project demo video" />
        <Grid2 container spacing={2} className="my-8">
          <Grid2 size={3}>
            <h4 className="font-semibold text-sm mb-1">Project demo*</h4>
            <p className="text-gray-500 text-xs">
              Provide a 1-3 minute video introducing your project.
            </p>
          </Grid2>
          <Grid2 size={9}>
            <FilePond
              files={projectVideo}
              onupdatefiles={setProjectVideo}
              allowMultiple={false}
              maxFiles={1}
              acceptedFileTypes={["video/mp4", "video/avi", "video/mov"]}
              name="video"
              labelIdle='Drag & drop a file here or <span class="filepond--label-action">Browse</span>'
            />
            {projectVideo.length > 0 && (
              <div className="mt-4">
                <ReactPlayer
                  url={
                    projectVideo[0].file instanceof File
                      ? URL.createObjectURL(projectVideo[0].file)
                      : projectVideo[0].source
                  }
                  width="100%"
                  height="100%"
                  controls
                />
              </div>
            )}
          </Grid2>
        </Grid2>

        <FormDivider title="Project story images" />
        <Grid2 container spacing={2} className="my-8">
          <Grid2 size={3}>
            <h4 className="font-semibold text-sm mb-1">
              Project bonus images*
            </h4>
            <p className="text-gray-500 text-xs">
              Provide images that showcase different aspects of your project.
            </p>
          </Grid2>
          <Grid2 size={9}>
            <FilePond
              files={projectImages}
              onupdatefiles={setProjectImages}
              allowMultiple={true}
              maxFiles={4}
              acceptedFileTypes={["image/*"]}
              name="images"
              labelIdle='Drag & drop files here or <span class="filepond--label-action">Browse</span>'
            />
          </Grid2>
        </Grid2>

        <div className="flex justify-center gap-5 my-5">
          <NavigateButton
            text="Back"
            onClick={() =>
              navigate(`/request-marketplace-project/${id}/introduction`)
            }
          />
          <NavigateButton
            text="Next"
            disabled={!next}
            onClick={() =>
              navigate(`/request-marketplace-project/${id}/bank-account`)
            }
          />
        </div>
      </div>
    </Paper>
  );
};

export default MarketplaceProjectMedia;
