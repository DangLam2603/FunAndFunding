import { useEffect, useState } from "react";
import { useLoading } from "../../contexts/LoadingContext";
import Cookies from "js-cookie";
import fundingProjectApiInstace from "../../utils/ApiInstance/fundingProjectApiInstance";
import marketplaceProjectApiInstace from "../../utils/ApiInstance/marketplaceProjectApiInstance";
import { useNavigate } from "react-router";
import { Avatar, AvatarGroup } from "@mui/material";

const GameOwnerWallet = () => {
  const token = Cookies.get("_auth");
  const navigate = useNavigate()

  const { isLoading, setIsLoading } = useLoading()
  const [searchOwnerFundingProject, setSearchOwnerFundingProject] = useState('');
  const [searchOwnerMarketplaceProject, setSearchOwnerMarketplaceProject] = useState('');

  const [gameOwnerFundingProject, setGameOwnerFundingProject] = useState([]);
  const [gameOwnerMarketplaceProject, setGameOwnerMarketplaceProject] = useState([]);


  const fetchGameOwnerFundingProject = async (searchOwnerFundingProject) => {
    try {
      const res = await fundingProjectApiInstace.get(`/game-owner-projects`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          pageSize: 999999,
          pageIndex: 1,
        }
      });
      if (res.data._statusCode == 200) {
        setGameOwnerFundingProject(res.data._data.items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGameOwnerMarketplaceProject = async (searchOwnerMarketplaceProject) => {
    try {
      const res = await marketplaceProjectApiInstace.get(`/game-owner-projects`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          pageSize: 999999,
          pageIndex: 1,
        }
      });
      if (res.data._statusCode == 200) {
        setGameOwnerMarketplaceProject(res.data._data.items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchGameOwnerMarketplaceProject(searchOwnerMarketplaceProject);
    fetchGameOwnerFundingProject(searchOwnerFundingProject);
    setIsLoading(false);
  }, [searchOwnerMarketplaceProject]);


  return (
    <>
      <div className="flex gap-4">
        <div class="w-3/6 p-6 bg-white border border-gray-200 rounded-lg shadow">
          <div className="flex justify-between">
            <div className="mb-3 font-semibold text-gray-500">Funding Projects</div>
            <div>
              <AvatarGroup sx={{ "& .MuiAvatar-root": { width: "1.5rem", height: "1.5rem", fontSize: ".8rem" } }} max={4}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
                <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
              </AvatarGroup>
            </div>
          </div>
          <p className="h-[3.5rem]">
            <h5 class="mb-2 py-1 text-3xl font-bold tracking-tight text-gray-900">
              {/* {data?._data.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} <span class="mb-3 text-lg font-normal text-gray-700">VND</span> */}
              N/A VND
            </h5>
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/account/projects")}
              href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-primary-green rounded-lg hover:bg-primary-green/80">
              Manage
            </button>
          </div>

        </div>

        <div class="w-3/6 p-6 bg-white border border-gray-200 rounded-lg shadow">
          <span class="mb-3 font-semibold text-gray-500">Marketplace Projects</span>
          <div className="h-[3.5rem] flex items-center w-[100%]">
            <h5 class="mb-2 py-1 text-3xl font-bold tracking-tight text-gray-900">
              N/A VND
            </h5>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setOpenBankSetting(true)}
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-primary-green rounded-lg hover:bg-primary-green/80">
              Manage
            </button>
          </div>

        </div>
      </div>

      <div class="w-full min-h-[25rem] mt-[1rem] p-6 bg-white border border-gray-200 rounded-lg shadow">
        <span class="mb-3 font-semibold text-gray-500">Transactions History</span>
        <div class="relative overflow-x-auto mt-[1rem]">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-3 py-3">
                  Type
                </th>
                <th scope="col" class="px-3 py-3">
                  Description
                </th>
                <th scope="col" class="px-3 py-3">
                  Amount
                </th>
                <th scope="col" class="px-3 py-3">
                  Time span
                </th>
                {/* <th scope="col" class="px-3 py-3">
                Type
              </th> */}
                <th scope="col" class="px-3 py-3">
                  {/* Action */}
                </th>
              </tr>
            </thead>
            <tbody>
              {
                // data?._data.transactions.map((value, index) => (
                //   <tr key={index} class="bg-white border-b">
                //     <th class="px-3 py-4">
                //       {transactionTypeString[value.transactionType]}
                //     </th>
                //     <td class="px-3 py-4">
                //       {value.description}
                //     </td>
                //     <td class="px-3 py-4">
                //       {value.totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} đ
                //     </td>
                //     <td class="px-3 py-4">
                //       {new Date(value.createdDate).toLocaleString()}
                //     </td>
                //     <td class="px-3 py-4">
                //       <button>View</button>
                //     </td>
                //   </tr>
                // ))
              }


            </tbody>
          </table>
        </div>
      </div>

      {/* <WalletModal openModal={openModal} modalAddMoney={modalAddMoney} handleCloseModal={handleCloseModal} walletId={data?._data.id} />

      <BankAccountSettingModal openModal={openBankSetting} setOpenModal={setOpenBankSetting} walletId={data?._data.id} /> */}

      {/* <TestNotification />

    <NotificationMenu /> */}

    </>
  )
}

export default GameOwnerWallet