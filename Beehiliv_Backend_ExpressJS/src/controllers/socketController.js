const get = (req, res) => {
  console.log("socket");
  res.status(200).send({
    success: true,
    message: "welcome to the beginning of greatness",
  });
};

module.exports = {
  get,
};
