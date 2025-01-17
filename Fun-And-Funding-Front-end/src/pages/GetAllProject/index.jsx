import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Pagination,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import BrowseFundingCard from '../../components/BrowseFundingCard';
import categoryApiInstance from '../../utils/ApiInstance/categoryApiInstance';
import fundingProjectApiInstance from '../../utils/ApiInstance/fundingProjectApiInstance';
import './index.css';
const GetAllProject = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [statusList, setStatusList] = useState([2, 3, 4, 5,7]);
  const [searchValue, setSearchValue] = useState('');
  const [selectAll, setSelectAll] = useState(true);
  const [fromTarget, setFromTarget] = useState(0.0);
  const [projects, setProjects] = useState({
    items: [],
    totalPages: 1,
    pageIndex: 1
  });

  // Fetch categories
  const fetchCates = async () => {
    try {
      const res = await categoryApiInstance.get('/all');
      setCategories(res.data._data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch all projects
  const fetchAllProjects = async (searchValue, fromTarget, pageIndex, selectedCategories) => {
    try {
      const response = await fundingProjectApiInstance.get('/', {
        params: {
          searchValue,
          fromTarget,
          pageSize: 9,
          categoryIds: selectedCategories,
          pageIndex,
          statusList: statusList
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        }
      });
      if (response.data._statusCode) {
        setProjects({
          items: response.data._data.items,
          totalPages: response.data._data.totalPages,
          pageIndex: response.data._data.pageIndex
        });
      }

    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchCates();
    fetchAllProjects(searchValue, fromTarget, 1, selectedCategories);
  }, []);

  const handleRadioChange = (event) => {
    setFromTarget(event.target.value);
    fetchAllProjects(searchValue, event.target.value, 1, selectedCategories);
  };

  const handleCategoryChange = (event, categoryId) => {
    const { checked } = event.target;

    if (categoryId === "all") {
      setSelectAll(checked);
      setSelectedCategories([]);
      fetchAllProjects(searchValue, fromTarget, 1, []);
    } else {
      setSelectAll(false);
      const updatedCategories = checked
        ? [...selectedCategories, categoryId]
        : selectedCategories.filter((id) => id !== categoryId);

      setSelectedCategories(updatedCategories);
      fetchAllProjects(searchValue, fromTarget, 1, updatedCategories);
    }
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    fetchAllProjects(event.target.value, fromTarget, 1, selectedCategories);
  };

  return (
    <div>
      <div className='crowBanner flex flex-col justify-center items-center h-[20rem]' >
        <div className='py-[5rem]'>
          <div className='text-white flex justify-center items-center text-center leading-[6.5rem]'>
            <span className='font1 text-gray-200 text-[4rem]'>Funding Collection</span>
          </div>
          <div className='text-center font1 text-lg text-gray-300'>
            Explore projects, find your cause, and be a part of something extraordinary today! <br />
            without the wait!
          </div>
        </div>
      </div>
      <Box sx={{ marginTop: '5rem', mx: 'var(--side-margin)' }}>
        <Grid container spacing={2}>
          {/* Sidebar Filters */}
          <Grid item size={3}>
            <Box sx={{ textAlign: 'left' }}>
              <Typography className="!text-[1.5rem] !mb-[2rem] !font-[600]">
                Filter
              </Typography>

              {/* Category Filter */}
              <Box>
                <Typography variant='h1' className="!text-[1rem] !font-[600] !mb-[16px]">
                  Category
                </Typography>
                <Box>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectAll}
                          onChange={(e) => handleCategoryChange(e, "all")}
                          sx={{
                            '&.Mui-checked': {
                              color: 'var(--primary-green)',
                            },
                          }}
                        />
                      }
                      label="All"
                    />
                    {categories.map((item) => (
                      <FormControlLabel
                        key={item.id}
                        control={
                          <Checkbox
                            checked={selectedCategories.includes(item.id)}
                            onChange={(e) => handleCategoryChange(e, item.id)}
                            sx={{
                              '&.Mui-checked': {
                                color: 'var(--primary-green)',
                              },
                            }}
                          />
                        }
                        label={item.name}
                      />
                    ))}
                  </FormGroup>
                </Box>
              </Box>
              <div className='seperator'></div>

              {/* Target Amount Filter */}
              <Box mt={3}>
                <Typography className="!text-[1rem] !font-[600] !mb-[16px]">
                  Target Amount
                </Typography>
                <RadioGroup value={fromTarget} onChange={handleRadioChange}>
                  <FormControlLabel value="0" control={<Radio
                    sx={{
                      '&.Mui-checked': {
                        color: 'var(--primary-green)',
                      },
                    }}
                  />} label="All" />
                  <FormControlLabel value="5000" control={<Radio
                    sx={{
                      '&.Mui-checked': {
                        color: 'var(--primary-green)',
                      },
                    }}
                  />} label="More than 5,000 VND" />
                  <FormControlLabel value="500000" control={<Radio
                    sx={{
                      '&.Mui-checked': {
                        color: 'var(--primary-green)',
                      },
                    }}
                  />} label="More than 500,000 VND" />
                  <FormControlLabel value="50000000" control={<Radio
                    sx={{
                      '&.Mui-checked': {
                        color: 'var(--primary-green)',
                      },
                    }}
                  />} label="More than 50,000,000 VND" />
                </RadioGroup>
              </Box>
            </Box>
          </Grid>

          {/* Main Content */}
          <Grid item size={9}>
            {/* Search Bar */}
            <Box>
              <TextField
                fullWidth
                id="fullWidth"
                placeholder='Search for projects'
                value={searchValue}
                onChange={(e) => handleSearchChange(e)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaSearch />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Project List */}
            <Box sx={{ marginTop: '4rem' }}>
              <Grid container rowSpacing={3} columnSpacing={4}>
                {projects.items && projects.items.length > 0 ? (
                  projects.items.map((item, index) => (
                    <Grid item size={4} key={index}>
                      <BrowseFundingCard fundingProject={item} />
                    </Grid>
                  ))
                ) : (
                  <Typography variant="body1" className="text-[1rem]">
                    No funding project available
                  </Typography>
                )}
              </Grid>
            </Box>

            {/* Pagination */}
            <Pagination
              sx={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}
              count={projects.totalPages}
              page={projects.pageIndex}
              onChange={(e, page) => {
                setProjects(prevState => ({ ...prevState, pageIndex: page }));
                fetchAllProjects(searchValue, fromTarget, page);
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default GetAllProject;