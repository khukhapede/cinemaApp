import React, { useState, useContext } from "react";

import Styles from "./Landing.module.css";

import { useQuery } from "react-query";
import { API } from "../../config/api";

import { useNavigate } from "react-router-dom";

import Login from "../../components/Login/Login";
import Register from "../../components/Register/Register";

import { UserContext } from "../../context/userContext";

export default function Landing() {
  const navigate = useNavigate();

  const [rgShow, setRgShow] = useState(false);
  const openRg = () => setRgShow(true);
  const closeRg = () => setRgShow(false);

  const [lgShow, setLgShow] = useState(false);
  const openLg = () => setLgShow(true);
  const closeLg = () => setLgShow(false);

  const [state, dispatch] = useContext(UserContext);

  let api = API();
  let { data: headLine, isLoading: loadHead } = useQuery(
    "headCache",
    async () => {
      const config = {
        method: "GET",
      };

      const response = await api.get("/movie-headline", config);

      return response.data;
    }
  );

  //get all movies list
  let { data: allMovies, isLoading: loadingList } = useQuery(
    "listCache",
    async () => {
      const config = {
        method: "GET",
      };

      const response = await api.get("/all-movies", config);

      return response.data;
    }
  );

  function movDet(id) {
    if (!state.isLogin) {
      openLg();
    } else {
      navigate("/movie-detail/" + id);
    }
  }

  return (
    <div className={`${Styles.mainBody}`}>
      <div className={`${Styles.upper}`}>
        {!loadHead && (
          <div
            className={`${Styles.movHeadline}`}
            style={{
              backgroundImage: `url(${headLine.background})`,
            }}
          >
            <div className={`${Styles.movDetail}`}>
              <div className={`${Styles.title}`}>{headLine.name}</div>
              <div className={`${Styles.genre}`}>{headLine.category.name}</div>
              <div className={`${Styles.price}`}>
                <div>Rp.{headLine.price}</div>
              </div>
              <div className={`${Styles.desc}`}>{headLine.desc}</div>
              <button
                className={`${Styles.buyBtn}`}
                onClick={() => movDet(headLine.id)}
              >
                buy now
              </button>
            </div>
          </div>
        )}
      </div>
      <div className={`${Styles.bottom}`}>
        <div className={`${Styles.movList}`}>
          <div className={`${Styles.filist}`}>film List</div>
          <div className={`${Styles.movCardList}`}>
            {loadingList ? (
              <div>loading</div>
            ) : (
              allMovies.map((mov) => (
                <li key={mov.id}>
                  <img
                    src={mov.poster}
                    alt="gambar"
                    className={`${Styles.movCard}`}
                    onClick={() => movDet(mov.id)}
                  />
                </li>
              ))
            )}
          </div>
        </div>
      </div>
      <Login show={lgShow} close={closeLg} subs={openRg} />
      <Register show={rgShow} close={closeRg} subs={openLg} />
    </div>
  );
}
