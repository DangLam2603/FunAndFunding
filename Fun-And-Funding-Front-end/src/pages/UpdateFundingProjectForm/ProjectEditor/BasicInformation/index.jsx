import { Box, Button, Divider, FormControl, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import QuillEditor from "../../../../components/UpdateProject/QuillEditor";
import ProjectContext from '../../../../layouts/UpdateFundingProjectLayout/UpdateFundingProjectContext';
import './index.css';

function BasicInformation() {
    const { id } = useParams();
    const { project, setProject, setIsEdited, setIsLoading, setLoadingStatus } = useContext(ProjectContext);

    const [categories, setCategories] = useState([]);
    const [basicInfoEdited, setBasicInfoEdited] = useState(false);

    const [name, setName] = useState(project.name || '');
    const [description, setDescription] = useState(project.description || '');
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [intro, setIntro] = useState(null);

    useEffect(() => {
        setName(project.name);
        setDescription(project.description);
        setIntro(project.introduction);
        if (project.categories && Array.isArray(project.categories)) {
            const categoryNames = project.categories.map(category => category.name);
            setSelectedCategory(categoryNames);
        }
    }, [id, project]);

    const handleChangeName = (event) => {
        const updatedName = event.target.value;
        setName(updatedName);
        checkIfEdited(updatedName, description, intro);
    };

    const handleChangeDescription = (event) => {
        const updatedDescription = event.target.value;
        setDescription(updatedDescription);
        checkIfEdited(name, updatedDescription, intro);
    };

    const handleChangeIntroduction = (newIntro) => {
        console.log(newIntro);
        const updatedIntro = newIntro;
        setIntro(updatedIntro);
        checkIfEdited(name, description, updatedIntro);
    };

    const checkIfEdited = (updatedName, updatedDescription, updatedIntro) => {
        if (updatedName == null || updatedName.trim().length === 0 || updatedDescription == null || updatedDescription.trim().length === 0
            || updatedIntro == null || updatedIntro.trim().length === 0) {
            setBasicInfoEdited(false);
        }
        else if (
            updatedName !== project.name ||
            updatedDescription !== project.description || updatedIntro !== project.introduction

        ) {
            setBasicInfoEdited(true);
        } else {
            setBasicInfoEdited(false);
        }
    };

    const handleSaveAll = async () => {
        setIsLoading(true);
        setLoadingStatus(2);
        const updatedProject = {
            ...project,
            name: name,
            description: description,
            introduction: intro,
        };
        setProject(updatedProject);
        setIsEdited(true);
        setBasicInfoEdited(false);
        setIsLoading(false);
        setLoadingStatus(0);
    };

    const handleDiscardAll = async () => {
        setName(project.name || '');
        setDescription(project.description || '');
        setIntro(project.introduction || '');
        setBasicInfoEdited(false);
    };

    return (
        <div className='w-full pb-[3rem]'>
            <div className='basic-info-section !mb-[2rem]'>
                <Typography
                    sx={{
                        color: '#2F3645',
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        userSelect: 'none',
                        width: '70%',
                        marginBottom: '1rem'
                    }}
                >
                    Basic Information
                </Typography>
                <Typography
                    sx={{
                        color: '#2F3645',
                        fontSize: '1rem',
                        fontWeight: '400',
                        userSelect: 'none',
                        width: '70%',
                    }}
                >
                    Create a strong first impression by introducing your campaign's goals and sparking interest.
                    This essential information will appear on your campaign page, campaign card, and in search results, helping people easily discover and learn more about your campaign.
                </Typography>
            </div>
            <div className='basic-info-section'>
                <Typography
                    className='basic-info-title'
                    sx={{ width: '70%', }}
                >
                    Project Name<span className='text-[#1BAA64]'>*</span>
                </Typography>
                <Typography
                    className='basic-info-subtitle'
                    sx={{ width: '70%', }}
                >
                    What is the title of your project?
                </Typography>
                <TextField
                    placeholder="Project name..."
                    className="custom-update-textfield"
                    variant="outlined"
                    required
                    value={name}
                    error={!name || name.trim().length === 0}
                    helperText={!name || name.trim().length === 0 ? "Project Name cannot be null" : ""}
                    onChange={handleChangeName}
                />
            </div>
            <div className='basic-info-section'>
                <Typography
                    className='basic-info-title'
                    sx={{ width: '70%', }}
                >
                    Project Description<span className='text-[#1BAA64]'>*</span>
                </Typography>
                <Typography
                    className='basic-info-subtitle'
                    sx={{ width: '70%', }}
                >
                    Provide a short description that best describes your campaign to your audience.
                </Typography>
                <TextField
                    placeholder='Project description...'
                    className="custom-update-textfield"
                    rows={4}
                    multiline
                    variant="outlined"
                    required={true}
                    value={description}
                    error={!description || description.trim().length === 0}
                    helperText={!description || description.trim().length === 0 ? "Project Description cannot be null" : ""}
                    onChange={handleChangeDescription}
                />
            </div>
            <div className='basic-info-section !mb-[2rem]'>
                <Typography
                    className='basic-info-title'
                    sx={{ width: '70%', }}
                >
                    Project Category<span className='text-[#1BAA64]'>*</span>
                </Typography>
                <Typography
                    className='basic-info-subtitle'
                    sx={{ width: '70%', }}
                >
                    This field <span className='font-bold'>CANNOT</span> be changed.
                </Typography>
                <FormControl sx={{ width: '70%' }} variant="outlined">
                    <Select
                        multiple
                        disabled
                        value={selectedCategory}
                        renderValue={(selected) => {
                            if (selected.length === 0) {
                                return <span style={{ color: '#989a9a' }}>Project category...</span>;
                            }
                            return selected.join(', ');
                        }}
                    >
                        <MenuItem value='' disabled sx={{ color: '#989a9a' }}>
                            Project category...
                        </MenuItem>
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <Box className='basic-info-section'>
                <div className='w-[70%]'>
                    <Divider sx={{ border: '1px solid #EAEAEA', borderRadius: '0.625rem' }} />
                </div>
            </Box>
            <div className='basic-info-section'>
                <Typography
                    className='basic-info-title'
                    sx={{ width: '70%', }}
                >
                    Project Introduction<span className='text-[#1BAA64]'>*</span>
                </Typography>
                <Typography
                    className='basic-info-subtitle'
                    sx={{ width: '70%', }}
                >
                    Share and introduce the story behind the project.
                </Typography>
                <Typography
                    sx={{ color: '#d9534f', fontWeight: '500', display: intro != null && intro.trim().length !== 0 ? 'none' : 'block' }}
                >
                    Project Introduction cannot be null
                </Typography>
                <QuillEditor introductionData={intro} setIntroductionData={handleChangeIntroduction} />
            </div>
            <div className='basic-info-section !mb-0'>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '70%', gap: '1rem' }}>
                    <Button variant='outlined' color='error' disabled={!basicInfoEdited} sx={{ backgroundColor: 'transparent', textTransform: 'none' }} onClick={() => handleDiscardAll()}>
                        Discard
                    </Button>
                    <Button variant='contained' disabled={!basicInfoEdited} sx={{ backgroundColor: '#1BAA64', textTransform: 'none' }} onClick={() => handleSaveAll()}>
                        Save
                    </Button>
                </Box>
            </div>
        </div>
    )
}

export default BasicInformation