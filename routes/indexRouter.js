const router = require("express").Router();
const User = require("../models/userModel");

router.post("/addUser", async (req, res) => {
  const { name, mobile, email } = req.body;
  const phoneNoExists = await User.findOne({ mobile: mobile });
  if (phoneNoExists) return res.status(400).send("Phone number already exists");
  console.log(req.body.address.coordinates);
  const user = new User({
    name: name,
    mobile: mobile,
    email: email,
    address: {
      street: req.body.address.street || " ",
      locality: req.body.address.locality || " ",
      city: req.body.address.city || " ",
      state: req.body.address.state || " ",
      pincode: req.body.address.pincode || " ",
      coordinateType: req.body.address.coordinateType || " ",
      coordinates: req.body.address.coordinates,
    },
  });
  try {
    const savedUser = await user.save();
    if (user._id) return res.status(200).send("User added!");
    else return res.status(400).send("Something went wrong");
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});

router.get("/getAllUsers?", async (req, res) => {
  if (req.query.page) {
    const userList = await User.find({})
      .limit(10)
      .skip(parseInt(req.query.page) - 1)
      .sort("createdAt");
    return res.send(userList);
  }
  if (req.query.latitude && req.query.longitude) {
    const userList = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: "Pont",
            coordinates: [
              parseFloat(req.query.longitude),
              parseFloat(req.query.latitude),
            ],
          },
          distanceField: "dist.calculated",
          spherical: true,
        },
      },
      {
        $sort: { "dist.calculated": 1 },
      },
    ]);
    return res.send(userList);
  }
});

router.put("/updateUser", async (req, res) => {
  try {
    const userUpdated = await User.findOneAndUpdate(
      { mobile: req.body.mobile },
      req.body
    );
    return res.send(userUpdated);
  } catch (error) {
    res.send(error);
  }
});

router.post("/deleteUser", async (req, res) => {
  try {
    const deleteUser = await User.deleteOne({ mobile: req.body.mobile });
    if (deleteUser) res.send("User deleted");
    else res.send("User not found or something went wrong");
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
