import {Request, Response, Router} from 'express';
import {User} from '../models/user.model';

const router: Router = Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = 'LirumLarumLoeffelstiel';
const EXPIRATION_TIME = () => Math.floor(Date.now() / 1000) + (60 * 60);

router.get('/', async (req: Request, res: Response) => {
  const instances = await User.findAll();
  res.statusCode = 200;
  res.send(instances.map(e => e.toSimplification()));
});

/*
Login
 */
router.get('/login', async (req: Request, res: Response) => {
  const user = await User.findByPrimary(req.body.username);
  if (!user) {
    userNotFound(res);
    return;
  }
  if (bcrypt.compareSync(req.body.password, user.passwordHash)) {
    res.statusCode = 200;
    const payload = {
      'username': user.username.toString(),
      'exp': EXPIRATION_TIME()
    };
    const signOptions = {
      /*
      'expiresIn': '1h',
      'algorithm': 'RS256'
       */
    };
    // const token = jwt.sign(payload, PRIVATE_KEY);
    const token = jwt.sign(payload, PRIVATE_KEY, signOptions);
    res.send(token);
    res.json({
      'message': 'successfully logged in'
    });
  } else {
    res.statusCode = 403;
    res.json({
      'message': 'wrong password'
    });
    return;
  }
});

/*
Verify a JWT
 */
function verify(token: string) {
  let verification = false;
  try {
    verification = jwt.verify(token, PRIVATE_KEY);
  } catch (err) {
  }
  return verification;
}

/*
Get the user from a JWT
 */
async function decodeUser(token: string) {
  const payload = jwt.decode(token);
  const username = payload.username;
  return await User.findByPrimary(username);
}

/*
Send "not logged in" message to frontend
 */
function userNotLoggedIn(res: any) {
  res.statusCode = 403;
  res.json({
    'message': 'not logged in'
  });
}

/*
Send "user not found" message to frontend
 */
function userNotFound(res: any) {
  res.statusCode = 404;
  res.json({
    'message': 'user not found'
  });
}

/*
send user profile to frontend
 */
function userProfile(res: any, user: User) {
  res.statusCode = 200;
  res.send(user.toSimplification());
}

/*
Get user information
 */
router.get('/profile', async (req: Request, res: Response) => {
  const token = req.body.token;
  const verification = verify(token);
  if (verification) {
    const user = await decodeUser(token);
    if (user) {
      userProfile(res, user);
    } else {
      userNotFound(res);
    }
  } else {
    userNotLoggedIn(res);
  }
});

/*
Change parameters of an existing User
 */
router.put('/profile', async (req: Request, res: Response) => {
  const token = req.body.token;
  const verification = verify(token);
  if (verification) {
    const user = await decodeUser(token);
    if (user) {
      if (req.body.password != null) {
        req.body.password = await bcrypt.hash(req.body.password, saltRounds);
      } else {
        req.body.password = user.passwordHash;
      }
      user.fromSimplification(req.body);
      await user.save();
      userProfile(res, user);
    } else {
      userNotFound(res);
    }
  } else {
    userNotLoggedIn(res);
  }
});

/*
Post a new User
 */
router.post('/', async (req: Request, res: Response) => {
  const simpleUser = req.body;
  const user = await User.findByPrimary(simpleUser.username);
  if (user) {
    res.statusCode = 403;
    res.json({
      'message': 'username already taken'
    });
    return;
  }
  const instance = new User();
  simpleUser.password = await bcrypt.hash(req.body.password, saltRounds);
  instance.fromSimplification(simpleUser);
  await instance.save();
  res.statusCode = 201;
  res.send(instance.toSimplification());
});

export const UserController: Router = router;
