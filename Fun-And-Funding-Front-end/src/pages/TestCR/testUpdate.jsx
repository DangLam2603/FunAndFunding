import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

const TestUpdate = ({projectId}) => {
    const [projectData, setProjectData] = useState({
        id: '',
        name: '',
        description: '',
        introduction: '',
        startDate: '',
        endDate: '',
        target: 0,
        balance: 0,
        bankAccount: { BankNumber: '', BankCode: '' },
        packages: [
            {
                id: '',
                name: '',
                requiredAmount: 0,
                limitQuantity: 0,
                rewardItems: [{id : '', name: '', description: '', quantity: 0, imageFile: null }],
            },
        ],
    });

    const [files, setFiles] = useState([]);

    // Fetch project data for updating
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const { data } = await axios.get(`https://localhost:7044/api/funding-projects/${projectId}`);
                setProjectData(data._data);
            } catch (error) {
                console.error('Error fetching project:', error);
            }
        };

        fetchProject();
    }, [projectId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProjectData({
            ...projectData,
            [name]: value,
        });
    };

    const handlePackageChange = (e, packageIndex, rewardIndex = null) => {
        const { name, value } = e.target;
        const updatedPackages = [...projectData.packages];

        if (rewardIndex === null) {
            updatedPackages[packageIndex][name] = value;
        } else {
            updatedPackages[packageIndex].rewardItems[rewardIndex][name] = value;
        }

        setProjectData({ ...projectData, packages: updatedPackages });
    };

    const handleRewardFileChange = (e, packageIndex, rewardIndex) => {
        const file = e.target.files[0];
        const updatedPackages = [...projectData.packages];
        updatedPackages[packageIndex].rewardItems[rewardIndex].imageFile = file;
        setProjectData({ ...projectData, packages: updatedPackages });
    };

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('Id', projectId);
        formData.append('Name', projectData.name);
        formData.append('Description', projectData.description);
        formData.append('Introduction', projectData.introduction);
        formData.append('StartDate', projectData.startDate);
        formData.append('EndDate', projectData.endDate);
        formData.append('Target', projectData.target);
        formData.append('Balance', projectData.balance);

        // Append Bank Account information
        formData.append('BankAccount.BankNumber', projectData.bankAccount.BankNumber);
        formData.append('BankAccount.BankCode', projectData.bankAccount.BankCode);

        // Append packages and reward items
        projectData.packages.forEach((packageData, index) => {
            if (packageData.id) {
                formData.append(`Packages[${index}].Id`, packageData.id);
            }
            formData.append(`Packages[${index}].Name`, packageData.name);
            formData.append(`Packages[${index}].RequiredAmount`, packageData.requiredAmount);
            formData.append(`Packages[${index}].Description`, packageData.description);
            formData.append(`Packages[${index}].LimitQuantity`, packageData.limitQuantity);

            packageData.rewardItems.forEach((reward, rewardIndex) => {
                if (reward.id) {
                    formData.append(`Packages[${index}].RewardItems[${rewardIndex}].Id`, reward.id);
                }
                formData.append(`Packages[${index}].RewardItems[${rewardIndex}].Name`, reward.name);
                formData.append(`Packages[${index}].RewardItems[${rewardIndex}].Description`, reward.description);
                formData.append(`Packages[${index}].RewardItems[${rewardIndex}].Quantity`, reward.quantity);
                if (reward.imageFile) {
                    formData.append(`Packages[${index}].RewardItems[${rewardIndex}].ImageFile`, reward.imageFile);
                }
            });
        });

        // Add new files (if any)
        for (let i = 0; i < files.length; i++) {
            formData.append(`FundingFiles[${i}].Name`, files[i].name);
            formData.append(`FundingFiles[${i}].URL`, files[i]); // Actual file
            formData.append(`FundingFiles[${i}].Filetype`, 0); // Example file type
        }

        try {
            const response = await axios.put(`https://localhost:7044/api/funding-projects/${projectId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Project updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '200px' }}>
            <input type="text" name="name" value={projectData.name} onChange={handleInputChange} placeholder="Project Name" />
            <input type="text" name="description" value={projectData.description} onChange={handleInputChange} placeholder="Description" />
            <input type="number" name="target" value={projectData.target} onChange={handleInputChange} placeholder="Target" />
            <label>Start Date</label>
            <input type="date" name="startDate" value={projectData.startDate} onChange={handleInputChange} />
            <label>End Date</label>
            <input type="date" name="endDate" value={projectData.endDate} onChange={handleInputChange} />

            <input type="file" multiple onChange={handleFileChange} />

            {projectData.packages.map((pkg, packageIndex) => (
                <div key={packageIndex}>
                    <h3>Package {packageIndex + 1}</h3>
                    <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) => handlePackageChange(e, packageIndex)}
                        name="name"
                        placeholder="Package Name"
                    />
                    <input
                        type="text"
                        value={pkg.description}
                        onChange={(e) => handlePackageChange(e, packageIndex)}
                        name="description"
                        placeholder="Package Description"
                    />
                    <input
                        type="number"
                        value={pkg.requiredAmount}
                        onChange={(e) => handlePackageChange(e, packageIndex)}
                        name="requiredAmount"
                        placeholder="Required Amount"
                    />
                    <input
                        type="number"
                        value={pkg.limitQuantity}
                        onChange={(e) => handlePackageChange(e, packageIndex)}
                        name="limitQuantity"
                        placeholder="Limit Quantity"
                    />
                    {pkg.rewardItems.map((reward, rewardIndex) => (
                        <div key={rewardIndex}>
                            <h4>Reward {rewardIndex + 1}</h4>
                            <input
                                type="text"
                                value={reward.name}
                                onChange={(e) => handlePackageChange(e, packageIndex, rewardIndex)}
                                name="name"
                                placeholder="Reward Name"
                            />
                            <input type="file" onChange={(e) => handleRewardFileChange(e, packageIndex, rewardIndex)} />
                        </div>
                    ))}
                </div>
            ))}

            <button type="submit">Update Project</button>
        </form>
    );
}

export default TestUpdate
