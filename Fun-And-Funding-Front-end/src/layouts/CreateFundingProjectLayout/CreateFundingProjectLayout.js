export const steps = [
  {
    label: 'Basic information',
    description: `Provide basic information about your project along with fundraising goal.`,
  },
  {
    label: 'Introduction',
    description:
      'Share and introduce the story behind the project.',
  },
  {
    label: 'Project media',
    description: `Provide dynamic images and videos for your project.`,
  },
  {
    label: 'Verify your bank account',
    description: `Set up your bank account as a withdrawal source.`,
  },
  {
    label: 'Project packages',
    description: `Set up your donate packages with corresponding rewards.`,
  },
];

export const stepStyle = (active, completed) => ({
  backgroundColor: active ? "white" : completed ? "var(--primary-green)" : "rgba(0, 0, 0, 0.1)",
  "& .MuiStepLabel-iconContainer svg": { color: active ? "var(--primary-green)" : completed ? "white" : "rgba(0, 0, 0, 0.2)" },
  "& .MuiStepLabel-label": { color: active ? "black" : completed ? "white" : "rgba(0, 0, 0, 0.3)" },
  "& .MuiStepContent-root": { color: active ? "rgba(0, 0, 0, 0.5)" : completed ? "white" : "rgba(0, 0, 0, 0.1)" },
});

// create project api params
const requestBody = {
  "categories" : [
    {"id" : ""}
  ],
  "name": "string",
  "description": "string",
  "introduction": "string",
  "startDate": "2024-09-26T02:37:32.825Z",
  "endDate": "2024-09-26T02:37:32.825Z",
  "target": 0.01,
  "balance": 0,
  "bankAccount": {
    "bankNumber": "string",
    "bankCode": "string"
  },
  "packages": [
    {
      "name": "string",
      "description": "string",
      "requiredAmount": 0,
      "limitQuantity": 0,
      "packageTypes": 0,
      "rewardItems": [
        {
          "name": "string",
          "description": "string",
          "quantity": 0,
          "imageFile": "string"
        }
      ]
    }
  ],
  "fundingFiles": [
    {
      "name": "string",
      "url": "string",
      "filetype": 0
    }
  ],
  "email": "string"
}