import { ArrowForward, ArrowRight } from "@mui/icons-material"
import { Avatar, Divider, Grid2 } from "@mui/material"
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const NotificationCard = ({ notiData, listAll }) => {

  const token = Cookies.get("_auth")
  const decoded = jwtDecode(token)
  const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]


  const getNotificationLink = (type, id) => {
    switch (type) {
      case 0:
        return `/funding-detail/${id}`;
      case 1:
        return `/marketplace-detail/${id}`;
      case 2:
        return `/funding-detail/${id}`;
      case 3:
        return `/marketplace-detail/${id}`;
      case 4:
        return `/account/wallet/${id}`;
      case 5:
        return `/funding-detail/${id}`;
      case 6:
        return `/marketplace-detail/${id}`;
      default:
        return '#';
    }
  };


  return (
    <>
      {
        notiData
        &&
        (
          (listAll ? notiData : notiData.slice(0, 5)).map((noti, index) => {
            const userReadStatus = noti.userReadStatus[userId];
            const isUnread = userReadStatus === false;
            const notificationLink = getNotificationLink(noti.notificationType, noti.objectId);

            return (
              <div className={`${isUnread ? 'bg-gray-100' : 'bg-white'} relative z-[10]`}>
                <div key={index} className={` py-2 px-4 w-[100%] flex gap-3 items-start`}>
                  {/* {
                    isUnread
                      ? (
                        <div className="rounded-2xl bg-primary-green h-3 w-3 absolute right-3 top-3.5 animate-pulse"></div>
                      )
                      : ''
                  } */}
                  <Avatar alt="User avatar" src={noti.actor.avatar} sx={{ height: '2.5rem', width: '2.5rem', marginTop: '.2rem' }} />
                  <div className="message">
                    <a href={`/profile/${noti.actor._id}`} className="text-black font-bold text-sm hover:underline">@{noti.actor.UserName}</a><br />
                    <a href={notificationLink} target="_blank"
                      className="text-black text-sm whitespace-pre-line hover:underline" dangerouslySetInnerHTML={{ __html: noti.message }}></a><br />
                    <div className="text-gray-600 italic text-xs mt-2">
                      {new Date(noti.date).toLocaleString()}
                    </div>

                    {/* <div className="text-xs text-right">
                      <a href={notificationLink} target="_blank" className="text-gray-800 hover:text-blue-700 hover:underline">
                        View <ArrowForward sx={{ fontSize: '95%' }} />
                      </a>
                    </div> */}

                  </div>
                </div>

                <Divider />
              </div >
            )
          })
        )
      }
    </>
  )
}

export default NotificationCard