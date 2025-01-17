import { ImageList, ImageListItem, Typography } from "@mui/material";
import React, { useState } from "react";
import Lightbox from "react-18-image-lightbox";

function MarketplaceProjectGameFile({ marketplaceProject }) {
  const [gameFile, setGameFile] = useState(
    marketplaceProject.marketplaceFiles.filter((file) => file.fileType === 3) ||
      []
  );
  const [evidenceFiles, setEvidenceFiles] = useState(
    marketplaceProject.marketplaceFiles.filter((file) => file.fileType === 5) ||
      []
  );
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const handleImageClick = (index) => {
    setPhotoIndex(index);
    setIsImageOpen(true);
  };

  return (
    <div className="mb-[2rem] flex flex-col gap-4">
      <div>
        {gameFile &&
        gameFile.length > 0 &&
        gameFile.some((item) => !item.isDeleted) ? (
          gameFile
            .filter((item) => !item.isDeleted)
            .map((item, index) => (
              <div
                className="h-[10rem] overflow-hidden rounded-lg bg-gray-200 flex justify-center items-center w-[100%]"
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
          <>No File Uploaded</>
        )}
      </div>

      <div>
        <Typography
          className="basic-info-subtitle"
          sx={{ width: "100%", fontWeight: "600" }}
        >
          Evidences
        </Typography>
        {evidenceFiles &&
        evidenceFiles.length > 0 &&
        evidenceFiles.some((item) => !item.isDeleted) ? (
          <ImageList
            sx={{
              width: "100%",
              ml: "0 !important",
              maxHeight: "40rem",
              scrollbarWidth: "thin",
            }}
            cols={3}
            rowHeight={160}
          >
            {evidenceFiles
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
          <>No Files Uploaded.</>
        )}

        {isImageOpen && (
          <Lightbox
            mainSrc={
              typeof evidenceFiles.filter((item) => !item.isDeleted)[photoIndex]
                .url === "string"
                ? evidenceFiles.filter((item) => !item.isDeleted)[photoIndex]
                    .url
                : URL.createObjectURL(
                    evidenceFiles.filter((item) => !item.isDeleted)[photoIndex]
                      .url
                  )
            }
            nextSrc={
              evidenceFiles.filter((item) => !item.isDeleted)[
                (photoIndex + 1) %
                  evidenceFiles.filter((item) => !item.isDeleted).length
              ].url
            }
            prevSrc={
              evidenceFiles.filter((item) => !item.isDeleted)[
                (photoIndex +
                  evidenceFiles.filter((item) => !item.isDeleted).length -
                  1) %
                  evidenceFiles.filter((item) => !item.isDeleted).length
              ].url
            }
            onCloseRequest={() => setIsImageOpen(false)}
            onMovePrevRequest={() =>
              setPhotoIndex(
                (photoIndex +
                  evidenceFiles.filter((item) => !item.isDeleted).length -
                  1) %
                  evidenceFiles.filter((item) => !item.isDeleted).length
              )
            }
            onMoveNextRequest={() =>
              setPhotoIndex(
                (photoIndex + 1) %
                  evidenceFiles.filter((item) => !item.isDeleted).length
              )
            }
          />
        )}
      </div>
    </div>
  );
}

export default MarketplaceProjectGameFile;
