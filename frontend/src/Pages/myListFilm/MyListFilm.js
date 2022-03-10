import React, { useState } from "react";

import Styles from "./MyListFilm.module.css";

import { useQuery } from "react-query";

import { useNavigate } from "react-router-dom";

import { API } from "../../config/api";

export default function MyList() {
  let api = API();
  let navigate = useNavigate();

  function movDet(id) {
    navigate("/movie-detail/" + id);
  }

  let { data: filmList, isLoading: loadList } = useQuery(
    "filmListCache",
    async () => {
      const config = {
        method: "GET",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };
      const response = await api.get("/film-list", config);

      return response.data;
    }
  );
  return (
    <div className={`${Styles.mainBody}`}>
      <div className={`${Styles.pageTitle}`}>
        <h2>My List Film </h2>
      </div>

      <div className={`${Styles.filmList}`}>
        <div className={`${Styles.movCardList}`}>
          {loadList ? (
            <h3 className="text-center">
              <b>loading...</b>
            </h3>
          ) : (
            <>
              {filmList.map((mov) => (
                <li key={mov.id}>
                  {mov.film[0].status === "cancel" ? (
                    <img
                      src={mov.poster}
                      alt="gambar"
                      className={`${Styles.cancelCard}`}
                      onClick={() => movDet(mov.id)}
                    ></img>
                  ) : (
                    <img
                      src={mov.poster}
                      alt="gambar"
                      className={`${Styles.movCard}`}
                      onClick={() => movDet(mov.id)}
                    ></img>
                  )}
                </li>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
