import ChecklistIcon from '@mui/icons-material/Checklist';
import { Button } from '@mui/material';
import React from 'react';
import Swal from 'sweetalert2';
import projectMilestoneApiInstace from '../../../utils/ApiInstance/projectMilestoneApiInstance';
const CompleteMilestoneButton = ({ submit, status, pmId, render }) => {
    const processing = 1;
    const submitted = 5;
    const warning = 3;
    const reSubmitted = 6;
    console.log(status)
    console.log(pmId)
    const submitMilestone = async () => {
        try {
            submit && await submit();
            await projectMilestoneApiInstace.put("/",
                { projectMilestoneId: pmId, status: status == 'edit' ? submitted : reSubmitted })
                .then(res => {
                    console.log(res.data);
                    Swal.fire({
                        icon: 'success',
                        title: 'Milestone submitted successfully',
                        showConfirmButton: false,
                        timer: 1500
                    })
                })
        } catch (error) {
            console.log(error);
            // Swal.fire({
            //     icon: 'error',
            //     title: error.response.data.message || 'Milestone submitted unsuccessfully',
            //     showConfirmButton: false,
            //     timer: 1500
            // })
        } finally {
            render()
        }
    }
    return (
        <>
            <Button
                disabled={!status === processing}
                variant="contained" component="label"
                onClick={submitMilestone}
                sx={{
                    backgroundColor: '#1BAA64', textTransform: 'none', fontWeight: '600', mt: '-1rem', mb: '2rem'
                }}
                startIcon={<ChecklistIcon />}
            >
                Complete Milestone
            </Button>

        </>
    )
}

export default CompleteMilestoneButton