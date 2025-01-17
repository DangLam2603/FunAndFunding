import ForumIcon from '@mui/icons-material/Forum';
import { TabContext, TabList } from "@mui/lab";
import { Badge, Box, Button, Grid2, Tab, Typography } from '@mui/material';
import Cookies from "js-cookie";
import React, { useEffect, useState } from 'react';
import { useLoading } from "../../contexts/LoadingContext";
import followApiInstance from "../../utils/ApiInstance/followApiInstance";
import likeApiInstance from "../../utils/ApiInstance/likeApiInstance";
import AccountFollower from './AccountFollower';
import AccountFollowing from './AccountFollowing';
import AccountFundingFollowing from './AccountFundingFollowing';
import AccountMarketplaceLiked from './AccountMarketplaceLiked';
import "./index.css";

function AccountSocial() {
    const { isLoading, setIsLoading } = useLoading();
    const token = Cookies.get("_auth");

    const [tabValue, setTabValue] = useState("1");
    const [followingUserCount, setFollowingUserCount] = useState(0);
    const [followingUserList, setFollowingUserList] = useState([]);
    const [followerCount, setFollowerCount] = useState(0);
    const [followerList, setFollowerList] = useState([]);
    const [followingFundingCount, setFollowingFundingCount] = useState(0);
    const [followingFundingList, setFollowingFundingList] = useState([]);
    const [likedMarketplaceCount, setLikedMarketplaceCount] = useState(0);
    const [likedMarketplaceList, setLikedMarketplaceList] = useState([]);

    useEffect(() => {
        try {
            setIsLoading(true);
            fetchFollowingUserList();
            fetchFollowerList();
            fetchFollowingFundingList();
            fetchLikedMarketplaceList();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    }, [token])

    const handleTabValue = (event, newValue) => {
        const validValues = ["1", "2", "3", "4"];
        setTabValue(validValues.includes(newValue) ? newValue : "1");
    };

    const fetchFollowingUserList = async () => {
        try {
            const res = await followApiInstance.get('number-of-following', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.data._statusCode === 200) {
                setFollowingUserCount(res.data._data.totalFollow);
                setFollowingUserList(res.data._data.users);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchFollowerList = async () => {
        try {
            const res = await followApiInstance.get('number-of-follower', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.data._statusCode === 200) {
                setFollowerCount(res.data._data.totalFollow);
                setFollowerList(res.data._data.users);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchFollowingFundingList = async () => {
        try {
            const res = await followApiInstance.get('number-of-funded-project-following', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.data._statusCode === 200) {
                setFollowingFundingCount(res.data._data.followCount);
                setFollowingFundingList(res.data._data.fundingProjectResponses);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchLikedMarketplaceList = async () => {
        try {
            const res = await likeApiInstance.get('number-of-marketplace-like', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.data._statusCode === 200) {
                console.log(res.data._data);
                setLikedMarketplaceCount(res.data._data.likeCount);
                setLikedMarketplaceList(res.data._data.marketplaceProjectResponses);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="pl-[4rem] pr-[5.5rem] mt-[2rem] mb-[4rem]">
            <div className='flex justify-between items-center'>
                <div className="flex justify-start gap-[1rem] items-start flex-col">
                    <h1 className="!text-[1.5rem] text-left font-bold text-[#2F3645]">
                        Your Message
                    </h1>
                    <Typography
                        sx={{
                            color: '#2F3645',
                            fontSize: '1rem',
                            fontWeight: '400',
                            userSelect: 'none',
                            width: '70%',
                        }}
                    >
                        Stay connected by managing your messages. View, reply to, or organize conversations with other backers.
                    </Typography>
                </div>
                <a href='/chat'>
                    <Badge
                        badgeContent={null}
                        color="error"
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        sx={{
                            "& .MuiBadge-badge": {
                                transform: "translate(50%, -50%)",
                            },
                        }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<ForumIcon />}
                            sx={{
                                color: "var(--white)",
                                backgroundColor: "var(--primary-green)",
                                textTransform: "none !important",
                                "&:active": {
                                    outline: "none !important",
                                },
                                "&:focus": {
                                    outline: "none !important",
                                },
                                ".MuiButton-startIcon": {
                                    marginRight: "12px",
                                },
                                width: "15rem",
                                fontSize: "1rem",
                                fontWeight: "600",
                            }}
                        >
                            See all messages
                        </Button>
                    </Badge>
                </a>
            </div>
            <TabContext value={tabValue}>
                <Box className="account-social-tab-context">
                    <Box>
                        <TabList
                            onChange={handleTabValue}
                            className="account-social-tablist"
                            sx={{
                                "& .MuiTabs-scroller": {
                                    display: "flex",
                                    justifyContent: "flex-start",
                                },
                            }}
                        >
                            <Tab
                                label={`Following Users (${followingUserCount})`}
                                className="account-social-tab"
                                value="1"
                            />
                            <Tab
                                label={`Followers (${followerCount})`}
                                className="account-social-tab"
                                value="2"
                            />
                            <Tab
                                label={`Following Funding Projects (${followingFundingCount})`}
                                className="account-social-tab"
                                value="3"
                            />
                            <Tab
                                label={`Liked Marketplace Projects (${likedMarketplaceCount})`}
                                className="account-social-tab"
                                value="4"
                            />
                        </TabList>
                        {tabValue === "1" && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "100%",
                                    marginTop: "2rem",
                                }}
                            >
                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: "1rem",
                                            fontWeight: "600",
                                            color: "var(--black)",
                                            mb: "2rem",
                                            textAlign: 'left'
                                        }}
                                    >
                                        Total followings: <span className='mr-[1rem]'></span>{followingUserCount} account{followingUserCount > 1 && 's'}
                                    </Typography>
                                    {followingUserList && followingUserList.length > 0 ?
                                        <Box>
                                            <Grid2 container columnSpacing={3} rowSpacing={3}>
                                                {followingUserList.map((item, index) => (
                                                    <Grid2 size={4} key={index}>
                                                        <AccountFollowing user={item} fetchFollowingUserList={fetchFollowingUserList} />
                                                    </Grid2>
                                                ))}
                                            </Grid2>
                                        </Box>
                                        :
                                        <Typography
                                            sx={{
                                                fontSize: "1rem",
                                                fontWeight: "600",
                                                color: "var(--black)",
                                                mb: "2rem",
                                                textAlign: 'center'
                                            }}
                                        >
                                            Nothing to show
                                        </Typography>
                                    }
                                </Box>
                            </Box>
                        )}
                        {tabValue === "2" && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "100%",
                                    marginTop: "2rem",
                                }}
                            >
                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: "1rem",
                                            fontWeight: "600",
                                            color: "var(--black)",
                                            mb: "2rem",
                                            textAlign: 'left'
                                        }}
                                    >
                                        Total followers: <span className='mr-[1rem]'></span>{followerCount} account{followerCount > 1 && 's'}
                                    </Typography>
                                    {followerList && followerList.length > 0 ?
                                        <Box>
                                            <Grid2 container columnSpacing={3} rowSpacing={3}>
                                                {followerList.map((item, index) => (
                                                    <Grid2 size={4} key={index}>
                                                        <AccountFollower user={item} fetchFollowerList={fetchFollowerList} />
                                                    </Grid2>
                                                ))}
                                            </Grid2>
                                        </Box> :
                                        <Typography
                                            sx={{
                                                fontSize: "1rem",
                                                fontWeight: "600",
                                                color: "var(--black)",
                                                mb: "2rem",
                                                textAlign: 'center'
                                            }}
                                        >
                                            Nothing to show
                                        </Typography>
                                    }
                                </Box>
                            </Box>
                        )}
                        {tabValue === "3" && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "100%",
                                    marginTop: "2rem",
                                }}
                            >
                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: "1rem",
                                            fontWeight: "600",
                                            color: "var(--black)",
                                            mb: "2rem",
                                            textAlign: 'left'
                                        }}
                                    >
                                        Total following funding projects: <span className='mr-[1rem]'></span>{followingFundingCount} project{followingFundingCount > 1 && 's'}
                                    </Typography>
                                    {followingFundingList && followingFundingList.length > 0 ?
                                        <Box>
                                            <Grid2 container rowSpacing={3}>
                                                {followingFundingList.map((item, index) => (
                                                    <Grid2 size={12} key={index}>
                                                        <AccountFundingFollowing project={item} fetchFollowingFundingList={fetchFollowingFundingList} />
                                                    </Grid2>
                                                ))}
                                            </Grid2>
                                        </Box> :
                                        <Typography
                                            sx={{
                                                fontSize: "1rem",
                                                fontWeight: "600",
                                                color: "var(--black)",
                                                mb: "2rem",
                                                textAlign: 'center'
                                            }}
                                        >
                                            Nothing to show
                                        </Typography>
                                    }
                                </Box>
                            </Box>
                        )}
                        {tabValue === "4" && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "100%",
                                    marginTop: "2rem",
                                }}
                            >
                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: "1rem",
                                            fontWeight: "600",
                                            color: "var(--black)",
                                            mb: "2rem",
                                            textAlign: 'left'
                                        }}
                                    >
                                        Total liked marketplace projects: <span className='mr-[1rem]'></span>{likedMarketplaceCount} projects
                                    </Typography>
                                    {likedMarketplaceList && likedMarketplaceList.length > 0 ?
                                        <Box>
                                            <Grid2 container rowSpacing={3}>
                                                {likedMarketplaceList.map((item, index) => (
                                                    <Grid2 size={12} key={index}>
                                                        <AccountMarketplaceLiked project={item} fetchLikedMarketplaceList={fetchLikedMarketplaceList} />
                                                    </Grid2>
                                                ))}
                                            </Grid2>
                                        </Box> :
                                        <Typography
                                            sx={{
                                                fontSize: "1rem",
                                                fontWeight: "600",
                                                color: "var(--black)",
                                                mb: "2rem",
                                                textAlign: 'center'
                                            }}
                                        >
                                            Nothing to show
                                        </Typography>
                                    }
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>
            </TabContext>
        </div>
    )
}

export default AccountSocial;
