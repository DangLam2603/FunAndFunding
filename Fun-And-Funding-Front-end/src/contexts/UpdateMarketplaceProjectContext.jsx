import { useState, useContext, createContext } from "react";

const UpdateMarketplaceProjectContext = createContext();

export const useUpdateMarketplaceProject = () =>
  useContext(UpdateMarketplaceProjectContext);

export const UpdateMarketplaceProjectProvider = ({ children }) => {
  const [edited, setEdited] = useState(false);
  const [marketplaceProject, setMarketplaceProject] = useState({
    name: "",
    description: "",
    introduction: "",
    price: 0,
    marketplaceFiles: [
      {
        id: "",
        name: "",
        url: "",
        filetype: 0,
        version: "",
        description: "",
      },
    ],
    existingFiles: [
      {
        id: "",
        name: "",
        url: "",
        version: "",
        description: "",
        filetype: 0,
        isDeleted: false,
      },
    ],
    bankAccount: {
      id: "",
      bankNumber: "",
      bankCode: "",
    },
    categories: [{ id: "", name: "" }],
    wallet : {
      id: "",
      balance : 0
    }
  });

  return (
    <UpdateMarketplaceProjectContext.Provider
      value={{
        marketplaceProject,
        setMarketplaceProject,
        edited,
        setEdited,
      }}
    >
      {children}
    </UpdateMarketplaceProjectContext.Provider>
  );
};
