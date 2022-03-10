const { movies, genres, transactions } = require("../../models");

const Sequelize = require("sequelize");
const { use } = require("express/lib/router");

exports.addMovie = async (req, res) => {
  try {
    const poster = req.files.poster[0].filename;
    const background = req.files.background[0].filename;
    const video = req.files.video[0].filename;
    const { name, genre, price, desc } = req.body;

    await movies.create({
      name,
      genre,
      price,
      desc,
      poster,
      background,
      video,
    });

    let data = await movies.findOne({
      where: {
        name: name,
      },
      include: {
        model: genres,
        as: "category",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["id", "DESC"]],
    });

    data = JSON.parse(JSON.stringify(data));

    data = {
      ...data,
      poster: process.env.POSTER_PATH + data.poster,
      video: process.env.VIDEO_PATH + data.video,
      background: process.env.BG_PATH + data.background,
    };

    res.send({
      status: "success",
      message: "movie has been added",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "internal server error",
    });
  }
};

exports.getAllMovies = async (req, res) => {
  try {
    let data = await movies.findAll({
      include: {
        model: genres,
        as: "category",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["id", "DESC"]],
    });

    data = JSON.parse(JSON.stringify(data));

    data = data.map((datamap) => {
      return {
        ...datamap,
        poster: process.env.POSTER_PATH + datamap.poster,
        video: process.env.VIDEO_PATH + datamap.video,
        background: process.env.BG_PATH + datamap.background,
      };
    });

    res.send({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "internal server error",
    });
  }
};

exports.getMovieDetail = async (req, res) => {
  try {
    const filmId = req.params.id;

    let data = await movies.findOne({
      where: {
        id: filmId,
      },
      include: {
        model: genres,
        as: "category",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["id", "DESC"]],
    });
    if (!data) {
      return res.status(400).send({
        status: "failed",
        message: "movie not found",
      });
    }

    data = JSON.parse(JSON.stringify(data));

    data = {
      ...data,
      poster: process.env.POSTER_PATH + data.poster,
      video: process.env.VIDEO_PATH + data.video,
      background: process.env.BG_PATH + data.background,
    };

    res.send({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "internal server error",
    });
  }
};

exports.getMovieHeadline = async (req, res) => {
  try {
    let data = await movies.findOne({
      include: {
        model: genres,
        as: "category",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: Sequelize.literal("rand()"),
    });

    data = JSON.parse(JSON.stringify(data));

    data = {
      ...data,
      poster: process.env.POSTER_PATH + data.poster,
      video: process.env.VIDEO_PATH + data.video,
      background: process.env.BG_PATH + data.background,
    };

    res.send({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "internal server error",
    });
  }
};

exports.getFilmList = async (req, res) => {
  try {
    const userId = req.users.id;

    let data = await movies.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["id", "DESC"]],
      include: {
        model: transactions,
        as: "film",
        where: {
          userId: userId,
        },
        attributes: ["status"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    data = data.map((datamap) => {
      return {
        ...datamap,
        poster: process.env.POSTER_PATH + datamap.poster,
        video: process.env.VIDEO_PATH + datamap.video,
        background: process.env.BG_PATH + datamap.background,
      };
    });
    res.send({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "internal server error",
    });
  }
};

exports.getGenres = async (req, res) => {
  try {
    let data = await genres.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["id", "ASC"]],
    });

    res.send({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "internal server error",
    });
  }
};
