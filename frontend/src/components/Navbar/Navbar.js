import React, { useState, useContext, useEffect } from "react";

import Styles from "./Navbar.module.css";

import Login from "../Login/Login";
import Register from "../Register/Register";

import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

export default function Navbar() {
  const [rgShow, setRgShow] = useState(false);
  const openRg = () => setRgShow(true);
  const closeRg = () => setRgShow(false);

  const [lgShow, setLgShow] = useState(false);
  const openLg = () => setLgShow(true);
  const closeLg = () => setLgShow(false);

  const [isLogin, setLogin] = useState(false);
  const [isAdmin, setAdmin] = useState(false);

  const navigate = useNavigate();

  const [state, dispatch] = useContext(UserContext);

  useEffect(() => {
    if (!state.isLogin) {
      setLogin(false);
    } else if (state.user.role === "admin") {
      setLogin(true);
      setAdmin(true);
    } else if (state.user.role === "consumer") {
      setLogin(true);
      setAdmin(false);
    }
  }, [state]);
  return (
    <div className={`${Styles.main}`}>
      {state.user.role === "admin" ? (
        <div
          className={`${Styles.logo}`}
          onClick={() => navigate("/trans-list")}
        >
          <img
            src="/./icons/brand.png"
            alt="brand"
            className={`${Styles.brand}`}
          />
        </div>
      ) : (
        <div className={`${Styles.logo}`} onClick={() => navigate("/")}>
          <img
            src="/./icons/brand.png"
            alt="brand"
            className={`${Styles.brand}`}
          />
        </div>
      )}

      <div className={`${Styles.button}`}>
        {isLogin ? (
          isAdmin ? (
            <div className={`${Styles.btnProfile}`}>
              <img
                src="/./icons/doomguy.jpg"
                alt="login"
                className={`${Styles.imgProfileAdmin}`}
              />
              <div className={`${Styles.dropdownMenu}`}>
                <div className={`${Styles.dropdownContent}`}>
                  <div
                    className={`${Styles.dropdownList}`}
                    onClick={() => navigate("/add-movie")}
                  >
                    <img
                      src="/./icons/film.png"
                      alt="user"
                      className={`${Styles.dropdownImg}`}
                    />
                    <div className={`${Styles.dropdownText}`}>Add Film</div>
                  </div>
                  <hr />
                  <div className={`${Styles.dropdownList}`}>
                    <img
                      src="/./icons/logout.png"
                      alt="user"
                      className={`${Styles.dropdownImg}`}
                    />
                    <div
                      className={`${Styles.dropdownText}`}
                      onClick={() => dispatch({ type: "LOGOUT" })}
                    >
                      Logout
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`${Styles.btnProfile}`}>
              <img
                src={state.user.image}
                alt="login"
                className={`${Styles.imgProfile}`}
              />
              <div className={`${Styles.dropdownMenu}`}>
                <div className={`${Styles.dropdownContent}`}>
                  <div
                    className={`${Styles.dropdownList}`}
                    onClick={() => navigate("/my-profile")}
                  >
                    <img
                      src="/./icons/user.png"
                      alt="user"
                      className={`${Styles.dropdownImg}`}
                    />
                    <div className={`${Styles.dropdownText}`}>profile</div>
                  </div>
                  <div
                    className={`${Styles.dropdownList}`}
                    onClick={() => navigate("/my-list")}
                  >
                    <img
                      src="/./icons/film.png"
                      alt="user"
                      className={`${Styles.dropdownImg}`}
                    />
                    <div className={`${Styles.dropdownText}`}>My list Film</div>
                  </div>
                  <hr />
                  <div className={`${Styles.dropdownList}`}>
                    <img
                      src="/./icons/logout.png"
                      alt="user"
                      className={`${Styles.dropdownImg}`}
                    />
                    <div
                      className={`${Styles.dropdownText}`}
                      onClick={() => dispatch({ type: "LOGOUT" })}
                    >
                      Logout
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
          <div>
            <button className={`${Styles.btnLogin}`} onClick={openLg}>
              Login
            </button>
            <button className={`${Styles.btnRegister}`} onClick={openRg}>
              Register
            </button>
          </div>
        )}
      </div>
      <Login show={lgShow} close={closeLg} subs={openRg} />
      <Register show={rgShow} close={closeRg} subs={openLg} />
    </div>
  );
}
