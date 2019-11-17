import {Router, Request, Response} from 'express';
import {User} from '../models/user.model';


const router: Router = Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = 'LirumLarumLoeffelstiel';
const EXPIRATION_TIME = () => Math.floor(Date.now() / 1000) + (60 * 60);

/*
 temporary: to be deleted
 */
router.get('/', async (req: Request, res: Response) => {
  const instances = await User.findAll();
  res.statusCode = 200;
  res.send(instances.map(e => e.toSimplification()));
});

/*
Login
 */
router.post('/login', async (req: Request, res: Response) => {
  const user = await User.findByPk(req.body.username);
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
    const token = jwt.sign(payload, PRIVATE_KEY, signOptions);
    res.json({
      'message': 'successfully logged in',
      'token': token
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
export function verify(token: string) {
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
export async function decodeUser(token: string) {
  const payload = jwt.decode(token);
  const username = payload.username;
  return await User.findByPk(username);
}

/*
Send "not logged in" message to frontend
 */
export function userNotLoggedIn(res: any) {
  res.statusCode = 403;
  res.json({
    'message': 'not logged in'
  });
}

/*
Send "user not found" message to frontend
 */
export function userNotFound(res: any) {
  res.statusCode = 404;
  res.json({
    'message': 'user not found'
  });
}

/*
send "forbidden" message to frontend
 */
export function forbidden(res: any) {
  res.statusCode = 403;
  res.json({
    'message': 'forbidden'
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
router.get('/profile/:token', async (req: Request, res: Response) => {
  const token = req.params.token;
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
// TODO Get aller users, damit token retourned werden kann

router.get('/users/', async (req: Request, res: Response) => {
  // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
  if (req.headers.authorization === token) {
    res.statusCode = 200;
    res.json({
      'user': req.body.username
    });
    return;
  } else {
    // return 401 not authorised if token is null or invalid
    res.statusCode = 401;
    return;
  }
});

 */


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
  const user = await User.findByPk(simpleUser.username);
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
  res.json({
    'message': 'Registration complete'
  });
  res.send(instance.toSimplification());
  return;
});

/*
set isApproved by admin
 */
router.put('/admin', async (req: Request, res: Response) => {
  const token = req.body.token;
  const verification = verify(token);
  if (verification) {
    const user = await decodeUser(token);
    if (user) {
      if (!user.isAdmin) {
        forbidden(res);
        return;
      }
      const objectUser = await User.findByPk(req.body.username);
      if (objectUser) {
        objectUser.isApproved = req.body.isApproved;
        await objectUser.save();
        res.statusCode = 200;
        if (objectUser.isApproved) {
          res.json({
            'message': 'user successfully approved'
          });
        } else {
          res.json({
            'message': 'user successfully disapproved'
          });
        }
      } else {
        userNotFound(res);
        return;
      }
    } else {
      userNotFound(res);
    }
  } else {
    userNotLoggedIn(res);
  }
});

/*
delete user by admin
 */
router.delete('/', async (req: Request, res: Response) => {
  const token = req.body.token;
  const verification = verify(token);
  if (verification) {
    const user = await decodeUser(token);
    if (user) {
      if (!user.isAdmin) {
        forbidden(res);
        return;
      }
      const objectUser = await User.findByPk(req.body.username);
      if (objectUser) {
        await objectUser.destroy();
        res.statusCode = 200;
        res.json({
          'message': 'user successfully deleted'
        });
      } else {
        userNotFound(res);
        return;
      }
    } else {
      userNotFound(res);
    }
  } else {
    userNotLoggedIn(res);
  }
});




export const UserController: Router = router;
