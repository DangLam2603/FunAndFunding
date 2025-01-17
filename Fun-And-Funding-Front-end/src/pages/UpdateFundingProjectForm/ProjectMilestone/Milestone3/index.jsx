import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import TaskColumn from '../../../../components/Kanban/TaskColumn';
import TaskForm from '../../../../components/Kanban/TaskForm';
import BackdropRequestMilestone from '../../../../components/UpdateProject/BackdropRequestMilestone';
import CompleteMilestoneButton from '../../../../components/UpdateProject/CompleteMilestoneButton';
import milestoneApiInstace from '../../../../utils/ApiInstance/milestoneApiInstance';
import { checkAvailableMilestone } from "../../../../utils/Hooks/checkAvailableMilestone";
import './index.css';

function Milestone3() {
    const { id } = useParams(); // Get the project ID from the URL
    console.log(id);
    const projectId = id;
    const location = useLocation();
    const milestoneId = location.state?.milestoneId;
    console.log(milestoneId);
    const [tasks, setTasks] = useState([]);
    const [activeCard, setActiveCard] = useState(null);
    const [milestoneData, setMilestoneData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [milestone, setMilestone] = useState(null);
    const [isBackdropHidden, setIsBackdropHidden] = useState(false);
    //get fixed milestone
    const fetchFixedMilestone = async () => {
        try {
            await milestoneApiInstace.get(`/${milestoneId}?filter=1`).then(response => {
                setMilestone(response.data.result._data);
                console.log(response.data)
            });

        } catch (error) {
            console.error("Error fetching milestone:", error);
        }
    }
    //check available project milestone
    const getMilestoneData = async (id) => {
        setIsLoading(true); // Start loading when data fetch begins
        try {
            const data = await checkAvailableMilestone(projectId, id);
            setMilestoneData(data); // Set data after fetching
            console.log(data);

            if (data.status === 'create' || data.status === 'edit' || data.status === 'warning') {
                setIsBackdropHidden(false)
                setTasks(data.data[0].projectMilestoneRequirements)
            }
            else {
                if (data.status == 'submitted' || data.status == 'completed') {
                    setTasks(data.data[0].projectMilestoneRequirements)
                }
                console.log("a")
                setIsBackdropHidden(true)
            }
            console.log(tasks)
        } catch (error) {
            console.error('Error fetching milestone data:', error);
        } finally {
            setIsLoading(false); // Stop loading once data fetch is complete
        }
    };

    // Handler to close Backdrop
    const handleBackdropClose = () => {
        setIsBackdropHidden(false);
    };
    //fetch milestoneData
    useEffect(() => {
        getMilestoneData(milestoneId);
        fetchFixedMilestone();
    }, []);

    const handleDelete = (taskIndex) => {
        const newTasks = tasks.filter((task, index) => index !== taskIndex);
        setTasks(newTasks);
    };
    console.log(isBackdropHidden)

    //generate form data
    const generateFormData = (task) => {
        const data = new FormData();
        data.append(`request[0].Id`, task.id);
        data.append(`request[0].RequirementStatus`, task.requirementStatus);
        data.append(`request[0].UpdateDate`, task.updateDate || new Date().toISOString());
        data.append(`request[0].Content`, task.content);

        // Add new files if they exist
        if (task.addedFiles) {
            task.addedFiles.forEach((fileObj, index) => {
                data.append(`request[0].AddedFiles[${index}].URL`, fileObj.file);
                data.append(`request[0].AddedFiles[${index}].Name`, fileObj.file.name);
                data.append(`request[0].AddedFiles[${index}].Filetype`, fileObj.fileType);
            });
        }

        // Add existing requirement files
        if (task.requirementFiles) {
            task.requirementFiles.forEach((file, fileIndex) => {
                data.append(`request[0].RequirementFiles[${fileIndex}].Id`, file.id);
                data.append(`request[0].RequirementFiles[${fileIndex}].URL`, file.url);
                data.append(`request[0].RequirementFiles[${fileIndex}].Name`, file.name);
                data.append(`request[0].RequirementFiles[${fileIndex}].IsDeleted`, file.IsDeleted || false);
            });
        }

        return data;
    };
    // drop card
    const handleDropCard = (newStatus, newPosition) => {
        if (activeCard == null) return;
        // Get a copy of the tasks array
        const updatedTasks = [...tasks];
        const draggedTask = updatedTasks[activeCard];
        console.log(draggedTask);
        // If dropping within the same status, just reorder
        if (draggedTask.requirementStatus === newStatus) {
            // Remove dragged task from its original position
            updatedTasks.splice(activeCard, 1);

            // Insert it in the new position within the same status
            updatedTasks.splice(newPosition, 0, draggedTask);
        } else {
            // If changing status, update the status and position
            draggedTask.requirementStatus = newStatus;

            // Remove from original position and insert at the new position in the target column
            updatedTasks.splice(activeCard, 1);
            updatedTasks.splice(newPosition, 0, draggedTask);
        }

        setTasks(updatedTasks);
        var data = generateFormData(draggedTask);
        handleUpdateTask(data);
        setActiveCard(null);
    };
    //handle add task
    const handleAddTask = async (data) => {
        try {
            await axios.post("https://localhost:7044/api/project-milestone-requirements", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            getMilestoneData(milestoneId); // Re-fetch the Kanban board data after adding a task
        } catch (error) {
            console.error("Error adding task:", error);
            Swal.fire({
                title: "Error",
                text: error.response.data.message,
                icon: "error"
            });
        }
    };
    //handle update task
    const handleUpdateTask = async (data) => {
        try {
            setIsLoading(true);
            await axios.put("https://localhost:7044/api/project-milestone-requirements", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            getMilestoneData(milestoneId); // Re-fetch the Kanban board data after adding a task

        } catch (error) {
            console.error("Error adding task:", error);
        } finally {
            setIsLoading(false);
        }
    };


    const [value, setValue] = React.useState('1');
    const [issueLog, setIssueLog] = useState("");
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    if (!milestone || !milestoneData || !tasks) return <p>Loading milestone...</p>;
    console.log(isLoading)
    return (
        <>
            {milestoneData && milestone && !isLoading
                && <BackdropRequestMilestone
                    isHidden={isBackdropHidden}
                    projectId={projectId}
                    milestone={milestone}
                    status={milestoneData.status}
                    onCloseBackdrop={handleBackdropClose}
                    render={() => getMilestoneData(milestoneId)} />}
            <div className='basic-info-section'>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '5rem' }}>
                    <Box>
                        <Typography
                            sx={{
                                color: '#2F3645',
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                userSelect: 'none',
                                marginBottom: '1rem'
                            }}
                        >
                            {milestone.milestoneName} <span className='text-[#1BAA64]'>*</span>
                        </Typography>
                        <Typography
                            sx={{
                                color: '#2F3645',
                                fontSize: '1rem',
                                fontWeight: '400',
                                userSelect: 'none',
                            }}
                        >
                            {milestone.description}
                        </Typography>
                    </Box>
                    <Box>
                        <CompleteMilestoneButton render={() => getMilestoneData(milestoneId)} status={milestoneData.status} pmId={(milestoneData.status == 'edit' || milestoneData.status == 'warning') && milestoneData.data[0].id} />
                    </Box>
                </Box>
                <Box>
                    {milestoneData.status === 'create' && milestone ? (
                        milestone.requirements.map((req) => (
                            <React.Fragment key={req.id}>
                                <Typography sx={{ fontWeight: 600 }}>
                                    {req.description} <span className='text-[#1BAA64]'>*</span>
                                </Typography>
                                <TaskForm
                                    onAddTask={handleAddTask}
                                    projectId={projectId}
                                    milestoneId={milestoneId}
                                    requirementId={req.id}
                                />
                                <Grid container spacing={2}>
                                    <Grid size={4} className="app_main">
                                        <TaskColumn
                                            className='task-column'
                                            title="To-do"
                                            tasks={tasks}
                                            status={0}
                                            handleDelete={handleDelete}
                                            setActiveCard={setActiveCard}
                                            onDrop={handleDropCard}
                                            updateTask={handleUpdateTask}
                                        />
                                    </Grid>
                                    <Grid size={4}>
                                        <TaskColumn
                                            title="Doing"
                                            tasks={tasks}
                                            status={1}
                                            handleDelete={handleDelete}
                                            setActiveCard={setActiveCard}
                                            onDrop={handleDropCard}
                                            updateTask={handleUpdateTask}
                                        />
                                    </Grid>
                                    <Grid size={4}>
                                        <TaskColumn
                                            title="Done"
                                            tasks={tasks}
                                            status={2}
                                            handleDelete={handleDelete}
                                            setActiveCard={setActiveCard}
                                            onDrop={handleDropCard}
                                            updateTask={handleUpdateTask}
                                        />
                                    </Grid>
                                </Grid>
                            </React.Fragment>
                        ))
                    ) : (
                        milestoneData.data && (
                            <React.Fragment>
                                <Typography sx={{ fontWeight: 600 }}>
                                    <span className='text-[#1BAA64]'>*</span>
                                </Typography>
                                <TaskForm
                                    onAddTask={handleAddTask}
                                    projectId={projectId}
                                    milestoneId={milestoneId}
                                    requirementId={
                                        milestoneData.data &&
                                        milestoneData.data.length > 0 &&
                                        milestoneData.data[0].projectMilestoneRequirements[0].requirementId}
                                />
                                {/* Render task data for other statuses */}
                                <Grid container spacing={2}>
                                    <Grid size={4} className="app_main">
                                        <TaskColumn
                                            className='task-column'
                                            title="To-do"
                                            tasks={tasks}
                                            status={0}
                                            handleDelete={handleDelete}
                                            setActiveCard={setActiveCard}
                                            onDrop={handleDropCard}
                                            updateTask={handleUpdateTask}
                                        />
                                    </Grid>
                                    <Grid size={4}>
                                        <TaskColumn
                                            title="Doing"
                                            tasks={tasks}
                                            status={1}
                                            handleDelete={handleDelete}
                                            setActiveCard={setActiveCard}
                                            onDrop={handleDropCard}
                                            updateTask={handleUpdateTask}
                                        />
                                    </Grid>
                                    <Grid size={4}>
                                        <TaskColumn
                                            title="Done"
                                            tasks={tasks}
                                            status={2}
                                            handleDelete={handleDelete}
                                            setActiveCard={setActiveCard}
                                            onDrop={handleDropCard}
                                            updateTask={handleUpdateTask}
                                        />
                                    </Grid>
                                </Grid>
                            </React.Fragment>
                        )
                    )}
                </Box>

            </div >
        </>

    );
}

export default Milestone3