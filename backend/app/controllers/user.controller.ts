import {Router, Request, Response} from 'express';
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
    res.statusCode = 403;
    res.json({
      'message': 'user not found'
    });
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
Get user information
 */
router.get('/profilePage', async (req: Request, res: Response) => {
  const token = req.body.token;

  let verification = false;
  try {
    verification = jwt.verify(token, PRIVATE_KEY);
  } catch (err) {}

  if (verification) {
    const payload = jwt.decode(token);
    const username = payload.username;
    const user = await User.findByPrimary(username);
    if (user) {
      res.statusCode = 200;
      res.send(user.toSimplification());
    } else {
      res.statusCode = 404;
      res.json({
        'message': 'user not found'
      });
    }

  } else {
    res.statusCode = 403;
    res.json({
      'message': 'not logged in'
    });
  }
});

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
