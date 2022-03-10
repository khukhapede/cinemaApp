import React from "react";

import Styles from "./TransCard.module.css";

export default function TransCard(props) {
  const { title, date, price, status } = props;

  let timeCon = new Date(date);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = days[timeCon.getDay()];

  let newDate = `${timeCon.getDate()} ${
    months[timeCon.getMonth()]
  } ${timeCon.getFullYear()}`;

  return (
    <div className={`${Styles.mainBody}`}>
      <div className={`${Styles.transDetail}`}>
        <div className={`${Styles.transTitle}`}>{title}</div>
        <div className={`${Styles.transDate}`}>
          {day}, {newDate}
        </div>
        <div className={`${Styles.transPrice}`}>total: Rp.{price}</div>
      </div>
      <div className={`${Styles.transStat}`}>
        {(() => {
          if (status === "finished") {
            return (
              <div
                className={`${Styles.stat}`}
                style={{ background: "#07ce003b", color: "#09ff00" }}
              >
                <div>finished</div>
              </div>
            );
          } else if (status === "pending") {
            return (
              <div
                className={`${Styles.stat}`}
                style={{
                  background: "rgba(107, 89, 0, 0.82)",
                  color: "rgba(245, 204, 0, 1)",
                }}
              >
                <div>pending</div>
              </div>
            );
          } else if (status === "cancel") {
            return (
              <div
                className={`${Styles.stat}`}
                style={{
                  background: "rgba(107, 0, 0, 0.82)",
                  color: "rgba(255, 61, 61, 1)",
                }}
              >
                <div>cancel</div>
              </div>
            );
          }
        })()}
      </div>
    </div>
  );
}
