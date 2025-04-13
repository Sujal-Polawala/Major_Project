const User = require('../../models/user');

exports.addAddress = async (req, res) => {
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
  
      // Validate specific fields
      if (address.mobileno.length !== 10 || isNaN(address.mobileno)) {
        return res.status(400).json({ message: "Invalid mobile number" });
      }
  
      if (address.pincode.length !== 6 || isNaN(address.pincode)) {
        return res.status(400).json({ message: "Invalid pincode" });
      }
  
      // Find user by ID and update the address
      const user = await User.findByIdAndUpdate(
        userId,
        { address },
        { new: true } // Return the updated document
      );
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "Address added successfully", user });
    } catch (error) {
      console.error("Error adding address:", error);
      res
        .status(500)
        .json({ message: "Failed to add address", error: error.message });
    }
};