import {Router, Request, Response} from 'express';
import {User} from '../models/user.model';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  res.statusCode = 200;
  res.send('User get');
});

router.get('/:name', async (req: Request, res: Response) => {
  const name = req.params.name;
  res.statusCode = 200;
  res.send('Welcome to your Userpage ' + name);
});



export const UserController: Router = router;
