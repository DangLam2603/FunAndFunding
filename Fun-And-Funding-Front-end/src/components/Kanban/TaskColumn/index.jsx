import React,{useState} from "react";
import "./index.css";
import TaskCard from "../TaskCard";
import DropItem from "../DropItem";
import { Box } from "@mui/material";
const TaskColumn = ({ title, icon, tasks, status, handleDelete, setActiveCard, onDrop, updateTask }) => {

    return (
        <section className='task_column'>
            <h2 className='task_column_heading'>
                {title}
            </h2>
            <DropItem onDrop={() => onDrop(status, 0)} />
            <Box className='task_column_body'>         
                {tasks.map(
                    (task, index) =>
                        task.requirementStatus === status && (
                            <React.Fragment key={index}>
                                <TaskCard
                                    key={index}
                                    title={task.content}
                                    handleDelete={handleDelete}
                                    index={index}
                                    setActiveCard={setActiveCard}
                                    task={tasks[index]}
                                    updateTask={updateTask}
                                />
                                <DropItem onDrop={() => onDrop(status, index + 1)} />
                            </React.Fragment>
                        )
                )}
            </Box>

        </section>
    );
};

export default TaskColumn;
