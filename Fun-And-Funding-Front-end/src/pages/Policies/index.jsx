import React, { useState } from 'react'
import { Typography, Box } from '@mui/material'
import './index.css'
import MilestonePolicyModal from '../../components/MilestonePolicyModal'
const Policies = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Terms of Use
      </Typography>
      <Box
        className='term-container'
      >
        {/* section 1  */}
        <Box id="section1">
          <Typography className='term-title'>
            Section 1. Welcome to Fun&Funding
          </Typography>
          <Box className='term-content'>
            <Typography sx={{ fontStyle: 'italic' }}>
              This page contains our Terms of Use. When you use Fun&Funding, you’re agreeing to all the rules below.
            </Typography>
            <Typography >
              By using this website (the “Site”)
              and any of the services (together
              with the Site, the “Services”) offered by
              Fun&Funding,
              you’re agreeing to these legally binding rules
              (the “Terms” or “Terms of Use”).
              You’re also agreeing to our
              <strong className='ml-1'>Backer Policy</strong> and <strong>OwnerPolicy</strong>,
              and agreeing to follow any other rules on the Site, including our Community Guidelines and rules for starting projects, which are incorporated in these Terms by reference. In addition to the Site, Services means services offered by Fun&Funding from time to time including, but not limited to, crowdfunding services
              and associated services made available to creators.
            </Typography>
          </Box>
        </Box>
        {/* section 2 */}
        <Box id="section2">
          <Typography className='term-title'>
            Section 2. Things You Definitely Should Do
          </Typography>
          <Box className='term-content'>
            <Typography sx={{ fontStyle: 'italic' }}>
              This section is a list of actions that are
              not allowed on our platform. We want to keep this a safe,
              positive place for everyone—kids, families, and game creators alike.
              Please follow these rules and help us maintain a respectful community.
              If these rules are broken, we may need to take action,
              including suspending or closing your account.
            </Typography>
            <ul className='p-2'>
              <li>
                <Typography>
                  <strong>Follow the law:</strong> Don’t do anything illegal or take actions
                  that could harm others or break promises you’ve made to them.
                </Typography>
              </li>
              <li>
                <Typography>
                  <strong>Be truthful:</strong> Don’t share information that is false, misleading, or inaccurate. Avoid doing anything deceptive or dishonest.
                </Typography>
              </li>
              <li>
                <Typography>
                  <strong>Don’t offer forbidden items or rewards: </strong>
                   Only offer rewards or items that are safe, appropriate for kids, and comply with our platform’s guidelines.
                </Typography>
              </li>
              <li>
                <Typography>
                  <strong>Follow the law: </strong> Don’t do anything illegal or take actions
                  that could harm others or break promises you’ve made to them.
                </Typography>
              </li>
              <li>
                <Typography>
                  <strong>Be respectful: </strong>
                   Don’t say or do anything threatening, hurtful, or invasive toward other people. Avoid language or behavior that could be seen as
                  harassing, offensive, or inappropriate.
                </Typography>
              </li>
              <li>
                <Typography>
                  <strong>Don’t harm others’ devices: </strong>
                   Avoid sharing harmful software, viruses, or code that could damage another person’s computer or device.
                </Typography>
              </li>
              <li>
                <Typography>
                  <strong>Respect others’ privacy: </strong>
                   If you receive information about backers (like names or email addresses), use it only to fulfill their rewards and treat their information with care. Don’t use this information for other purposes, and ensure any helpers you involve also follow these rules.
                </Typography>
              </li>
            </ul>
            <Typography>
              To keep our platform secure, please avoid the following:
            </Typography>
            <ul className='p-2'>
              <li>
                <Typography>
                  <strong>No tampering with the system: </strong>
                  Don’t interfere with the site’s functioning, try to bypass our security,
                  or try to access parts of the system that you shouldn’t.
                </Typography>
              </li>
              <li>
                <Typography>
                  <strong>Don’t overload our system: </strong>
                  Avoid actions that put too much strain on our platform or third-party providers. (We’ll determine what’s reasonable.)
                </Typography>
              </li>
              <li>
                <Typography>
                  <strong>No automated tools: </strong>
                  Avoid using bots, scripts, or automated tools to navigate or collect data from our platform.
                </Typography>
              </li>
              <li>
                <Typography>
                  <strong>Don’t reverse-engineer our platform:  </strong>
                  Don’t try to access our platform’s underlying code, ideas, or designs by taking it apart.
                </Typography>
              </li>
            </ul>
          </Box>
        </Box>
        {/* section 3 */}
        <Box id="section3">
          <Typography className='term-title'>
            Section 3. Owner Policies
          </Typography>
          <Box className='term-content'>
            <Typography sx={{ fontStyle: 'italic' }}>
              This section explains the relationship between project creators (owners) and backers on our platform, outlining each party's responsibilities. When you create or support a project,
              these are the terms you're agreeing to.
            </Typography>
            <Typography >
              Our platform provides a space for
              innovative kid-friendly game projects to
              secure funding and bring their ideas to life. When an owner (creator) posts a project, they're inviting others to support it, which creates a mutual agreement. By backing a project, supporters accept the owner's offer,
              forming a contract between the two parties.
            </Typography>
            <Typography >
              Our platform is not part of this
              contract—it is a direct agreement
              between owners and backers. If any additional
              terms are applied by a creator to their project, our platform's Terms take
              priority in case of conflict. Here’s how the relationship works:
            </Typography>
            <ol className='p-2'>
              <li>
                <Typography>
                  <strong>Commitment to Backers: </strong>
                  During a campaign, and especially
                  if the project is successfully funded,
                  owners are expected to maintain high standards,
                  communicate honestly, and stay dedicated to making their
                  project a reality. Backers understand that they’re not purchasing a finished product but helping to create something new. Every project is unique, and changes or delays may occur.
                  Completion of the project isn’t guaranteed.
                </Typography>
              </li>
              <li>
                <Typography>
                  <strong>Milestone-Based Funding Disbursement: </strong>
                  When a project reaches its funding goal,
                  funds will be released to the creator based on
                  project milestones rather than in a single payment.
                  This approach helps ensure backers' contributions are used as planned and allows progress to be tracked more closely. If an owner is unable to complete their project and fulfill rewards, they must make a
                  reasonable effort to conclude the project for backers.
                  <span className="ml-1 text-[#1BAA64] cursor-pointer text-[1.25srem]" onClick={handleOpen}>Milestones process here</span>
                </Typography>
                <MilestonePolicyModal open={open} handleClose={handleClose} />
              </li>
              <li>
                <Typography>
                  <strong>Owner Responsibility: </strong>
                  Owners are fully responsible for fulfilling their projects.
                  If they don’t meet these terms, backers may seek legal action.
                  Our platform reserves the right to take any necessary
                  steps regarding campaign funds if a dispute arises.
                </Typography>
              </li>
            </ol>
          </Box>
        </Box>
        {/* section 4 */}
        <Box id="section4">
          <Typography className='term-title'>
            Section 4. Backer Policies
          </Typography>
          <Box className='term-content'>
            <Typography sx={{ fontStyle: 'italic' }}>
              This section provides the details on how funding works for backers on our platform, including how donations are made, the types of donations available, and how rewards are handled.
            </Typography>
            <Typography >
              To donate to a project, you must first add funds to your
              platform wallet. This wallet allows you to easily make
              contributions to various projects without re-entering your payment information each time.
              Wallet funds can only be used on our platform and are non-refundable once added. Please ensure you intend to use these funds for donations before transferring them to your wallet.
            </Typography>
            <Typography sx={{ fontWeight: '800 !important' }}>
              Types of Donations
            </Typography>
            <Typography >
              There are two types of donations available on our platform, allowing you to support projects in different ways:
            </Typography>
            <ul className='p-2'>
              <li>
                <Typography>
                  <strong>Free Donation: </strong>
                  A free donation allows you to contribute any amount you
                  choose to a project. You simply enter the desired donation
                  amount, and it will be transferred from your wallet to the
                  project. Free donations do not come with specific
                  rewards but help bring the project closer to its goal.
                </Typography>
              </li>
              <li>
                <Typography>
                  <strong>Reward Package Donation: </strong>
                  Reward packages provide a structured way to contribute,
                  with set donation amounts tied to specific rewards. When you select a reward package, your wallet will be debited by the set amount, and you’ll receive the corresponding reward item once the project successfully completes.
                  Reward items are detailed in each package description, allowing you to choose the donation level and reward that best fits your interest.
                </Typography>
              </li>
            </ul>
            <Typography sx={{ fontWeight: '800 !important' }}>
              Terms for Donations
            </Typography>
            <Typography >
              The following terms apply to donations made during a project’s live campaign period:
            </Typography>
            <ul className='p-2'>
              <li>
                <Typography>
                  <strong>Donation Processing: </strong>
                  Funds are transferred immediately from your
                  wallet to the project when you make a donation.
                  There are no holds or delays in processing;
                  donations are deducted as soon as you confirm them.
                </Typography>
              </li>
              <li>
                <Typography>
                  <strong>Non-Refundable Donations: </strong>
                  Once funds are transferred from your wallet to a project, they are non-refundable, as they are immediately put toward helping the project reach its goals.
                  Please consider carefully before donating.
                </Typography>
              </li>
              <li>
                <Typography>
                  <strong>Changing or Canceling Donations: </strong>
                  Once you have made a donation, it cannot be canceled or adjusted. Since funds are transferred instantly,
                  modifications to donations are not permitted. Please ensure that you’ve selected the correct amount or reward package before confirming your donation.
                </Typography>
              </li>
            </ul>
          </Box>
        </Box>
        {/* section 5 */}
        <Box id="section5">
          <Typography className='term-title'>
            Section 5. What We Don’t Do and Aren’t Responsible For
          </Typography>
          <Box className='term-content'>
            <Typography sx={{ fontStyle: 'italic' }}>
              We do not monitor project performance, and we do not mediate disagreements between users.
            </Typography>
            <Typography >
              Our platform is not liable for any
              damages or losses that may result
              from your use of our services. We do not intervene
              in disputes between users or between users and any
              third parties related to activities on our platform.
              We do not oversee the progress, quality, or
              timeliness of projects, and we do not endorse any
              content that users submit to the platform.
              By using our services, you agree to release us
              from any claims, damages, or demands of any
              kind—whether known or unknown, suspected or unsuspected, disclosed or undisclosed—that arise from or relate to such disputes or the use of our services.
              All content you access through our platform is at your own risk, and you alone are responsible for any resulting damage or loss to yourself or others.
            </Typography>
          </Box>
        </Box>
        {/* section 6 */}
        <Box id="section6">
          <Typography className="term-title">
            Section 6. Policies for Project Promotion and Support
          </Typography>
          <Box className="term-content">
            <Typography sx={{ fontStyle: 'italic' }}>
              Projects that successfully secure funding may be promoted on our marketplace, subject to the conditions outlined below.
            </Typography>
            <Box
              sx={{
                p: 2, // Padding
                mb: 3, // Margin bottom
                borderLeft: "5px solid #1BAA64", // Green left border for emphasis
                bgcolor: "#f5f5f5", // Light gray background
                borderRadius: "5px", // Rounded corners
              }}
            >
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ color: "#1BAA64" }} // Green text for emphasis
              >
                Important for Marketplace:
              </Typography>
              <Typography variant="body2" sx={{ color: "text.primary", mt: 1 }}>
                Our platform is designed specifically to support game projects developed using Unity. To ensure compatibility and consistency, developers must integrate our Unity package into their games. This package provides essential functionalities and allows for seamless verification of digital keys and other platform-specific requirements.
              </Typography>
            </Box>
            <Typography>
              Developers are encouraged to create and manage their own promotional campaigns, including the addition of custom coupons, which can be used to attract and retain players. The platform facilitates these campaigns but does not manage or oversee them on behalf of developers.
            </Typography>
            <Typography>
              By participating in our marketplace, you acknowledge and agree to the following:
            </Typography>
            <Typography sx={{ paddingLeft: '16px' }}>
              - Our platform does not guarantee the success of your project or the performance of your game on the marketplace. <br />
              - We do not intervene in disputes between users, developers, or third parties related to activities on the platform. <br />
              - We are not responsible for monitoring project quality, progress, or timeliness. <br />
              - You are solely responsible for the content you submit and for ensuring compliance with all applicable laws and regulations.
            </Typography>
            <Typography>
              By using our services, you release us from any claims, damages, or demands of any kind—whether known or unknown—that arise from disputes, promotional activities, or the use of our platform. Access to all content on our platform is at your own risk, and you bear full responsibility for any resulting damages or losses.
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Policies