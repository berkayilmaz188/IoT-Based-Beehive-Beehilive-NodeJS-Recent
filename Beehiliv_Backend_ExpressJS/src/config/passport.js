const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/userModel');

module.exports = (passport) => {
    const opts = {
        jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey : 'secret_key',
        algorithms: ['HS256']
    }

    passport.use(new JwtStrategy(opts, async (jwt_payload, done)=>{
        try{
          const user = await User.findOne({_id: jwt_payload.user._id});
          if (!user){
              return done(null, false, {message: "Incorrect email or password."});
          }
              return done(null, user);
        }catch (e) {
            return done(e);
        }
    }));
}