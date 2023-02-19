const homeView = (req, res) => {
    res.render("home", {
      user: req.user
    });
  };
  module.exports = {
    homeView,
  };