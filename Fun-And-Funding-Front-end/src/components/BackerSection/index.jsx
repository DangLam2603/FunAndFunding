import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router";
const BackerSection = ({ backers }) => {
  const navigate = useNavigate()
  console.log(backers);
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const options = {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };
  return (
    <div>
      <div class="relative overflow-x-auto">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3 rounded-s-lg">
                Backer
              </th>
              <th scope="col" class="px-6 py-3">
                Total Donation Amount
              </th>
              <th scope="col" class="px-6 py-3">
                Package Name
              </th>
              <th scope="col" class="px-6 py-3 rounded-e-lg">
                Donate Date
              </th>
              {/* <th scope="col" class="px-6 py-3 rounded-e-lg">
                Price
              </th> */}
            </tr>
          </thead>
          <tbody>
            {backers.map((backer) => (
              <tr class="bg-white dark:bg-gray-800">
                <th
                  onClick={() => navigate(`/profile/${backer.id}`)}
                  scope="row" className="hover:cursor-pointer px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center gap-2">
                  <Avatar src={backer.url} sx={{ height: '2rem', width: '2rem' }} />
                  <span>
                    {backer.userName}
                  </span>
                </th>
                <td class="px-6 py-4">
                  {backer.donateAmount.toLocaleString("de-DE")} VND
                </td>
                <td class="px-6 py-4">
                  {backer.name}
                </td>
                <td class="px-6 py-4">
                  {formatDateTime(backer.createdDate)}
                </td>
                {/* <td class="px-6 py-4">
                  $2999
                </td> */}
              </tr>
            ))}

          </tbody>
        </table>
      </div>


      {/* <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ backgroundColor: "rgba(0, 0, 0, 0.1)", borderRadius: '1rem', overflow: 'hidden' }}>
          <TableRow>
            <TableCell></TableCell>
            <TableCell sx={{ color: "black" }} align="left">
              Backer's name
            </TableCell>
            <TableCell sx={{ color: "black" }} align="left">
              Total Donate Amount
            </TableCell>
          </TableRow>
        </TableHead>
        {backers.map((backer) => (
          <>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Avatar>{backer.url ? <img src={backer.url} /> : "H"}</Avatar>
                </TableCell>
                <TableCell align="left">{backer.name}</TableCell>
                <TableCell align="left">
                  {backer.donateAmount.toLocaleString("de-DE")} VND
                </TableCell>
              </TableRow>
            </TableBody>
          </>
        ))}
      </Table> */}
    </div>

  );
};

export default BackerSection;
