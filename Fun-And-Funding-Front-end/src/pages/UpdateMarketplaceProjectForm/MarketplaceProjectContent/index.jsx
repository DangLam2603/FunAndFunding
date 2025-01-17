import AddCircleIcon from "@mui/icons-material/AddCircle";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import {
  Box,
  Button,
  ImageList,
  ImageListItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Lightbox from "react-18-image-lightbox";
import "react-18-image-lightbox/style.css";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import QuillEditor from "../../../components/AccountProfile/QuillEditor";
import { useUpdateMarketplaceProject } from "../../../contexts/UpdateMarketplaceProjectContext";

function MarketplaceProjectContent() {
  const { id } = useParams();
  const { marketplaceProject, setMarketplaceProject, edited, setEdited } =
    useUpdateMarketplaceProject();

  const [gameFile, setGameFile] = useState([]);
  const [version, setVersion] = useState("");
  const [description, setDescription] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [contentEdited, setContentEdited] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id, marketplaceProject]);

  const fetchData = () => {
    const allFiles = [
      ...(marketplaceProject.existingFiles || []),
      ...(marketplaceProject.marketplaceFiles || []),
    ];

    console.log(allFiles);

    if (allFiles.length > 0) {
      const game = allFiles.filter(
        (file) => file.fileType === 3 && !file.isDeleted
      );
      let gameData =
        game.length > 0
          ? game.map((file) => ({
            id: file.id,
            name: file.name,
            url: file.url,
            isDeleted: file.isDeleted,
            fileType: file.fileType,
            version: file.version,
            description: file.description,
          }))
          : [];
      setGameFile(gameData);
      setVersion(gameData[0]?.version);
      setDescription(gameData[0]?.description);

      console.log(gameFile);
    }
  };

  const handleGameFileChange = (e, fileId) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      setGameFile((prev) => {
        const fileIndex = prev.findIndex((item) => item.id === fileId);
        const fileToUpdate = [...prev];
        if (fileIndex != -1) {
          fileToUpdate[fileIndex].isDeleted = true;
        } else {
          const filteredFile = fileToUpdate.filter(
            (item) => item.id !== fileId
          );
          fileToUpdate.length = 0;
          fileToUpdate.push(...filteredFile);
        }

        const newFile = {
          id: uuidv4(),
          name: file.name,
          url: file,
          isDeleted: false,
          fileType: 3,
          version: "",
          description: "",
        };
        console.log(newFile);
        console.log(fileToUpdate);

        return [...fileToUpdate, newFile];
      });

      setContentEdited(true);
      e.target.value = null;
    }
  };

  console.log(gameFile);

  const getSelectedFileId = () => {
    const file = gameFile.find((item) => !item.isDeleted);
    return file ? file.id : null;
  };

  const handleSaveAll = async () => {
    if (!version) {
      Swal.fire({
        title: "Save failed",
        text: "Version is required.",
        icon: "error",
      });

      return;
    }

    if (!description) {
      Swal.fire({
        title: "Save failed",
        text: "Description is required.",
        icon: "error",
      });

      return;
    }

    console.log(gameFile);

    const existingFiles = [...marketplaceProject.existingFiles];
    const marketplaceFiles = [...marketplaceProject.marketplaceFiles];

    const classifyFiles = (files) => {
      files.forEach((file) => {
        if (typeof file.url === "object") {
          if (!file.isDeleted) {
            file.version = version;
            file.description = description;
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

    classifyFiles(gameFile);

    const updatedProject = {
      ...marketplaceProject,
      marketplaceFiles: marketplaceFiles,
      existingFiles: existingFiles,
    };

    console.log(updatedProject);

    setMarketplaceProject(updatedProject);
    setEdited(true);
    setContentEdited(false);
  };

  const handleDiscardAll = () => {
    fetchData();
    setContentEdited(false);
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
          Game Content
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
          Game File<span className="text-[#1BAA64]">*</span>
        </Typography>
        <Typography className="basic-info-subtitle" sx={{ width: "70%" }}>
          Provide a sharp, dynamic image for your project thumbnail.
        </Typography>
        {gameFile &&
          gameFile.length > 0 &&
          gameFile.some((item) => !item.isDeleted) ? (
          gameFile
            .filter((item) => !item.isDeleted)
            .map((item, index) => (
              <div
                className="h-[10rem] overflow-hidden rounded-lg bg-gray-200 flex justify-center items-center w-[70%]"
                key={index}
              >
                <div className="text-center">
                  <div className="font-light mb-1 italic text-gray-800 text-center">
                    {item.name}
                  </div>
                  <a
                    href={
                      typeof item.url === "string"
                        ? item.url
                        : URL.createObjectURL(item.url)
                    }
                    download
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 "
                  >
                    <svg
                      className="w-3.5 h-3.5 me-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                      <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                    </svg>{" "}
                    Download File
                  </a>
                </div>
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
              {/* <p className="text-xs text-gray-500 !text-[1rem] font-medium">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </p> */}
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
            onChange={(e) => handleGameFileChange(e, getSelectedFileId())}
            style={{ display: "none" }}
            id="game-file-input"
          />
          <Button
            variant="contained"
            onClick={() => document.getElementById("game-file-input").click()}
            sx={{
              backgroundColor: "#1BAA64",
              textTransform: "none",
              fontWeight: "600",
            }}
            startIcon={<ChangeCircleIcon />}
          >
            Change Game File
          </Button>
        </Box>
      </div>

      <div className="basic-info-section">
        <Typography className="basic-info-title" sx={{ width: "70%" }}>
          Version<span className="text-[#1BAA64]">*</span>
        </Typography>
        <Typography className="basic-info-subtitle" sx={{ width: "70%" }}>
          What is the version of your game?
        </Typography>
        <TextField
          placeholder="Version..."
          className="custom-update-textfield"
          variant="outlined"
          required={true}
          value={version}
          onChange={(e) => {
            setVersion(e.target.value);
          }}
        />
      </div>

      <div className="basic-info-section">
        <Typography className="basic-info-title" sx={{ width: "70%" }}>
          Description<span className="text-[#1BAA64]">*</span>
        </Typography>
        <Typography className="basic-info-subtitle" sx={{ width: "70%" }}>
          What is the description of your update?
        </Typography>
        <Box className="w-[70%] !important !mb-[4rem]">
          <QuillEditor
            value={description}
            data={description}
            setData={setDescription}
            isEnabled={true}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
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
            disabled={!contentEdited}
            sx={{ backgroundColor: "transparent", textTransform: "none" }}
            onClick={() => handleDiscardAll()}
          >
            Discard
          </Button>
          <Button
            variant="contained"
            disabled={!contentEdited}
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

export default MarketplaceProjectContent;
