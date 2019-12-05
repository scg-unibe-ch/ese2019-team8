import {Router, Request, Response} from 'express';
import {User} from '../models/user.model';
import {deleteAllServicesOfUser} from './service.controller';

const router: Router = Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = 'LirumLarumLoeffelstiel';
const EXPIRATION_TIME = () => Math.floor(Date.now() / 1000) + (60 * 60);

/**
 * Creates a hard-coded admin the first time it is called.
 * The admin has the username 'admin1' and the password 'admin1'.
 */
router.post('/createAdmin', async (req: Request, res: Response) => {
  const user = await User.findByPk('admin1');
  if (user) {
    res.statusCode = 200;
    res.json({
      'message': 'admin already exists'
    });
  } else {
    const admin = new User();
    admin.username = 'admin1';
    admin.email = 'admin@admin.admin';
    admin.passwordHash = await bcrypt.hash('admin1', saltRounds);
    admin.isApproved = true;
    admin.isServiceProvider = true;
    admin.isAdmin = true;
    await admin.save();
    res.statusCode = 201;
    res.json({
      'message': 'admin created'
    });
  }
});

/**
 * Get Array of all Users with all informations (admin only)
 * @param token JWT string as HTTP parameters
 * @returns message or, if logged in admin, profile of all users
 */
router.get('/allUsers/:token', async (req: Request, res: Response) => {
  const token = req.params.token;
  const verification = verify(token);
  if (verification) {
    const user = await decodeUser(token);
    if (user) {
      if (!user.isAdmin) {
        forbidden(res);
        return;
      }
      const instances = await User.findAll();
      res.statusCode = 200;
      res.send(instances.map(e => e.toSimplification()));
    } else {
      userNotFound(res);
    }
  } else {
    userNotLoggedIn(res);
  }
});

/**
 * Login
 * @param req body should contain username and password.
 * @returns a message and, if login is successful, a JWT (token).
 * Frontend should save token in the local storage of the user.
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

/**
 * Verifies a JWT
 * @param token JWT string
 * @returns true, if token is verified; false otherwise
 */
export function verify(token: string) {
  let verification = false;
  try {
    verification = jwt.verify(token, PRIVATE_KEY);
  } catch (err) {
  }
  return verification;
}

/**
 * Get the user from a JWT
 * internal function
 * @param token jWT string of a verified user
 * @returns corresponding User object
 */
export async function decodeUser(token: string) {
  const payload = jwt.decode(token);
  const username = payload.username;
  return await User.findByPk(username);
}

/**
 * Send "not logged in" message to frontend
 */
export function userNotLoggedIn(res: any) {
  res.statusCode = 403;
  res.json({
    'message': 'not logged in'
  });
}

/**
 * Send "precondition failed" message to frontend
 */
export function preconditionFailed(res: any) {
  res.statusCode = 412;
  res.json({
    'message': 'precondition failed'
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

/**
 * send "forbidden" message to frontend
 */
export function forbidden(res: any) {
  res.statusCode = 403;
  res.json({
    'message': 'forbidden'
  });
}

/**
 * send user profile to frontend
 */
function userProfile(res: any, user: User) {
  res.statusCode = 200;
  res.send(user.toSimplification());
}

/**
 * Get user information
 * @param token JWT string as HTTP parameter
 * @returns message and, if logged in, profile of user
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

/**
 * Change parameters of an existing User
 * @param req should contain token and the parameters that should be changed.
 * (Parameters that aren't changed can be omitted.)
 * @returns message and, if successful, user
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
      try {
        await user.save();
      } catch (err) {
      }
      userProfile(res, user);
    } else {
      userNotFound(res);
    }
  } else {
    userNotLoggedIn(res);
  }
});

/**
 * Create a new User
 * @param req body MUST contain username and password, can contain isServiceProvider (boolean), email, address, zip, city, phoneNumber
 * @returns message and, if registration successful, User
 */
router.post('/', async (req: Request, res: Response) => {
  if (!req.body.username || !req.body.password) {
    preconditionFailed(res);
  }
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

/**
 * delete user by user him-/herself
 * @param req should contain token
 * @returns message
 */
router.delete('/profile', async (req: Request, res: Response) => {
  const token = req.body.token;
  const verification = verify(token);
  if (verification) {
    const user = await decodeUser(token);
    if (user) {
      await deleteAllServicesOfUser(user);
      setTimeout(async function () {
        await user.destroy();
      }, 100);
      res.statusCode = 200;
      res.json({
        'message': 'user successfully deleted'
      });
      return;
    } else {
      userNotFound(res);
    }
  } else {
    userNotLoggedIn(res);
  }
});

/**
 * Set isApproved by admin
 * @param req should contain token (of admin), username (of objectUser) and isApproved (boolean)
 * @returns message
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
        try {
          await objectUser.save();
        } catch (err) {
        }
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

/**
 * delete user by admin
 * @param req should contain token (of admin) and username (of objectUser)
 * @returns message
 */
router.delete('/admin', async (req: Request, res: Response) => {
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
        await deleteAllServicesOfUser(objectUser);
        setTimeout(async function () {
          await objectUser.destroy();
        }, 100);
        res.statusCode = 200;
        res.json({
          'message': 'user successfully deleted'
        });
        return;
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
