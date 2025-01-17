import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';

function EditRewardItemTable({ rewardItems: initialRewardItems, onUpdateRewardItems }) {
    const [isAdding, setIsAdding] = useState(false);
    const [rewardItems, setRewardItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', quantity: 1, description: '', imageUrl: null });
    const [editingItemIndex, setEditingItemIndex] = useState(null);
    const [editedItem, setEditedItem] = useState(null);

    const handleAddClick = () => {
        setIsAdding(true);
    };

    useEffect(() => {
        setRewardItems(initialRewardItems);
    }, [initialRewardItems]);

    const generateGUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const handleSaveRewardItem = () => {
        const updatedRewardItems = [
            ...rewardItems,
            { ...newItem, newlyAdded: true, id: generateGUID() },
        ];
        setRewardItems(updatedRewardItems);
        setIsAdding(false);
        setNewItem({ name: '', quantity: 1, description: '', imageUrl: null });
        onUpdateRewardItems(updatedRewardItems);
    };

    const handleCancelRewardItem = () => {
        setIsAdding(false);
        setNewItem({ name: '', quantity: 1, description: '', imageUrl: null });
    };

    const handleEditClick = (index) => {
        setEditingItemIndex(index);
        setEditedItem(rewardItems[index]);
    };

    const handleSaveEditedItem = () => {
        const updatedRewardItems = [...rewardItems];
        updatedRewardItems[editingItemIndex] = editedItem;
        setRewardItems(updatedRewardItems);
        onUpdateRewardItems(updatedRewardItems);
        setEditingItemIndex(null);
        setEditedItem(null);
    };

    const handleCancelEdit = () => {
        setEditingItemIndex(null);
        setEditedItem(null);
    };

    const handleDeleteItem = (index) => {
        const updatedRewardItems = rewardItems.filter((_, i) => i !== index);
        setRewardItems(updatedRewardItems);
        onUpdateRewardItems(updatedRewardItems);
    };

    const handleImageChange = (event, isEditing) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            if (isEditing) {
                setEditedItem((prevItem) => ({ ...prevItem, imageUrl: URL.createObjectURL(file), imageFile: file }));
            } else {
                setNewItem((prevNewItem) => ({ ...prevNewItem, imageUrl: URL.createObjectURL(file), imageFile: file }));
            }
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className='block' style={{ borderRadius: '0.625rem', overflow: 'hidden' }}>
            <TableContainer>
                <Table
                    sx={{
                        borderCollapse: 'separate',
                        borderSpacing: 0,
                        borderRadius: '0.625rem',
                        tableLayout: 'fixed',
                        width: '100%',
                    }}
                >
                    <TableHead sx={{ backgroundColor: '#2F3645 !important', borderTopLeftRadius: '0.625rem', borderTopRightRadius: '0.625rem' }}>
                        <TableRow>
                            <TableCell align="left" className='package-table-cell' sx={{ pl: '1.5rem !important', bgcolor: 'transparent', width: '15%' }}>Image</TableCell>
                            <TableCell align="left" className='package-table-cell' sx={{ bgcolor: 'transparent', width: '25%' }}>Name</TableCell>
                            <TableCell align="left" className='package-table-cell' sx={{ bgcolor: 'transparent', width: '27.5%' }}>Description</TableCell>
                            <TableCell align="left" className='package-table-cell' sx={{ bgcolor: 'transparent', width: '12.5%' }}>Quantity</TableCell>
                            <TableCell align="left" className='package-table-cell' sx={{ bgcolor: 'transparent', width: '20%' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rewardItems.length > 0 &&
                            rewardItems.map((row, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? '#F5F7F8' : '#EAEAEA',
                                        '&:last-child': { border: 'none !important' },
                                    }}
                                >
                                    <TableCell component="th" scope="row" align="left" sx={{ pl: '1.5rem !important', width: '10%' }}>
                                        {editingItemIndex === index ? (
                                            editedItem.imageUrl ? (
                                                <div className="relative w-[5rem] h-[5rem]">
                                                    <img
                                                        className="w-full h-full object-cover rounded-[0.25rem]"
                                                        src={editedItem.imageUrl}
                                                        alt={editedItem.name}
                                                    />
                                                    <button
                                                        onClick={() => setEditedItem({ ...editedItem, imageUrl: null, imageFile: null })}
                                                        className="absolute inset-0 flex items-center justify-center bg-[#2F3645] bg-opacity-50 rounded-[0.25rem] opacity-0 hover:opacity-100 transition-opacity"
                                                        title="Remove Image"
                                                    >
                                                        <CancelIcon className="text-white" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="flex flex-col items-center justify-center w-[5rem] h-[5rem] border-2 border-[#2F3645] border-dashed rounded-lg cursor-pointer bg-[#EAEAEA] hover:bg-[#EAEAEA]">
                                                    <div className="flex items-center justify-center py-6 pb-6">
                                                        <svg className="w-[3rem] h-[3rem] text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                            <path stroke="currentColor" gistrokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                        </svg>
                                                    </div>
                                                    <input type="file" className="hidden" onChange={(e) => handleImageChange(e, true)} />
                                                </label>
                                            )
                                        ) : (
                                            <img className='w-[5rem] h-[5rem] object-cover rounded-[0.25rem]' src={row.imageUrl} alt={row.name} />
                                        )}
                                    </TableCell>
                                    {editingItemIndex === index ? (
                                        <>
                                            <TableCell component="th" scope="row" align="left" sx={{ width: '25%' }}>
                                                <TextField
                                                    value={editedItem.name}
                                                    placeholder='Name...'
                                                    onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                                                    fullWidth
                                                    className="custom-update-textfield"
                                                />
                                            </TableCell>
                                            <TableCell component="th" scope="row" align="left" sx={{ width: '35%' }}>
                                                <TextField
                                                    value={editedItem.description}
                                                    placeholder='Description...'
                                                    onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
                                                    fullWidth
                                                    className="custom-update-textfield"
                                                />
                                            </TableCell>
                                            <TableCell sx={{ width: '10%', textAlign: 'center' }}>
                                                <TextField
                                                    value={editedItem.quantity}
                                                    onChange={(e) => setEditedItem({ ...editedItem, quantity: parseFloat(e.target.value) })}
                                                    type="number"
                                                    fullWidth
                                                    className="custom-update-textfield"
                                                />
                                            </TableCell>
                                            <TableCell align="left" sx={{ width: '20%' }}>
                                                <Tooltip title="Save" placement="bottom">
                                                    <IconButton onClick={handleSaveEditedItem}>
                                                        <SaveIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Cancel" placement="bottom">
                                                    <IconButton onClick={handleCancelEdit}>
                                                        <CancelIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                {row.newlyAdded && (
                                                    <Tooltip title="Delete" placement="bottom">
                                                        <IconButton onClick={() => handleDeleteItem(index)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell align="left">{row.name}</TableCell>
                                            <TableCell align="left">{row.description}</TableCell>
                                            <TableCell align="left" sx={{ textAlign: 'center' }}>{row.quantity}</TableCell>
                                            <TableCell align="left">
                                                <Tooltip title="Edit" placement="bottom">
                                                    <IconButton onClick={() => handleEditClick(index)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))
                        }
                        {isAdding && (
                            <TableRow sx={{ backgroundColor: '#F5F7F8' }}>
                                <TableCell component="th" scope="row" align="left" sx={{ pl: '1.5rem !important', width: '10%' }}>
                                    {newItem.imageUrl ? (
                                        <div className="relative w-[5rem] h-[5rem]">
                                            <img className="w-full h-full object-cover rounded-[0.25rem]" src={newItem.imageUrl} alt={newItem.name} />
                                            <button onClick={() => setNewItem({ ...newItem, imageUrl: null })} className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-[0.25rem] opacity-0 hover:opacity-100 transition-opacity" title="Remove Image">
                                                <CancelIcon className="text-white" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center w-[5rem] h-[5rem] border-2 border-[#2F3645] border-dashed rounded-lg cursor-pointer bg-[#EAEAEA] hover:bg-[#EAEAEA]">
                                            <div className="flex items-center justify-center py-6 pb-6">
                                                <svg className="w-[3rem] h-[3rem] text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                </svg>
                                            </div>
                                            <input type="file" className="hidden" onChange={(e) => handleImageChange(e, false)} />
                                        </label>
                                    )}
                                </TableCell>
                                <TableCell component="th" scope="row" align="left" sx={{ width: '25%' }}>
                                    <TextField
                                        value={newItem.name}
                                        placeholder='Name...'
                                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                        fullWidth
                                        className="custom-update-textfield"
                                    />
                                </TableCell>
                                <TableCell component="th" scope="row" align="left" sx={{ width: '35%' }}>
                                    <TextField
                                        value={newItem.description}
                                        placeholder='Description...'
                                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                        fullWidth
                                        className="custom-update-textfield"
                                    />
                                </TableCell>
                                <TableCell sx={{ width: '10%', textAlign: 'center' }} align="left">
                                    <TextField
                                        value={newItem.quantity}
                                        onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                                        type="number"
                                        fullWidth
                                        className="custom-update-textfield"
                                    />
                                </TableCell>
                                <TableCell align="left" sx={{ width: '20%' }}>
                                    <Tooltip title="Save" placement="bottom">
                                        <IconButton onClick={handleSaveRewardItem}>
                                            <SaveIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Cancel" placement="bottom">
                                        <IconButton onClick={handleCancelRewardItem}>
                                            <CancelIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        )}
                        {!isAdding && (
                            <TableRow sx={{ backgroundColor: '#F0F1F1' }}>
                                <TableCell colSpan={5} align="center">
                                    <Button
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        onClick={handleAddClick}
                                        sx={{ borderColor: '#2F3645', color: '#2F3645', textTransform: 'none' }}
                                    >
                                        Add New Item
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default EditRewardItemTable;