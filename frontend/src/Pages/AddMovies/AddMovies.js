import React, { useState } from "react";

import { Form, Button } from "react-bootstrap";

import Styles from "./AddMovies.module.css";

import { useQuery, useMutation } from "react-query";

import { API } from "../../config/api";

import { useNavigate } from "react-router-dom";

export default function AddMovies() {
  let api = API();
  let navigate = useNavigate();

  let { data: genres, isLoading } = useQuery("genreCache", async () => {
    const config = {
      method: "GET",
    };

    const response = await api.get("/genres", config);

    return response.data;
  });

  const [addGenres, setAddGenres] = useState(1);

  const [poster, setPoster] = useState(null);

  const [background, setBackground] = useState(null);

  const [video, setVideo] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    desc: "",
  });

  const handleGenres = (e) => {
    setAddGenres(e.target.value);
  };

  const handlePoster = (e) => {
    setPoster(e.target.files[0]);
  };

  const handleBackground = (e) => {
    setBackground(e.target.files[0]);
  };

  const handleVideo = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();

      formData.set("poster", poster, poster.name);
      formData.set("background", background, background.name);
      formData.set("video", video, video.name);
      formData.set("name", form.name);
      formData.set("desc", form.desc);
      formData.set("price", form.price);
      formData.set("genre", addGenres);

      const config = {
        method: "POST",
        body: formData,
      };

      const response = await api.post("/add-movie", config);

      if (response.status === "success") {
        navigate("/trans-list");
      }
    } catch (err) {
      console.log(err);
    }
  });

  return (
    <div className={Styles.mainBody}>
      <div className={Styles.title}>
        <b>add film </b>
      </div>
      <div className={Styles.formSec}>
        <Form onSubmit={(e) => handleSubmit.mutate(e)}>
          <div className={Styles.listandBtn}>
            <div className={Styles.genreList}>
              <select
                name="genre"
                id="genre"
                className={Styles.genre}
                onChange={handleGenres}
              >
                {isLoading ? (
                  <option value="loading">loading...</option>
                ) : (
                  genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className={Styles.uploadRow}>
              <div>
                <div className={Styles.uploadBtn}>
                  <input
                    type="file"
                    id="uploadposter"
                    name="poster"
                    hidden
                    onChange={handlePoster}
                  />
                  <label htmlFor="uploadposter">
                    <b>poster</b>
                  </label>
                </div>
                {poster && <hr />}
              </div>

              <div>
                <div className={Styles.uploadBtn}>
                  <input
                    type="file"
                    id="uploadbackground"
                    name="background"
                    hidden
                    onChange={handleBackground}
                  />
                  <label htmlFor="uploadbackground">
                    <b>background</b>
                  </label>
                </div>
                {background && <hr />}
              </div>

              <div>
                <div className={Styles.uploadBtn}>
                  <input
                    type="file"
                    id="uploadvideo"
                    name="video"
                    hidden
                    onChange={handleVideo}
                  />
                  <label htmlFor="uploadvideo">
                    <b>video</b>
                  </label>
                </div>
                {video && <hr />}
              </div>
            </div>
          </div>
          <div className={Styles.inputSec}>
            <input
              type="text"
              name="name"
              placeholder="title"
              onChange={handleChange}
              className={Styles.inputBox}
            />
            <input
              type="number"
              name="price"
              placeholder="price"
              onChange={handleChange}
              className={Styles.inputBox}
            />
            <textarea
              type="text"
              name="desc"
              placeholder="description"
              onChange={handleChange}
              className={Styles.descBox}
            />
          </div>
          <Button className={` ${Styles.subBtn} float-end`} type="submit">
            <b>add film</b>
          </Button>
        </Form>
      </div>
      {/* {<Button className={Styles.addGenresBtn} variant="secondary">add genre</Button>} */}
    </div>
  );
}
