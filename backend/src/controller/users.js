const { users } = require("../../models");

const joi = require("joi");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const Sequelize = require("sequelize");
const { json } = require("express/lib/response");

exports.register = async (req, res) => {
  const schema = joi.object({
    fullname: joi.string().min(3).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.send({
      error: error.details[0].message,
    });
  }
  try {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const emailCheck = await users.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    console.log(emailCheck);

    if (emailCheck) {
      res.status(200).send({
        status: "exist",
        message: "email already exist",
      });
    } else {
      const newUser = await users.create({
        email: req.body.email,
        password: hashedPassword,
        fullname: req.body.fullname,
      });
      // const SECRET_KEY = "dumbgramTheBestSocmed";

      const token = jwt.sign({ email: newUser.email }, process.env.TOKEN_KEY);

      res.status(200).send({
        status: "success",
        message: "register successful",
        data: {
          user: {
            fullname: newUser.fullname,
            token,
          },
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "internal server error",
    });
  }
};

exports.login = async (req, res) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(5).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.send({
      error: error.details[0].message,
    });
  }

  try {
    const { email, password } = req.body;

    let userExist = await users.findOne({
      where: {
        email: email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    console.log(userExist);

    if (userExist == null) {
      return res.status(400).send({
        status: "failed",
        message: "email or password mismatch",
      });
    }

    const isValid = await bcrypt.compare(password, userExist.password);

    console.log(isValid);

    if (!isValid) {
      return res.status(400).send({
        status: "failed",
        message: "password or email mismatch",
      });
    }

    let data = {
      id: userExist.id,
      email: userExist.email,
      fullname: userExist.fullname,
      role: userExist.role,
    };

    const token = jwt.sign(data, process.env.TOKEN_KEY);

    userExist = JSON.parse(JSON.stringify(userExist));

    userExist = {
      ...userExist,
      image: process.env.PROFILE_PATH + userExist.image,
      
    };

    res.send({
      status: "success",
      message: "login success",
      data: {
        fullname: userExist.fullname,
        email: userExist.email,
        role: userExist.role,
        image: userExist.image,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "internal server error",
    });
  }
};

exports.userData = async (req, res) => {
  try {
    const userId = req.users.id;

    let findUser = await users.findOne({
      where: {
        id: userId,
      },
      attributes: {
        exclude: ["createdAt", "password", "updatedAt"],
      },
    });

    findUser = JSON.parse(JSON.stringify(findUser));

    findUser = {
      ...findUser,
      image: process.env.PROFILE_PATH + findUser.image,
    };

    res.send({
      status: "success",
      data: findUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "internal server error",
    });
  }
};

exports.userAuth = async (req, res) => {
  try {
    const id = req.users.id;

    let dataUser = await users.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    console.log(dataUser);

    if (!dataUser) {
      return res.status(404).send({
        status: "failed",
      });
    }

    dataUser = JSON.parse(JSON.stringify(dataUser));

    dataUser = {
      ...dataUser,
      image: process.env.PROFILE_PATH + dataUser.image,
    };

    res.send({
      status: "success",
      data: {
        id: dataUser.id,
        fullname: dataUser.fullname,
        email: dataUser.email,
        role: dataUser.role,
        image: dataUser.image,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
