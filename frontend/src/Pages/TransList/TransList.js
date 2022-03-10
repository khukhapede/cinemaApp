import React from "react";

import { Table, Button } from "react-bootstrap";

import useDropdownMenu from "react-accessible-dropdown-menu-hook";

import Styles from "./TransList.module.css";

import { useQuery, useMutation } from "react-query";

import ShowMoreText from "react-show-more-text";

import { API } from "../../config/api";
import { tab } from "@testing-library/user-event/dist/tab";

export default function TransList() {
  const { buttonProps, itemProps, isOpen } = useDropdownMenu(2);
  let api = API();

  let {
    data: tableData,
    isLoading,
    refetch,
  } = useQuery("tableCache", async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: "Basic " + localStorage.token,
      },
    };
    const response = await api.get("/get-trans", config);

    return response.data;
  });

  const updateStat = useMutation(async (statData) => {
    try {
      let body = JSON.stringify(statData);
      const config = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + localStorage.token,
        },
        body: body,
      };

      const response = await api.patch("/update-trans", config);

      if (response.status === "success") {
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
  });
  return (
    <div className={Styles.mainBody}>
      <div className={Styles.title}>incoming transaction</div>
      <div>
        {isLoading ? (
          <h3 className="text-center">Loading ...</h3>
        ) : tableData?.length !== 0 ? (
          <Table
            className={Styles.table}
            striped
            hover
            size="lg"
            variant="dark"
          >
            <thead style={{ color: "red" }}>
              <tr>
                <th width="1%" className="text-center">
                  No
                </th>
                <th>Users</th>
                <th>Bukti Transfer</th>
                <th>film</th>
                <th>number account</th>
                <th>status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, index) => (
                <tr key={item.id}>
                  <td className="align-middle text-center">{index + 1}</td>
                  <td className="align-middle">{item.buyer.fullname}</td>
                  <td className="align-middle">
                    <ShowMoreText
                      /* Default options */
                      lines={1}
                      more="show"
                      less="hide"
                      className="content-css"
                      anchorClass="my-anchor-css-class"
                      expanded={false}
                      width={280}
                    >
                      {item.receipt}
                    </ShowMoreText>
                  </td>
                  <td className="align-middle">{item.film.name}</td>
                  <td className="align-middle">{item.numAccount}</td>
                  <td className="align-middle">
                    {(() => {
                      if (item.status === "pending") {
                        return (
                          <div className={Styles.pendingStat}>pending</div>
                        );
                      } else if (item.status === "finished") {
                        return (
                          <div className={Styles.approveStat}>approve</div>
                        );
                      } else if (item.status === "cancel") {
                        return <div className={Styles.cancelStat}>cancel</div>;
                      }
                    })()}
                  </td>
                  <td className="align-middle">
                    {item.status === "pending" && (
                      <>
                        <div
                          className={Styles.approve}
                          onClick={() => {
                            updateStat.mutate({
                              id: item.id,
                              status: "finished",
                            });
                          }}
                        >
                          Approve
                        </div>

                        <div
                          className={Styles.cancel}
                          onClick={() => {
                            updateStat.mutate({
                              id: item.id,
                              status: "cancel",
                            });
                          }}
                        >
                          Cancel
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <h3>belum ada transaksi</h3>
        )}
      </div>
    </div>
  );
}
