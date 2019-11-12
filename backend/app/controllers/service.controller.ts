import {Request, Response, Router} from 'express';
import {Service} from '../models/service.model';

const router: Router = Router();

/*
Get all Services
 */
router.get('/', async (req: Request, res: Response) => {
  const instances = await Service.findAll();
  res.statusCode = 200;
  res.send(instances.map(e => e.toSimplification()));
});

/*
Post new Service
 */
router.post('/', async (req: Request, res: Response) => {
  // TODO check preconditions (existing user etc.)

  const instance = new Service();
  instance.fromSimplification(req.body);
  await instance.save();
  res.statusCode = 201;
  res.send(instance.toSimplification());
});

export const ServiceController: Router = router;
