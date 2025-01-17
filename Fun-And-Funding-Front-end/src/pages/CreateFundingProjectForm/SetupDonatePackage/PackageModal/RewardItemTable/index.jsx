import { Add } from '@mui/icons-material';
import { useState } from 'react';

const RewardItemTable = ({ packageData, setPackageData }) => {
  // console.log('packageData: ' + JSON.stringify(packageData.rewardItems))
  const [isAdding, setIsAdding] = useState(false);
  const [newRewardItem, setNewRewardItem] = useState({
    name: '',
    description: '',
    quantity: 0,
    imageFile: ''
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editRewardItem, setEditRewardItem] = useState(null);

  const handleNewRewardItemChange = (e) => {
    const { name, value } = e.target;
    setNewRewardItem((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditRewardItemChange = (e) => {
    const { name, value } = e.target;
    setEditRewardItem((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItemClick = () => {
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewRewardItem({ name: '', description: '', quantity: 0, imageFile: '' });
  };

  const handleConfirmAdd = () => {
    setPackageData((prev) => ({
      ...prev,
      rewardItems: [...prev.rewardItems, newRewardItem],
    }));
    setIsAdding(false);
    setNewRewardItem({ name: '', description: '', quantity: 0, imageFile: '' });
  };

  const handleEditItemClick = (index) => {
    setEditingIndex(index);
    setEditRewardItem(packageData.rewardItems[index]);
  };

  const handleSaveEdit = () => {
    const updatedRewardItems = packageData.rewardItems.map((item, index) =>
      index === editingIndex ? editRewardItem : item
    );
    setPackageData((prev) => ({
      ...prev,
      rewardItems: updatedRewardItems
    }));
    setEditingIndex(null);  // Exit edit mode
  };

  const handleDeleteItem = (index) => {
    const updatedRewardItems = packageData.rewardItems.filter((_, i) => i !== index);
    setPackageData((prev) => ({
      ...prev,
      rewardItems: updatedRewardItems
    }));
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };
  const handleImageChange = (e, index, isEditing = false) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (isEditing) {
        // Update the reward item being edited
        setEditRewardItem((prev) => ({
          ...prev,
          imageFile: file,
          imageUrl: imageUrl
        }));
      } else if (index === -1) {
        // Update the new reward item being added
        setNewRewardItem((prev) => ({
          ...prev,
          imageFile: file,
          imageUrl: imageUrl
        }));
      }
    }
  };
  return (
    <>
      <div className="relative overflow-x-auto sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="py-3 text-center w-[15%]">Item image</th>
              <th scope="col" className="py-3 text-center w-[25%]">Name</th>
              <th scope="col" className="py-3 text-center w-[30%]">Description</th>
              <th scope="col" className="py-3 text-center w-[10%]">Quantity</th>
              <th scope="col" className="py-3 text-center w-[20%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packageData.rewardItems?.map((item, index) => (
              editingIndex === index ? (
                <tr key={index} className="bg-white border-b hover:bg-gray-50 ">
                  <td className="px-2 py-4 flex justify-center">
                    <label className="flex items-center justify-center w-[3rem] h-[3rem] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ">
                      <div className="flex items-center justify-center pt-5 pb-6">
                        {/* <svg className="w-8 h-8 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg> */}
                      </div>
                      {editRewardItem.imageUrl ? (
                        <img
                          src={editRewardItem.imageUrl}
                          alt="Reward Preview"
                          className="w-[3rem] h-[3rem] object-cover rounded-lg"
                        />
                      ) : (
                        <label className="flex items-center justify-center w-[3rem] h-[3rem] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex items-center justify-center pt-5 pb-6">
                            <svg
                              className="w-8 h-8 text-gray-500"
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
                          </div>
                          <input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            name="imageFile"
                            onChange={(e) => handleImageChange(e, index, true)}
                          />
                        </label>
                      )}
                      <input id="dropzone-file" type="file" className="hidden" name="imageFile" onChange={(e) => handleImageChange(e, index, true)} />
                    </label>
                  </td>
                  <td className="px-2 py-4">
                    <input
                      type="text"
                      name="name"
                      value={editRewardItem.name}
                      placeholder="Reward name"
                      onChange={handleEditRewardItemChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-1 w-full"
                    />
                  </td>
                  <td className="px-2 py-4">
                    <textarea
                      name="description"
                      rows={1}
                      value={editRewardItem.description}
                      placeholder="Reward description"
                      onChange={handleEditRewardItemChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-1 w-full"
                    />
                  </td>
                  <td className="px-2 py-4 text-center">
                    <input
                      type="number"
                      name="quantity"
                      value={editRewardItem.quantity}
                      placeholder="Quantity"
                      onChange={handleEditRewardItemChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-1 w-full"
                    />
                  </td>
                  <td className="">
                    <div className='flex items-center'>
                      <button
                        onClick={handleSaveEdit}
                        className="mr-1 font-medium text-gray-100 bg-blue-800 px-2 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleDeleteItem(index)}
                        className="mr-1 font-medium text-gray-100 bg-red-800 px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="font-medium text-gray-600 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>

                  </td>
                </tr>
              ) : (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-2 py-4 flex justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt="Reward"
                        className="w-[3rem] h-[3rem] object-cover rounded-lg"
                      />
                    ) : (
                      <label className="flex items-center justify-center w-[3rem] h-[3rem] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 text-gray-500"
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
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                        </div>
                      </label>
                    )}
                  </td>
                  <td className="px-2 py-4 text-center">{item.name}</td>
                  <td className="px-2 py-4 text-center">{item.description}</td>
                  <td className="px-2 py-4 text-center">{item.quantity}</td>
                  <td className="px-2 py-4 text-center">
                    <button
                      onClick={() => handleEditItemClick(index)}
                      className="font-medium text-gray-100 bg-blue-800 px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              )
            ))}
            {isAdding ? (
              <tr className="bg-white border-b hover:bg-gray-50 ">
                <td className="px-2 py-4 flex justify-center">
                  <label className="flex items-center justify-center w-[3rem] h-[3rem] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ">
                    <div className="flex items-center justify-center pt-5 pb-6">
                      {/* <svg className="w-8 h-8 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                      </svg> */}
                    </div>
                    {newRewardItem.imageUrl ? (
                      <img
                        src={newRewardItem.imageUrl}
                        alt="Reward Preview"
                        className="w-[3rem] h-[3rem] object-cover rounded-lg"
                      />
                    ) : (
                      <label className="flex items-center justify-center w-[3rem] h-[3rem] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 text-gray-500"
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
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          name="imageFile"
                          onChange={(e) => handleImageChange(e, -1)}
                        />
                      </label>
                    )}
                  </label>
                </td>
                <td className="px-2 py-4">
                  <input
                    type="text"
                    name="name"
                    value={newRewardItem.name}
                    placeholder="Reward name"
                    onChange={handleNewRewardItemChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-1 w-full"
                  />
                </td>
                <td className="px-2 py-4">
                  <textarea
                    name="description"
                    rows={1}
                    value={newRewardItem.description}
                    placeholder="Reward description"
                    onChange={handleNewRewardItemChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-1 w-full"
                  />
                </td>
                <td className="px-2 py-4 text-center">
                  <input
                    type="number"
                    name="quantity"
                    value={newRewardItem.quantity}
                    placeholder="Quantity"
                    onChange={handleNewRewardItemChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-1 w-full"
                  />
                </td>
                <td className="px-2 py-4 text-center">
                  <button
                    onClick={handleConfirmAdd}
                    className="mr-2 font-medium text-gray-100 bg-primary-green px-2 py-1 rounded"
                  >
                    Add
                  </button>
                  <button
                    onClick={handleCancelAdd}
                    className="font-medium text-red-600 hover:underline"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ) : (
              <tr className="bg-white hover:bg-gray-50 ">
                <td colSpan={5} className="py-2 text-center">
                  <button
                    onClick={handleAddItemClick}
                    className="px-2 py-1 font-medium text-gray-100 bg-primary-green rounded"
                  >
                    <div className='flex items-center'>
                      New Reward Item <Add />
                    </div>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RewardItemTable;
