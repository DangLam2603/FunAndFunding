import { Rating } from "@mui/material"
import { useProjectMilestoneBackerApi } from "../../../utils/Hooks/ProjectMilestoneBacker"

const ProjectMilestoneReviewList = ({ pmId }) => {

  const { data, error } = useProjectMilestoneBackerApi(`/?projectMilestoneId=${pmId}`)


  return (
    <>

      {
        data && data._data.length === 0 ? (
          <p className="text-center text-gray-500">No reviews yet.</p>
        ) : (
          data && data._data.map((value, index) => (
            <article key={index} className="p-6 text-base bg-white rounded-lg border">
              <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div>
                    <p className="inline-flex items-center mr-2 text-sm text-gray-900 font-semibold">
                      <img
                        className="mr-2 w-6 h-6 rounded-full"
                        src={value.backer.avatar || "https://i.ibb.co/pZbTH0B/user.png"}
                        alt="User avatar" />
                      {value.backer.userName}
                      <span className="bg-primary-green text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded ml-2">Backer</span>
                    </p>
                    <p className="text-xs text-gray-600 ml-8"><time pubdate>{new Date(value.createdDate).toLocaleString()}</time></p>
                  </div>

                </div>

                <div
                  className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50"
                  type="button">
                  <Rating
                    value={value.star}
                    readOnly
                    size="small"
                  />
                </div>
              </footer>
              <p className="text-gray-500">
                {value.comment}
              </p>
            </article>
          ))
        )
      }
    </>

  )
}

export default ProjectMilestoneReviewList