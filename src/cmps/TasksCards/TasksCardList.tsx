import React from 'react';
import { Grid } from '@mui/material';
import { TasksCardPreview } from './TasksCardPreview';


interface TasksCardListProps {
    readonly tasks: any[];
    readonly onStart: (taskId: number, userId: number) => void;
}

export const TasksCardList: React.FC<TasksCardListProps> = ({ tasks, onStart }) => {
    return (

        //         <motion.div
        //   className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
        //   initial="hidden"
        //   animate="visible"
        // >
        //   {tasks.map((task, index) => (
        //     <TasksCardPreview key={task.campaignID} task={task}  onStart={onStart} />
        //   ))}
        // </motion.div>

        <Grid container spacing={3} sx={{ padding: 2 }}>
            {tasks.map((task) => (
                <Grid item xs={12} sm={8} md={4} lg={3} key={task.ticketID}>
                    <TasksCardPreview task={task} onStart={onStart} />
                </Grid>
            ))}
        </Grid>
    );
};
