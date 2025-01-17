import { Grid2, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import FormDivider from "../../../components/CreateProject/ProjectForm/Divider";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import ReactPlayer from "react-player";
import NavigateButton from "../../../components/CreateProject/ProjectForm/NavigateButton";
import { useCreateMarketplaceProject } from "../../../contexts/CreateMarketplaceProjectContext";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import marketplaceProjectApiInstace from "../../../utils/ApiInstance/marketplaceProjectApiInstance";
import { useLoading } from "../../../contexts/LoadingContext";
import couponApiInstace from "../../../utils/ApiInstance/couponApiInstance";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";

registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize
);

const MarketplaceProjectGameContent = () => {
  const { marketplaceProject, setMarketplaceProject, setFormIndex } =
    useCreateMarketplaceProject();
  const { id } = useParams();
  const navigate = useNavigate();
  const token = Cookies.get("_auth");
  const { isLoading, setIsLoading } = useLoading();

  const [couponFile, setCouponFile] = useState(
    marketplaceProject.marketplaceFiles
      ?.filter((file) => file.filetype === 9)
      .map((file) => ({ source: file.url, options: { type: "local" } })) || []
  );
  const [gameFile, setGameFile] = useState(
    marketplaceProject.marketplaceFiles
      ?.filter((file) => file.filetype === 3)
      .map((file) => ({ source: file.url, options: { type: "local" } })) || []
  );
  const [evidenceFiles, setEvidenceFiles] = useState(
    marketplaceProject.marketplaceFiles
      ?.filter((file) => file.filetype === 5)
      .map((file) => ({ source: file.url, options: { type: "local" } })) || []
  );

  useEffect(() => {
    setFormIndex(4);
  }, []);

  useEffect(() => {
    const files = [];

    if (couponFile.length > 0) {
      files.push({
        name: "coupon_file",
        url: couponFile[0].file || couponFile[0].source,
        filetype: 9,
      });
    }

    if (gameFile.length > 0) {
      files.push({
        name: gameFile[0].file.name,
        url: gameFile[0].file || gameFile[0].source,
        filetype: 3,
      });
    }

    if (evidenceFiles.length > 0) {
      evidenceFiles.forEach((evidence, index) => {
        files.push({
          name: evidence.file.name,
          url: evidence.file || evidence.source,
          filetype: 5,
        });
      });
    }

    setMarketplaceProject((prev) => {
      // Filter out old entries for couponFile, gameFile, and evidenceFiles
      const filteredFiles = prev.marketplaceFiles.filter(
        (file) =>
          file.filetype !== 9 && file.filetype !== 3 && file.filetype !== 5
      );

      // Add the updated files without duplicating
      return {
        ...prev,
        marketplaceFiles: [...filteredFiles, ...files],
      };
    });
  }, [couponFile, gameFile, evidenceFiles]);

  console.log(marketplaceProject.marketplaceFiles);

  const createRequest = async () => {
    setIsLoading(true);

    if (!(gameFile.length > 0)) {
      Swal.fire({
        title: "Error",
        text: "Game file is required.",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });

      return;
    }

    if (!(evidenceFiles.length > 0)) {
      Swal.fire({
        title: "Error",
        text: "Evidence(s) is required.",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });

      return;
    }

    const formData = new FormData();

    //funding project id
    formData.append("FundingProjectId", marketplaceProject.fundingProjectId);

    //basic information
    formData.append("Name", marketplaceProject.name);
    formData.append("Description", marketplaceProject.description);
    formData.append("Introduction", marketplaceProject.introduction);
    formData.append("Price", marketplaceProject.price);

    //Bank Account information
    formData.append(
      "BankAccount.BankNumber",
      marketplaceProject.bankAccount.bankNumber
    );
    formData.append(
      "BankAccount.BankCode",
      marketplaceProject.bankAccount.bankCode
    );

    //files
    for (let i = 0; i < marketplaceProject.marketplaceFiles.length; i++) {
      formData.append(
        `MarketplaceFiles[${i}].Name`,
        marketplaceProject.marketplaceFiles[i].name
      );
      formData.append(
        `MarketplaceFiles[${i}].URL`,
        marketplaceProject.marketplaceFiles[i].url
      );
      formData.append(
        `MarketplaceFiles[${i}].Filetype`,
        marketplaceProject.marketplaceFiles[i].filetype
      );
    }

    console.log("FormData contents:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    //call api
    try {
      const response = await marketplaceProjectApiInstace.post("", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        Swal.fire({
          title: "Success",
          text: response.data._message[0],
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });

        const marketplaceProjectId = response.data._data.id;

        navigate("/account/projects");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        Swal.fire({
          title: "Error",
          text: error.response.data.message,
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Paper elevation={1} className="bg-white w-full overflow-hidden">
        <div className="bg-primary-green text-white flex justify-center h-[3rem] text-xl font-semibold items-center mb-4">
          Game Content
        </div>

        <div className="px-5">
          {/* <FormDivider title="Coupon" />
          <Grid2 container spacing={2} className="my-8">
            <Grid2 size={3}>
              <h4 className="font-semibold text-sm mb-1">Coupon</h4>
              <p className="text-gray-500 text-xs">
                Provide a list of coupons for your game (optional).
              </p>
              <p className="text-gray-500 text-xs">
                Download template{" "}
                <span>
                  <a
                    href="https://funfundingmediafiles.blob.core.windows.net/fundingprojectfiles/CouponFileTemplate_149c720d-a6cc-44d0-9124-b80db1b55976.xlsx"
                    style={{ color: "var(--primary-green)", fontWeight: "500" }}
                  >
                    here
                  </a>
                </span>
              </p>
            </Grid2>
            <Grid2 size={9}>
              <FilePond
                files={couponFile}
                onupdatefiles={setCouponFile}
                allowMultiple={false}
                maxFiles={1}
                acceptedFileTypes={[]}
                name="coupon"
                labelIdle='Drag & drop a file here or <span class="filepond--label-action">Browse</span>'
              />
            </Grid2>
          </Grid2> */}

          <FormDivider title="Game file" />
          <Grid2 container spacing={2} className="my-8">
            <Grid2 size={3}>
              <h4 className="font-semibold text-sm mb-1">Game file*</h4>
              <p className="text-gray-500 text-xs">
                Provide a game file for everybody to download.
              </p>
            </Grid2>
            <Grid2 size={9}>
              <FilePond
                files={gameFile}
                onupdatefiles={setGameFile}
                allowMultiple={false}
                maxFiles={1}
                maxTotalFileSize={"500MB"}
                acceptedFileTypes={[]}
                name="game"
                labelIdle='Drag & drop a file here or <span class="filepond--label-action">Browse</span>'
                labelMaxTotalFileSize={"Max file size: 500MB"}
              />
            </Grid2>
          </Grid2>

          <FormDivider title="Evidence" />
          <Grid2 container spacing={2} className="my-8">
            <Grid2 size={3}>
              <h4 className="font-semibold text-sm mb-1">Evidence file*</h4>
              <p className="text-gray-500 text-xs">
                Provide images to prove you have included the key validator
                package.
              </p>
            </Grid2>
            <Grid2 size={9}>
              <FilePond
                files={evidenceFiles}
                onupdatefiles={setEvidenceFiles}
                allowMultiple={true}
                maxFiles={5}
                acceptedFileTypes={["image/*"]}
                name="evidences"
                labelIdle='Drag & drop files here or <span class="filepond--label-action">Browse</span>'
              />
            </Grid2>
          </Grid2>

          <div className="flex justify-center gap-5 my-5">
            <NavigateButton
              text="Back"
              onClick={() =>
                navigate(`/request-marketplace-project/${id}/bank-account`)
              }
            />
            <NavigateButton
              text="Create request"
              onClick={() => createRequest()}
            />
          </div>
        </div>
      </Paper>
    </>
  );
};

export default MarketplaceProjectGameContent;
