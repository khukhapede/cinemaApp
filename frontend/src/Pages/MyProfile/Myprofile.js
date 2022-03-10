import React, { useState } from "react";

import Styles from "./Myprofile.module.css";

import TransCard from "../../components/TransCard/TransCard";

import { useQuery } from "react-query";

import { API } from "../../config/api";

export default function MyProfile() {
  let api = API();

  let { data: profData, isLoading: loadProfile } = useQuery(
    "profileCache",
    async () => {
      const config = {
        method: "GET",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };
      const response = await api.get("/user-data", config);

      return response.data;
    }
  );

  let { data: hisData, isLoading: LoadHis } = useQuery(
    "historyCache",
    async () => {
      const config = {
        method: "GET",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };
      const response = await api.get("/user-trans", config);

      return response.data;
    }
  );

  return (
    <div className={`${Styles.mainBody}`}>
      <div className={`${Styles.profileSec}`}>
        {loadProfile ? (
          <h3 className="text-center">
            <b>loading...</b>
          </h3>
        ) : (
          <>
            <div className={`${Styles.profileTitle}`}>my profile</div>
            <div className={`${Styles.profileData}`}>
              <div className={`${Styles.profilePhoto}`}>
                <img src={profData.image} alt="pp" />
              </div>
              <div className={`${Styles.profileDetail}`}>
                <div className={`${Styles.profileText}`}>
                  <div className={`${Styles.textTitle}`}>Full name</div>
                  <div>{profData.fullname}</div>
                </div>
                <div className={`${Styles.profileText}`}>
                  <div className={`${Styles.textTitle}`}>email</div>
                  <div>{profData.email}</div>
                </div>
                <div className={`${Styles.profileText}`}>
                  <div className={`${Styles.textTitle}`}>phone</div>
                  <div>{profData.phone}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className={`${Styles.historyTrans}`}>
        <div className={`${Styles.profileTitle}`}>History Transaction</div>
        <div className={`${Styles.transCard}`}>
          {LoadHis ? (
            <h3 className="text-center">
              <b>loading...</b>
            </h3>
          ) : (
            hisData.map((trans) => (
              <li key={trans.id}>
                <TransCard
                  title={trans.film.name}
                  date={trans.createdAt}
                  price={trans.film.price}
                  status={trans.status}
                />
              </li>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
