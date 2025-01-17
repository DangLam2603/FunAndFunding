export const steps = [
  {
    label: "Basic Information",
    description: `Provide basic information about your game along with the price.`,
  },
  {
    label: "Introduction",
    description: "Share and introduce your game.",
  },
  {
    label: "Media Files",
    description: `Provide dynamic images and videos about your game.`,
  },
  {
    label: "Bank Account",
    description: `Set up your bank account as a withdrawal source.`,
  },
  {
    label: "Game Content",
    description: `Upload your game file for public download.`,
  },
];

export const stepStyle = (active, completed) => ({
  backgroundColor: active
    ? "white"
    : completed
    ? "var(--primary-green)"
    : "rgba(0, 0, 0, 0.1)",
  "& .MuiStepLabel-iconContainer svg": {
    color: active
      ? "var(--primary-green)"
      : completed
      ? "white"
      : "rgba(0, 0, 0, 0.2)",
  },
  "& .MuiStepLabel-label": {
    color: active ? "black" : completed ? "white" : "rgba(0, 0, 0, 0.3)",
  },
  "& .MuiStepContent-root": {
    color: active
      ? "rgba(0, 0, 0, 0.5)"
      : completed
      ? "white"
      : "rgba(0, 0, 0, 0.1)",
  },
});
