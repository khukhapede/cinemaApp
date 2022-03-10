const { transactions, users, movies } = require("../../models");

exports.addTransactions = async (req, res) => {
  try {
    const userId = req.users.id;
    const movieId = req.params.id;
    const receipt = req.file.filename;
    const { numAccount } = req.body;

    const checkCancel = await transactions.findOne({
      where: {
        userId,
        movieId,
        status: "cancel",
      },
    });

    if (checkCancel) {
      await transactions.destroy({
        where: {
          userId,
          movieId,
          status: "cancel",
        },
      });
    }

    await transactions.create({
      userId,
      movieId,
      receipt,
      numAccount,
    });

    let data = await transactions.findOne({
      include: [
        {
          model: movies,
          as: "film",
          attributes: ["id", "name", "price"],
        },
        {
          model: users,
          as: "buyer",
          attributes: ["id", "fullname"],
        },
      ],

      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["id", "DESC"]],
    });

    data = JSON.parse(JSON.stringify(data));

    data = {
      ...data,
      receipt: process.env.RC_PATH + data.receipt,
    };

    res.send({
      status: "success",
      message: "transaction success",
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

exports.getAllTrans = async (req, res) => {
  try {
    let data =  transactions.findAll({
      include: [
        {
          model: movies,
          as: "film",
          attributes: ["id", "name", "price"],
        },
        {
          model: users,
          as: "buyer",
          attributes: ["id", "fullname"],
        },
      ],

      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["id", "DESC"]],
    });

    data = JSON.parse(JSON.stringify(data));

    data = data.map((datamap) => {
      return { ...datamap, receipt: process.env.RC_PATH + datamap.receipt };
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

exports.getTransByUser = async (req, res) => {
  try {
    const userId = req.users.id;

    let data = await transactions.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: movies,
          as: "film",
          attributes: ["id", "name", "price"],
        },
        {
          model: users,
          as: "buyer",
          attributes: ["id", "fullname"],
        },
      ],

      attributes: {
        exclude: ["updatedAt"],
      },
      order: [["id", "DESC"]],
    });

    data = JSON.parse(JSON.stringify(data));

    data = data.map((datamap) => {
      return { ...datamap, receipt: process.env.RC_PATH + datamap.receipt };
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

exports.checkTransStat = async (req, res) => {
  try {
    const userId = req.users.id;
    const movieId = req.params.id;

    let data = await transactions.findOne({
      where: {
        movieId,
        userId,
      },
      attributes: ["status"],
      order: [["id", "DESC"]],
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

exports.updateStat = async (req, res) => {
  try {
    const { id, status } = req.body;

    const editData = {
      status,
    };

    await transactions.update(editData, {
      where: {
        id,
      },
    });

    const updateData = await transactions.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      message: `update transactions success`,
      data: updateData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "internal server error",
    });
  }
};
