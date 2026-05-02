const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyToken = (req, res, next) => {
    try{
        let token = req.headers.authorization;
        if(!token || !token.startsWith('Bearer ')){
            return res.status(401).json({message: 'Acess Denied. No token provided.'});
        }
        token = token.split(" ")[1];

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    }
    catch(error){
        res.status(401).json({message: "Invalid or expired token."});
    }
};

exports.verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: "Access Denied. Admin privileges required." });
  }
  next(); 
};