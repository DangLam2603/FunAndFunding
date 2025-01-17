import { Divider } from "@mui/material"

const FormDivider = ({ title, subtitle }) => {

  return (
    <>
      <Divider className="font-bold text-black/65">{title}</Divider>
    </>
  )
}

export default FormDivider