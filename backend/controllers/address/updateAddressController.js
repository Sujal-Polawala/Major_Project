const User = require('../../models/user');

exports.updateAddress = async (req, res) => {
    const { userId } = req.params;
    const { address } = req.body;
  
    try {
      if (
        !address ||
        !address.address ||
        !address.city ||
        !address.state ||
        !address.pincode ||
        !address.country ||
        !address.mobileno
      ) {
        return res
          .status(400)
          .json({ message: "All address fields are required" });
      }
  
      if (address.mobileno.length !== 10 || isNaN(address.mobileno)) {
        return res.status(400).json({ message: "Invalid mobile number" });
      }
  
      if (address.pincode.length !== 6 || isNaN(address.pincode)) {
        return res.status(400).json({ message: "Invalid pincode" });
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { address } },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res
        .status(200)
        .json({ message: "Address updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error updating address:", error);
      res
        .status(500)
        .json({ message: "Failed to update address", error: error.message });
    }
  };