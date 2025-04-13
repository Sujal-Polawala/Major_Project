const User = require("../../models/user");

exports.getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password for security
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};
