module.exports = {
  index: (req, res) => {
    const cookie = req.cookies.authToken;
    console.log("🚀 ~ cookie:", cookie);
  },
};
