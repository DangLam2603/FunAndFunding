import { useEffect, useState } from "react"
import QuillEditor from "../../../components/CreateProject/QuillEditor"
import { useNavigate, useOutletContext } from "react-router"
import { Paper } from "@mui/material"
import FormDivider from "../../../components/CreateProject/ProjectForm/Divider"
import NavigateButton from "../../../components/CreateProject/ProjectForm/NavigateButton"

const Introduction = () => {

  const { setFormIndex, setProjectData, projectData } = useOutletContext()
  const navigate = useNavigate()

  const [introductionData, setIntroductionData] = useState(projectData.introduction || '')

  useEffect(() => {
    setProjectData((prev) => ({
      ...prev,
      'introduction': introductionData
    }))

    const handleBeforeUnload = (event) => {
      event.returnValue = "you sure?"
      console.log(event.returnValue)
      return "you sure?";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return (() => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    })

  }, [introductionData])

  useEffect(() => {
    setFormIndex(1)
  }, [])

  return (
    <>
      <Paper elevation={1} className="bg-white w-full overflow-hidden h-[35rem]">
        <div className="bg-primary-green text-white flex justify-center h-[3rem] text-xl font-semibold items-center mb-4">
          Project story
        </div>
        <div className='px-5'>
          <FormDivider title={'Project introduction'} />
        </div>
        <div className='text-sm text-black/50 text-center my-1'>Tell us about the full story behind your project</div>

        <QuillEditor introductionData={introductionData} setIntroductionData={setIntroductionData} />

        <div className="flex justify-center gap-5 my-10">
          <NavigateButton text={'Back'} onClick={() => { navigate('/request-funding-project/basic-info') }} />
          <NavigateButton text={'Next'} disabled={introductionData == ''} onClick={() => { navigate('/request-funding-project/project-media') }} />
        </div>
      </Paper>

    </>
  )
}

export default Introduction