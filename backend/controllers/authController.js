const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

exports.signup = async (req, res) => {
    try{
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'User already exists withe the Email-Id'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });
        await newUser.save();
        res.status(201).json({message: 'User created sucessfully!'});
    }
    catch(error){
        res.status(500).json({message: 'Server error during SignUp.' , error: error.message });
    }
};

exports.login = async (req,res) => {
    try{
        const { email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid Credentials."});
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({ 
            result: {id: user._id, name: user.name, email: user.email, role: user.role},
            token
         });
    } 
    catch (error) {
        res.status(500).json({ message: "Server error during login.", error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password'); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

exports.getTeamMembers = async (req, res) => {
  try {
    const users = await User.find({}).select('_id name email role').sort({ name: 1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch team members", error: error.message });
  }
};