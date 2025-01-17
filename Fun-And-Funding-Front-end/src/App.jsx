/* eslint-disable no-unused-vars */
import "@fontsource/poppins";
import "@fontsource/poppins/300-italic.css";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import { Backdrop, CircularProgress } from "@mui/material";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import FunFundingAppBar from "./components/AppBar";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./contexts/CartContext";
import { ChatProvider } from "./contexts/ChatContext";
import { CreateMarketplaceProjectProvider } from "./contexts/CreateMarketplaceProjectContext";
import { useLoading } from "./contexts/LoadingContext";
import { UpdateMarketplaceProjectProvider } from "./contexts/UpdateMarketplaceProjectContext";
import "./index.css";
import AboutUsLayout from "./layouts/AboutUsLayout";
import AdminDashboardLayout from "./layouts/AdminDashboardLayout";
import ChatLayout from "./layouts/ChatLayout";
import CreateFundingProjectLayout from "./layouts/CreateFundingProjectLayout";
import CreateMarketplaceProjectLayout from "./layouts/CreateMarketplaceProjectLayout";
import PublicProfileLayout from "./layouts/ProfileLayout/PublicProfileLayout";
import UserProfileLayout from "./layouts/ProfileLayout/UserProfileLayout";
import UpdateFundingProjectLayout from "./layouts/UpdateFundingProjectLayout";
import UpdateMarketplaceProjectLayout from "./layouts/UpdateMarketplaceProjectLayout";
import UserLayout from "./layouts/UserLayout";
import AboutUs from "./pages/AboutUs";
import AccountProfile from "./pages/AccountProfile";
import AccountProject from "./pages/AccountProject";
import AccountSocial from "./pages/AccountSocial";
import AccountWallet from "./pages/AccountWallet";
import AdminFundingProject from "./pages/AdminPages/AdminFundingProject";
import AdminMarketplaceProject from "./pages/AdminPages/AdminMarketplaceProject";
import AdminMilestone from "./pages/AdminPages/AdminMilestone";
import AdminReport from "./pages/AdminPages/AdminReport";
import AdminUsers from "./pages/AdminPages/AdminUser";
import Dashboard from "./pages/AdminPages/Dashboard";
import ManageCategory from "./pages/AdminPages/ManageCategory";
import AdminWithdrawRequest from "./pages/AdminWithdrawRequest";
import Chat from "./pages/Chat";
import CheckoutCart from "./pages/CheckoutCart";
import CheckoutSuccess from "./pages/CheckoutCart/CheckoutSuccess";
import CommissionFee from "./pages/CommissionFee";
import BasicInfo from "./pages/CreateFundingProjectForm/BasicInfo";
import ChoosePlan from "./pages/CreateFundingProjectForm/ChoosePlan";
import Introduction from "./pages/CreateFundingProjectForm/Introduction";
import ProjectMedia from "./pages/CreateFundingProjectForm/ProjectMedia";
import SetupBankAccount from "./pages/CreateFundingProjectForm/SetupBankAccount";
import SetupDonatePackage from "./pages/CreateFundingProjectForm/SetupDonatePackage";
import MarketplaceProjectBasicInfo from "./pages/CreateMarketplaceProjectForm/MarketplaceProjectBasicInfo";
import MarketplaceProjectGameContent from "./pages/CreateMarketplaceProjectForm/MarketplaceProjectGameContent";
import MarketplaceProjectIntroduction from "./pages/CreateMarketplaceProjectForm/MarketplaceProjectIntroduction";
import MarketplaceProjectMedia from "./pages/CreateMarketplaceProjectForm/MarketplaceProjectMedia";
import MarketplaceProjectSetupBankAccount from "./pages/CreateMarketplaceProjectForm/MarketplaceProjectSetupBankAccount";
import GetAllProject from "./pages/GetAllProject";
import HomePage from "./pages/HomePage";
import MarketplaceHomePage from "./pages/MarketplaceHomePage";
import MarketplaceProjectDetail from "./pages/MarketplaceProjectDetail";
import Milestones from "./pages/Milestones";
import MyOrder from "./pages/MyOrder";
import PageError from "./pages/PageError";
import Policies from "./pages/Policies";
import ProjectDetail from "./pages/ProjectDetail";
import PublicProfile from "./pages/PublicProfile";
import BankAccount from "./pages/UpdateFundingProjectForm/ProjectEditor/BankAccount";
import BasicInformation from "./pages/UpdateFundingProjectForm/ProjectEditor/BasicInformation";
import DonationPackages from "./pages/UpdateFundingProjectForm/ProjectEditor/DonationPackages";
import Media from "./pages/UpdateFundingProjectForm/ProjectEditor/Media";
import Milestone1 from "./pages/UpdateFundingProjectForm/ProjectMilestone/Milestone1";
import Milestone2 from "./pages/UpdateFundingProjectForm/ProjectMilestone/Milestone2";
import Milestone3 from "./pages/UpdateFundingProjectForm/ProjectMilestone/Milestone3";
import Milestone4 from "./pages/UpdateFundingProjectForm/ProjectMilestone/Milestone4";
import MilestoneOverview from "./pages/UpdateFundingProjectForm/ProjectMilestone/MilestoneOverview";
import ProjectPreview from "./pages/UpdateFundingProjectForm/ProjectPreview";
import MarketplaceProjectBankAccount from "./pages/UpdateMarketplaceProjectForm/MarketplaceProjectBankAccount";
import MarketplaceProjectBasicInformation from "./pages/UpdateMarketplaceProjectForm/MarketplaceProjectBasicInformation";
import MarketplaceProjectContent from "./pages/UpdateMarketplaceProjectForm/MarketplaceProjectContent";
import MarketplaceProjectCoupon from "./pages/UpdateMarketplaceProjectForm/MarketplaceProjectCoupon";
import MarketplaceProjectMediaFiles from "./pages/UpdateMarketplaceProjectForm/MarketplaceProjectMedia";
import MarketplaceProjectPreview from "./pages/UpdateMarketplaceProjectForm/MarketplaceProjectPreview";

