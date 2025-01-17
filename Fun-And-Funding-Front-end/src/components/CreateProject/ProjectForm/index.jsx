import { useEffect, useRef } from "react";
import { Paper } from "@mui/material";
import { useForm } from "react-hook-form";
import FormDivider from "./Divider";
import FormField from "./FormField";

const ProjectForm = ({ formIndex, setFormIndex }) => {
  const formRef = useRef(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      categories: '',
      projectName: '',
      description: '',
      target: '',
      startDate: '',
      endDate: ''
    }
  });

  const fields = [fieldCategory, fieldProjectName, fieldProjectDescription, fieldProjectGoalAmount, fieldProjectDuration];

  const onSubmit = (data) => {
    console.log(data);
  };

  useEffect(() => {
    window.scrollTo({ top: formRef.current.offsetTop, behavior: 'smooth' });
  }, [formIndex]);


  return (
    <Paper ref={formRef} elevation={1} className="bg-white w-full overflow-hidden">
      <div className="bg-primary-green text-white flex justify-center h-[3rem] text-xl font-semibold items-center mb-8">
        Fill up basic info
      </div>

      <div className='px-5'>
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, index) => (
            <FormField
              key={index}
              field={field}
              register={register}
              errors={errors}
            />
          ))}

          <div className="flex justify-center gap-5">
            <button
              className={`inline-block bg-gray-500 text-white font-bold py-2 mb-4 rounded px-[2rem] ${formIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              type="button"
              onClick={() => setFormIndex(formIndex - 1)}
              disabled={formIndex === 0}
            >
              Back
            </button>
            <button
              className="inline-block bg-primary-green text-white font-bold py-2 mb-4 rounded px-[2rem]"
              type="submit"
            >
              Next
            </button>
          </div>
        </form>
      </div>


    </Paper>
  );
};

export default ProjectForm;
