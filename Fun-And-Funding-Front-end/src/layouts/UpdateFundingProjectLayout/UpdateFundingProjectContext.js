import { createContext } from "react";

const initialProject = {
  id: "",
  name: "",
  description: "",
  introduction: "",
  startDate: "",
  endDate: "",
  target: 0,
  balance: 0,
  status: null,
  wallet: {
    id: "",
    balance: 0,
    bankAccount: {
      id: "",
      bankNumber: "",
      bankCode: "",
    },
  },
  packages: [
    {
      id: "",
      name: "",
      requiredAmount: 0,
      url: "",
      limitQuantity: 0,
      updatedImage: null,
      rewardItems: [
        {
          id: "",
          name: "",
          description: "",
          quantity: 0,
          imageFile: null,
          imageUrl: "",
        },
      ],
    },
  ],
  fundingFiles: [
    {
      id: "",
      name: "",
      url: "",
      urlFile: null,
      filetype: 0,
      isDeleted: null,
    },
  ],
  existedFile: [
    {
      id: "",
      name: "",
      url: "",
      urlFile: null,
      filetype: 0,
      isDeleted: null,
      newlyAdded: null,
    },
  ],
};

const ProjectContext = createContext({
  project: initialProject,
  edited: false,
  isLoading: false,
  loadingStatus: 0,
  setProject: (data) => {},
  setIsEdited: (isEdited) => {},
  setIsLoading: (loading) => {},
  setLoadingStatus: (loadingStatus) => {},
});

export default ProjectContext;
