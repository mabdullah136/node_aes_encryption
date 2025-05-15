const User = require("../../models/user");
const { encrypt, decrypt } = require("../../middleware/encrypt");

module.exports = {
  signup: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const encryptedPassword = encrypt(password);

      if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      if (email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ error: "Email already exists" });
        }
      }

      const user = new User({ name, email, password: encryptedPassword });
      await user.save();

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const decryptedPassword = decrypt(user.password);
      if (decryptedPassword !== password) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
