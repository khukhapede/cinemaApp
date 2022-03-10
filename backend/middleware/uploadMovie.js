const multer = require("multer");

exports.uploadMovie = (poster, background, video) => {
  // set destination
  const storage = multer.diskStorage({
    destination: function (request, file, cb) {
      if (file.fieldname === poster) {
        cb(null, "Media/Poster");
      } else if (file.fieldname === background) {
        cb(null, "Media/Background");
      } else if (file.fieldname === video) {
        cb(null, "Media/Video");
      }
    },
    filename: function (request, file, cb) {
      if (file.fieldname === poster) {
        cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
      } else if (file.fieldname === background) {
        cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
      } else if (file.fieldname === video) {
        cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
      }
    },
  });

  // filtering file upload
  const fileFilter = function (req, file, cb) {
    if (file.fieldname === poster) {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/gif"
      ) {
        cb(null, true);
      } else {
        console.log(file.mimetype);
        req.fileValidationError = {
          message: "Only image poster file allowed",
        };
        return cb(new Error("Only image poster file allowed", false));
      }
    } else if (file.fieldname === background) {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/gif"
      ) {
        cb(null, true);
      } else {
        console.log(file.mimetype);
        req.fileValidationError = {
          message: "Only image background file allowed",
        };
        return cb(new Error("Only image background file allowed", false));
      }
    } else if (file.fieldname === video) {
      if (file.mimetype == "video/mp4" || file.mimetype == "video/quicktime") {
        cb(null, true);
      } else {
        console.log(file.mimetype);
        req.fileValidationError = {
          message: "Only video file allowed",
        };
        return cb(new Error("Only video file allowed", false));
      }
    }
    cb(null, true);
  };

  // Sizing file upload
  const sizeInMB = 400;
  const maxSize = sizeInMB * 1000 * 1000;

  // Generate Setting
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).fields([{ name: poster }, { name: background }, { name: video }]);

  // Middleware handler
  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }

      if (!req.files && !err) {
        return res.status(400).send({
          message: "please select file to upload",
        });
      } else if (JSON.stringify(req.files) === "{}") {
        return res.status(400).send({
          message: "file input cant empty",
        });
      } else if (!req.files.poster) {
        return res.status(400).send({
          message: "poster input cant empty",
        });
      } else if (!req.files.background) {
        return res.status(400).send({
          message: "background input cant empty",
        });
      } else if (!req.files.video) {
        return res.status(400).send({
          message: "video input cant empty",
        });
      }

      if (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "file exceeding limit size",
          });
        }
        return res.status(400).send(err);
      }

      return next();
    });
  };
};
