const homePage = (req, res) => {
  res.status(200).json({
    message: "Welcome to the Blog Platform API",
    status: "success",
  });
};

module.exports = {
  homePage,
};