function App() {
  const location = useLocation();
  const hideAppBar = location.pathname.includes("admin-dashboard");

  const { isLoading, setIsLoading } = useLoading();

  return (
    <>
      <Backdrop
        sx={(theme) => ({
          color: "var(--white)",
          zIndex: theme.zIndex.drawer + 1,
        })}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* <ToastContainer /> */}
      <CartProvider>
        <ChatProvider>
          {!hideAppBar && <FunFundingAppBar />}
          <>
            <Routes>
              {/* Guest, Game Owner, Backer, Admin */}
              <Route path="*" element={<Navigate to="/error" />} />
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/error" element={<PageError />} />
              <Route element={<UserLayout />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/marketplace" element={<MarketplaceHomePage />} />
                <Route
                  path="/marketplace-detail/:id"
                  element={<MarketplaceProjectDetail />}
                />
                <Route path="/funding" element={<GetAllProject />} />
                <Route path="/funding-detail/:id" element={<ProjectDetail />} />
              </Route>
              <Route element={<AboutUsLayout />}>
                <Route path="/policies" element={<Policies />} />
              </Route>
              <Route element={<PublicProfileLayout />}>
                <Route path="/profile/:id" element={<PublicProfile />} />
              </Route>
              {/* Game Owner, Backer */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={["GameOwner, Backer"]} />
                }
              >
                <Route element={<ChatLayout />}>
                  <Route path="/chat/:receiverId?" element={<Chat />} />
                </Route>
                <Route element={<UserProfileLayout />}>
                  <Route path="/account/profile" element={<AccountProfile />} />
                  <Route path="/account/projects" element={<AccountProject />} />
                  <Route path="/account/social" element={<AccountSocial />} />
                  <Route element={<ProtectedRoute allowedRoles={["Backer"]} />}>
                    <Route path="/account/wallet" element={<AccountWallet />} />
                    <Route path="/account/orders" element={<MyOrder />} />
                  </Route>
                </Route>
                {/* Backer */}
                <Route element={<ProtectedRoute allowedRoles={["Backer"]} />}>
                  <Route element={<UserLayout />}>
                    <Route path="/checkout-cart" element={<CheckoutCart />} />
                    <Route
                      path="/checkout-success/:id"
                      element={<CheckoutSuccess />}
                    />
                  </Route>
                </Route>
                {/* Game Owner */}
                <Route
                  element={<ProtectedRoute allowedRoles={["GameOwner"]} />}
                >
                  <Route path="choose-project-plan" element={<ChoosePlan />} />
                  <Route element={<CreateFundingProjectLayout />}>
                    <Route
                      path="request-funding-project/basic-info"
                      element={<BasicInfo />}
                    />
                    <Route
                      path="request-funding-project/introduction"
                      element={<Introduction />}
                    />
                    <Route
                      path="request-funding-project/project-media"
                      element={<ProjectMedia />}
                    />
                    <Route
                      path="request-funding-project/setup-bank-account"
                      element={<SetupBankAccount />}
                    />
                    <Route
                      path="request-funding-project/setup-donate-package"
                      element={<SetupDonatePackage />}
                    />
                  </Route>
                  <Route element={<UpdateFundingProjectLayout />}>
                    <Route
                      path="/account/projects/update/:id/preview"
                      element={<ProjectPreview />}
                    />
                    <Route
                      path="/account/projects/update/:id/basic-info"
                      element={<BasicInformation />}
                    />
                    <Route
                      path="/account/projects/update/:id/bank-account"
                      element={<BankAccount />}
                    />
                    <Route
                      path="/account/projects/update/:id/donation-packages"
                      element={<DonationPackages />}
                    />
                    <Route
                      path="/account/projects/update/:id/media-files"
                      element={<Media />}
                    />
                    <Route
                      path="/account/projects/update/:id/milestone-overview"
                      element={<MilestoneOverview />}
                    />
                    <Route
                      path="/account/projects/update/:id/milestone1"
                      element={<Milestone1 />}
                    />
                    <Route
                      path="/account/projects/update/:id/milestone2"
                      element={<Milestone2 />}
                    />
                    <Route
                      path="/account/projects/update/:id/milestone3"
                      element={<Milestone3 />}
                    />
                    <Route
                      path="/account/projects/update/:id/milestone4"
                      element={<Milestone4 />}
                    />
                  </Route>
                  <Route
                    element={
                      <UpdateMarketplaceProjectProvider>
                        <UpdateMarketplaceProjectLayout />
                      </UpdateMarketplaceProjectProvider>
                    }
                  >
                    <Route
                      path="/account/marketplace-projects/update/:id/preview"
                      element={<MarketplaceProjectPreview />}
                    />
                    <Route
                      path="/account/marketplace-projects/update/:id/basic-info"
                      element={<MarketplaceProjectBasicInformation />}
                    />
                    <Route
                      path="/account/marketplace-projects/update/:id/bank-account"
                      element={<MarketplaceProjectBankAccount />}
                    />
                    <Route
                      path="/account/marketplace-projects/update/:id/game-content"
                      element={<MarketplaceProjectContent />}
                    />
                    <Route
                      path="/account/marketplace-projects/update/:id/media-files"
                      element={<MarketplaceProjectMediaFiles />}
                    />
                    <Route
                      path="/account/marketplace-projects/update/:id/coupons"
                      element={<MarketplaceProjectCoupon />}
                    />
                  </Route>
                  <Route
                    element={
                      <CreateMarketplaceProjectProvider>
                        <CreateMarketplaceProjectLayout />
                      </CreateMarketplaceProjectProvider>
                    }
                  >
                    <Route
                      path="/request-marketplace-project/:id/basic-info"
                      element={<MarketplaceProjectBasicInfo />}
                    />
                    <Route
                      path="/request-marketplace-project/:id/introduction"
                      element={<MarketplaceProjectIntroduction />}
                    />
                    <Route
                      path="request-marketplace-project/:id/project-media"
                      element={<MarketplaceProjectMedia />}
                    />
                    <Route
                      path="request-marketplace-project/:id/bank-account"
                      element={<MarketplaceProjectSetupBankAccount />}
                    />
                    <Route
                      path="request-marketplace-project/:id/game-content"
                      element={<MarketplaceProjectGameContent />}
                    />
                  </Route>
                </Route>
              </Route>
              {/* Admin */}
              <Route
                element={<ProtectedRoute allowedRoles={["Administrator"]} />}
              >
                <Route element={<AdminDashboardLayout />}>
                  <Route
                    path="/admin-dashboard/dashboard"
                    element={<Dashboard />}
                  />
                  <Route
                    path="/admin-dashboard/users"
                    element={<AdminUsers />}
                  />
                  <Route
                    path="/admin-dashboard/funding-projects"
                    element={<AdminFundingProject />}
                  />
                  <Route
                    path="/admin-dashboard/marketplace-projects"
                    element={<AdminMarketplaceProject />}
                  />
                  <Route
                    path="/admin-dashboard/categories"
                    element={<ManageCategory />}
                  />
                  <Route
                    path="/admin-dashboard/withdraw-table"
                    element={<AdminWithdrawRequest />}
                  />
                  <Route
                    path="/admin-dashboard/milestones"
                    element={<Milestones />}
                  />
                  <Route
                    path="/admin-dashboard/milestone-request"
                    element={<AdminMilestone />}
                  />
                  <Route
                    path="/admin-dashboard/commission"
                    element={<CommissionFee />}
                  />
                  <Route
                    path="/admin-dashboard/report"
                    element={<AdminReport />}
                  />
                </Route>
                <Route element={<UserLayout />}>
                  <Route
                    path="/marketplace-detail/:id"
                    element={<MarketplaceProjectDetail />}
                  />
                  <Route
                    path="/funding-detail/:id"
                    element={<ProjectDetail />}
                  />
                </Route>
              </Route>
            </Routes>
          </>
        </ChatProvider>
      </CartProvider>
    </>
  );
}

export default App;
