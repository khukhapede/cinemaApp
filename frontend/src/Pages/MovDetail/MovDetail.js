import React, { useState } from "react";

import Styles from "./MovDetail.module.css";

import ReactPlayer from "react-player";

import { useParams } from "react-router-dom";

import { API } from "../../config/api";
import { useQuery } from "react-query";

import BuyModal from "../../components/BuyModal/BuyModal";

import AlertModal from "../../components/AlertModal/AlertModal";

export default function MovDetail() {
  let api = API();

  const [buyShow, setBuyShow] = useState(false);
  const [alertShow, setAlert] = useState(false);

  const close = () => setBuyShow(false);
  const open = () => setBuyShow(true);

  const openAlert = () => setAlert(true);
  const closeAlert = () => setAlert(false);

  const { id } = useParams();

  let {
    data: movDet,
    isLoading: loadMovie,
    refetch: movFetch,
  } = useQuery(["movDetCache", id], async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: "Basic " + localStorage.token,
      },
    };
    const response = await api.get("/movie/" + id, config);

    return response.data;
  });

  let {
    data: statCheck,
    isLoading: loadStat,
    refetch: statFetch,
  } = useQuery(["statCheckCache", id], async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: "Basic " + localStorage.token,
      },
    };
    const response = await api.get("/check-trans/" + id, config);

    return response.data;
  });

  function refetching() {
    movFetch();
    statFetch();
  }
  return (
    <div className={`${Styles.mainBody}`}>
      <div className={`${Styles.movImage}`}>
        {loadMovie ? (
          <h4>Loading...</h4>
        ) : (
          <img src={`${movDet.poster}`} alt="img" />
        )}
      </div>
      {loadMovie ? (
        <h4>Loading...</h4>
      ) : (
        <div div className={`${Styles.movDetail}`}>
          <div className={`${Styles.movieHead}`}>
            <div className={`${Styles.movieTitle}`}>{movDet.name}</div>
            {(() => {
              if (!loadStat) {
                if (!statCheck || statCheck.status === "cancel") {
                  return (
                    <button className={`${Styles.buyBtn}`} onClick={open}>
                      buy
                    </button>
                  );
                } else if (statCheck.status === "pending") {
                  return (
                    <button className={`${Styles.pendingBtn}`}>pending</button>
                  );
                }
              }
            })()}
          </div>

          <div className={`${Styles.moviePlayer}`}>
            {(() => {
              if (!loadStat) {
                if (!statCheck || statCheck.status === "cancel") {
                  return (
                    <div>
                      <img
                        src={movDet.background}
                        alt="img"
                        onClick={() => openAlert()}
                      />
                      <AlertModal
                        close={closeAlert}
                        show={alertShow}
                        type={"buy"}
                      />
                    </div>
                  );
                } else if (statCheck.status === "pending") {
                  return (
                    <div>
                      <img
                        src={movDet.background}
                        alt="img"
                        onClick={() => openAlert()}
                      />
                      <AlertModal
                        close={closeAlert}
                        show={alertShow}
                        type={"pending"}
                      />
                    </div>
                  );
                } else {
                  return (
                    <ReactPlayer
                      url={movDet.video}
                      controls={true}
                      width="735px"
                      height="315px"
                    />
                  );
                }
              }
            })()}
          </div>
          <div className={`${Styles.genre}`}>{movDet.category.name}</div>
          <div className={`${Styles.price}`}>Rp.{movDet.price}</div>
          <div className={`${Styles.desc}`}>{movDet.desc}</div>
          <BuyModal
            close={close}
            show={buyShow}
            title={movDet.name}
            price={movDet.price}
            id={id}
            refetch={refetching}
          />
        </div>
      )}
    </div>
  );
}
