export const projectForm = [
  {
    formTitle: "Fill up basic project information",
    formContent: [
      {
        contentSection: "Setup category",
        inputField: [
          {
            fieldTitle: "Project category*",
            fieldDescription:
              "Phân loại danh mục giúp những người ủng hộ dễ dàng tìm thấy và kết nối đến dự án của bạn.",
            inputField: [
              {
                placeHolder: "Category",
                inputType: "select",
              },
            ],
          },
        ],
      },
      {
        contentSection: "Project detail",
        inputField: [
          {
            fieldTitle: "Project name*",
            fieldDescription:
              "Provide an engaging and catchy name for your game project",
            inputField: [
              {
                placeHolder: "Enter project name...",
                inputType: "string",
              },
            ],
          },
          {
            fieldTitle: "Project description*",
            fieldDescription:
              "Provide a short brief description for your game project",
            inputField: [
              {
                placeHolder: "Project description...",
                inputType: "textarea",
              },
            ],
          },
          {
            fieldTitle: "Fundraising goal amount*",
            fieldDescription:
              "How much money would you like to raise for this campaign?",
            inputField: [
              {
                placeHolder: "Enter your fund goal...",
                inputType: "number",
                postFix: "VND",
              },
            ],
          },
          {
            fieldTitle: "Campaign duration*",
            fieldDescription:
              "How many days will you be running your campaign for?",
            inputField: [
              {
                placeHolder: "startDate",
                inputType: "datetime",
              },
              {
                placeHolder: "endDate",
                inputType: "datetime",
              },
            ],
          },
        ],
      },
    ],
  },
];
