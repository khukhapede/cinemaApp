const express = require("express");

const { uploadMovie } = require("../../middleware/uploadMovie");

const { uploadReceipt } = require("../../middleware/uploadReceipt");

const router = express.Router();

const { auth } = require("../../middleware/auth");

const { register, login, userData, userAuth } = require("../controller/users");

const {
  addTransactions,
  getAllTrans,
  getTransByUser,
  checkTransStat,
  updateStat,
} = require("../controller/transactions");

const {
  addMovie,
  getAllMovies,
  getMovieDetail,
  getMovieHeadline,
  getFilmList,
  getGenres,
} = require("../controller/movies");

router.post("/register", register);

router.post("/login", login);

router.get("/user-data", auth, userData);

router.get("/check-auth", auth, userAuth);

// movies section

router.post(
  "/add-movie",
  uploadMovie("poster", "background", "video"),
  addMovie
);

router.get("/all-movies", getAllMovies);

router.get("/movie/:id", getMovieDetail);

router.get("/movie-headline", getMovieHeadline);

router.get("/film-list", auth, getFilmList);

router.get("/genres", getGenres);

// trans section

router.post(
  "/add-transactions/:id",
  auth,
  uploadReceipt("receipt"),
  addTransactions
);

router.get("/get-trans", auth, getAllTrans);

router.get("/user-trans", auth, getTransByUser);

router.get("/check-trans/:id", auth, checkTransStat);

router.patch("/update-trans", auth, updateStat);

module.exports = router;
