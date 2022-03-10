import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Landing from "./Pages/Landing/Landing";
import Navbar from "./components/Navbar/Navbar";
import MyList from "./Pages/myListFilm/MyListFilm";
import MyProfile from "./Pages/MyProfile/Myprofile";
import MovDetail from "./Pages/MovDetail/MovDetail";
import AddMovies from "./Pages/AddMovies/AddMovies";
import TransList from "./Pages/TransList/TransList";

import { Routes, Route, useNavigate } from "react-router-dom";

import { useContext, useState, useEffect } from "react";

import { UserContext } from "./context/userContext";

import { API } from "./config/api";

function App() {
  let api = API();
  let navigate = useNavigate();

  const [state, dispatch] = useContext(UserContext);

  useEffect(() => {
    if (!state.isLogin) {
      navigate("/");
    } else if (state.user.role == "consumer") {
      navigate("/");
    } else if (state.user.role == "admin") {
      navigate("/trans-list");
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const config = {
        method: "GET",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };
      const response = await api.get("/check-auth", config);

      // If the token incorrect
      if (response.status === "failed") {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      // // Get user data
      let payload = response.data;
      console.log(payload);
      // // Get token from local storage
      payload.token = localStorage.token;
      console.log(payload.token);

      // // Send data to useContext
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <div className="App">
      <Navbar />

      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route exact path="/my-list" element={<MyList />} />
        <Route exact path="/my-profile" element={<MyProfile />} />
        <Route exact path="/add-movie" element={<AddMovies />} />
        <Route exact path="/trans-list" element={<TransList />} />
        <Route exact path="/movie-detail" element={<MovDetail />}>
          <Route path=":id" element={<MovDetail />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
