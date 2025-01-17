import {
  FormControl,
  Grid2,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useOutletContext, useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import FormDivider from "../../../components/CreateProject/ProjectForm/Divider";
import NavigateButton from "../../../components/CreateProject/ProjectForm/NavigateButton";
import { useCreateMarketplaceProject } from "../../../contexts/CreateMarketplaceProjectContext";
const MarketplaceProjectBasicInfo = () => {
  const { marketplaceProject, setMarketplaceProject, setFormIndex } =
    useCreateMarketplaceProject();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      categories: marketplaceProject?.categories,
      name: marketplaceProject?.name,
      description: marketplaceProject?.description,
      price: marketplaceProject?.price,
    },
  });

  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchCates = async () => {
    try {
      await axios
        .get("https://localhost:7044/api/categories/all")
        .then((res) => {
          setCategories(res.data._data);
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setFormIndex(0);
    fetchCates();
  }, []);

  // Reset form values when marketplaceProject updates
  useEffect(() => {
    if (marketplaceProject) {
      reset({
        categories: marketplaceProject.categories,
        name: marketplaceProject.name,
        description: marketplaceProject.description,
        price: marketplaceProject?.price,
      });
    }
  }, [marketplaceProject, reset]);

  const onSubmit = (data) => {
    setMarketplaceProject((prevData) => ({
      ...prevData,
      ...data,
    }));

    navigate(`/request-marketplace-project/${id}/introduction`);
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const formData = watch();
      if (Object.values(formData).some((field) => field !== "")) {
        const confirmationMessage =
          "You have unsaved changes. Are you sure you want to leave?";
        event.returnValue = confirmationMessage;
        return confirmationMessage;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [watch]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Paper elevation={1} className="bg-white w-full overflow-hidden">
        <div className="bg-primary-green text-white flex justify-center h-[3rem] text-xl font-semibold items-center mb-4">
          Fill up basic info
        </div>

        <div className="px-5 py-4">
          <FormDivider title={"Setup Category"} />
          <Grid2 container spacing={4} className="my-8">
            <Grid2 size={4}>
              <h4 className="font-semibold text-sm mb-1">Category*</h4>
              <p className="text-gray-500 text-xs">
                To help backers find your campaign, select a category that best
                represents your project.
              </p>
            </Grid2>
            <Grid2 size={8}>
              <FormControl
                fullWidth
                variant="outlined"
                error={!!errors.categories}
              >
                <Select
                  multiple
                  value={
                    marketplaceProject?.categories?.map(
                      (category) => category.id
                    ) || []
                  }
                  disabled // Disables user input on the field
                  renderValue={(selected) =>
                    marketplaceProject?.categories
                      .filter((category) => selected.includes(category.id))
                      .map((category) => category.name)
                      .join(", ")
                  }
                >
                  {categories?.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.categories && (
                  <p className="text-red-600">{errors.categories.message}</p>
                )}
              </FormControl>
            </Grid2>
          </Grid2>

          <FormDivider title={"Project details"} />
          <Grid2 container spacing={4} className="my-8">
            <Grid2 size={4}>
              <h4 className="font-semibold text-sm mb-1">Project name*</h4>
              <p className="text-gray-500 text-xs">
                What is the title of your project?
              </p>
            </Grid2>
            <Grid2 size={8}>
              <TextField
                placeholder="Project name..."
                fullWidth
                variant="outlined"
                {...register("name", { required: "Project name is required" })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={4} className="my-8">
            <Grid2 size={4}>
              <h4 className="font-semibold text-sm mb-1">
                Project description*
              </h4>
              <p className="text-gray-500 text-xs">
                Provide a short description that best describes your campaign to
                your audience.
              </p>
            </Grid2>
            <Grid2 size={8}>
              <TextField
                placeholder="Project description..."
                fullWidth
                rows={4}
                multiline
                variant="outlined"
                {...register("description", {
                  required: "Description is required",
                })}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={4} className="my-8">
            <Grid2 size={4}>
              <h4 className="font-semibold text-sm mb-1">Price*</h4>
              <p className="text-gray-500 text-xs">
                How much money would you like to raise for this campaign?
              </p>
            </Grid2>
            <Grid2 size={8}>
              <TextField
                placeholder="Price..."
                fullWidth
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">VND</InputAdornment>
                  ),
                  inputProps: { min: "0" },
                }}
                variant="outlined"
                {...register("price", {
                  required: "Price is required",
                  min: {
                    value: 1000,
                    message: "Price must be at least 1.000 VND",
                  },
                })}
                error={!!errors.price}
                helperText={errors.price?.message}
                onWheel={(e) => e.target.blur()}
              />
            </Grid2>
          </Grid2>

          <div className="flex justify-center gap-5">
            <NavigateButton text={"Back"} disabled={true} />
            <NavigateButton text={"Next"} onClick={handleSubmit(onSubmit)} />
          </div>
        </div>
      </Paper>
    </form>
  );
};

export default MarketplaceProjectBasicInfo;
