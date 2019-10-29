import {Router, Request, Response} from 'express';
import {User} from '../models/user.model';
import {TodoList} from '../models/todolist.model';

const router: Router = Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;

/* used later for sessionmanagement
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = 'LirumLarumLoeffelstiel';
const EXPIRATION_TIME = () => {return Math.floor(Date.now() / 1000) + (60 * 60)};
*/

router.get('/', async (req: Request, res: Response) => {
  const instances = await User.findAll();
  res.statusCode = 200;
  res.send(instances.map(e => e.toSimplification()));
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
