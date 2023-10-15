export default function errorHandler(res, error) {
  console.log("Error: ", error);

  if (error.name == "MongoServerError") {
    console.log("Error code: ", error.code);
    if (error.code == 11000) {
      res.status(401).json({
        error: true,
        message: "Email must be unique",
      });
    }
  } else {
    res.status(503).json({
      error: true,
      message: "SERVER_ERROR",
    });
  }
}
