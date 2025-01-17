import {
  Box,
  Button,
  Divider,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuillEditor from "../../../components/UpdateProject/QuillEditor";
import "./index.css";
import { useUpdateMarketplaceProject } from "../../../contexts/UpdateMarketplaceProjectContext";

function MarketplaceProjectBasicInformation() {
  const { id } = useParams();
  const { marketplaceProject, setMarketplaceProject, edited, setEdited } =
    useUpdateMarketplaceProject();

  const [basicInfoEdited, setBasicInfoEdited] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [intro, setIntro] = useState(null);

  useEffect(() => {
    setName(marketplaceProject.name);
    setDescription(marketplaceProject.description);
    setIntro(marketplaceProject.introduction);
    setPrice(marketplaceProject.price);
    if (
      marketplaceProject.categories &&
      Array.isArray(marketplaceProject.categories)
    ) {
      const categoryNames = marketplaceProject.categories.map(
        (category) => category.name
      );
      setSelectedCategory(categoryNames);
    }
  }, [id, marketplaceProject]);

  const handleChangeName = (event) => {
    const updatedName = event.target.value;
    setName(updatedName);
    checkIfEdited(updatedName, description, intro, price);
  };

  const handleChangeDescription = (event) => {
    const updatedDescription = event.target.value;
    setDescription(updatedDescription);
    checkIfEdited(name, updatedDescription, intro, price);
  };

  const handleChangeIntroduction = (newIntro) => {
    console.log(newIntro);
    const updatedIntro = newIntro;
    setIntro(updatedIntro);
    checkIfEdited(name, description, updatedIntro, price);
  };

  const handleChangePrice = (event) => {
    const updatedPrice = event.target.value;
    setPrice(updatedPrice);
    checkIfEdited(updatedPrice, name, description, intro);
  };

  const checkIfEdited = (
    updatedName,
    updatedDescription,
    updatedIntro,
    updatedPrice
  ) => {
    if (
      updatedName !== marketplaceProject.name ||
      updatedDescription !== marketplaceProject.description ||
      updatedIntro !== marketplaceProject.introduction ||
      updatedPrice !== marketplaceProject.price
    ) {
      setBasicInfoEdited(true);
    } else {
      setBasicInfoEdited(false);
    }
  };

  const handleSaveAll = async () => {
    const updatedProject = {
      ...marketplaceProject,
      name: name,
      description: description,
      introduction: intro,
      price: price,
    };
    setMarketplaceProject(updatedProject);
    setEdited(true);
    setBasicInfoEdited(false);
  };

  const handleDiscardAll = async () => {
    setName(marketplaceProject.name);
    setDescription(marketplaceProject.description);
    setIntro(marketplaceProject.introduction);
    setPrice(marketplaceProject.price);
    setBasicInfoEdited(false);
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
          Basic Information
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
          Create a strong first impression by introducing your game with
          interesting features. This essential information will appear on the
          platform, and in search results, helping people easily discover and
          learn more about your game project.
        </Typography>
      </div>
      <div className="basic-info-section">
        <Typography className="basic-info-title" sx={{ width: "70%" }}>
          Project Name<span className="text-[#1BAA64]">*</span>
        </Typography>
        <Typography className="basic-info-subtitle" sx={{ width: "70%" }}>
          What is the name of your project?
        </Typography>
        <TextField
          placeholder="Project name..."
          className="custom-update-textfield"
          variant="outlined"
          required={true}
          value={name}
          onChange={handleChangeName}
          disabled={true}
        />
      </div>
      <div className="basic-info-section">
        <Typography className="basic-info-title" sx={{ width: "70%" }}>
          Project Description<span className="text-[#1BAA64]">*</span>
        </Typography>
        <Typography className="basic-info-subtitle" sx={{ width: "70%" }}>
          Provide a short description that best describes your project to your
          audience.
        </Typography>
        <TextField
          placeholder="Project description..."
          className="custom-update-textfield"
          rows={4}
          multiline
          variant="outlined"
          required={true}
          value={description}
          onChange={handleChangeDescription}
        />
      </div>
      <div className="basic-info-section !mb-[2rem]">
        <Typography className="basic-info-title" sx={{ width: "70%" }}>
          Project Category<span className="text-[#1BAA64]">*</span>
        </Typography>
        <Typography className="basic-info-subtitle" sx={{ width: "70%" }}>
          This field <span className="font-bold">CANNOT</span> be changed.
        </Typography>
        <FormControl sx={{ width: "70%" }} variant="outlined">
          <Select
            multiple
            disabled
            value={selectedCategory}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return (
                  <span style={{ color: "#989a9a" }}>Project category...</span>
                );
              }
              return selected.join(", ");
            }}
          >
            <MenuItem value="" disabled sx={{ color: "#989a9a" }}>
              Project category...
            </MenuItem>
            {/* {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category}
              </MenuItem>
            ))} */}
          </Select>
        </FormControl>
      </div>
      <div className="basic-info-section">
        <Typography className="basic-info-title" sx={{ width: "70%" }}>
          Project Price<span className="text-[#1BAA64]">*</span>
        </Typography>
        <Typography className="basic-info-subtitle" sx={{ width: "70%" }}>
          Provide a price for your game project.
        </Typography>
        <TextField
          placeholder="Project price..."
          className="custom-update-textfield"
          variant="outlined"
          required={true}
          type="number"
          value={price}
          onChange={handleChangePrice}
          onWheel={(e) => e.target.blur()}
        />
      </div>
      <Box className="basic-info-section">
        <div className="w-[70%]">
          <Divider
            sx={{ border: "1px solid #EAEAEA", borderRadius: "0.625rem" }}
          />
        </div>
      </Box>
      <div className="basic-info-section">
        <Typography className="basic-info-title" sx={{ width: "70%" }}>
          Project Introduction<span className="text-[#1BAA64]">*</span>
        </Typography>
        <Typography className="basic-info-subtitle" sx={{ width: "70%" }}>
          Share and introduce the story behind the project.
        </Typography>
        <QuillEditor
          introductionData={intro}
          setIntroductionData={handleChangeIntroduction}
        />
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
            disabled={!basicInfoEdited}
            sx={{ backgroundColor: "transparent", textTransform: "none" }}
            onClick={() => handleDiscardAll()}
          >
            Discard
          </Button>
          <Button
            variant="contained"
            disabled={!basicInfoEdited}
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

export default MarketplaceProjectBasicInformation;
