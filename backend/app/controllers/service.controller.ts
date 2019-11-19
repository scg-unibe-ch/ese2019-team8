import {Request, Response, Router} from 'express';
import {Service} from '../models/service.model';
import {decodeUser, userNotFound, userNotLoggedIn, verify, forbidden} from './user.controller';

const router: Router = Router();

/*
send service to frontend
 */
function sendService(res: any, service: Service) {
  res.statusCode = 200;
  res.send(service.toSimplification());
}

/*
send "not approved" message to frontend
 */
export function notApproved(res: any) {
  res.statusCode = 403;
  res.json({
    'message': 'User not approved by admin'
  });
}

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
  const token = req.body.token;
  const verification = verify(token);
  if (verification) {
    const user = await decodeUser(token);
    if (user) {
      if (user.isApproved) {
        const instance = new Service();
        req.body.username = user.username;
        instance.fromSimplification(req.body);
        await instance.save();
        res.statusCode = 201;
        res.send(instance.toSimplification());
      } else {
        notApproved(res);
      }
    } else {
      userNotFound(res);
    }
  } else {
    userNotLoggedIn(res);
  }
});

/*
Send "service not found" message to frontend
 */
export function serviceNotFound(res: any) {
  res.statusCode = 404;
  res.json({
    'message': 'service not found'
  });
}

/*
Change parameters of an existing Service
 */
router.put('/', async (req: Request, res: Response) => {
  const token = req.body.token;
  const verification = verify(token);
  if (verification) {
    const user = await decodeUser(token);
    if (user) {
      const service = await Service.findByPrimary(req.body.id);
      if (!service) {
        serviceNotFound(res);
        return;
      }
      if (service.username !== user.username) {
        forbidden(res);
        return;
      }
      req.body.username = service.username;
      service.fromSimplification(req.body);
      try {
        await service.save();
      } catch (err) {
      }
      sendService(res, service);
    } else {
      userNotFound(res);
    }
  } else {
    userNotLoggedIn(res);
  }
});

/*
delete existing service by owner
 */
router.delete('/', async (req: Request, res: Response) => {
  const token = req.body.token;
  const verification = verify(token);
  if (verification) {
    const user = await decodeUser(token);
    if (user) {
      const service = await Service.findByPrimary(req.body.id);
      if (!service) {
        serviceNotFound(res);
        return;
      }
      if (service.username !== user.username) {
        forbidden(res);
        return;
      }
      await service.destroy();
      res.statusCode = 200;
      res.json({
        'message': 'service successfully deleted'
      });
    } else {
      userNotFound(res);
    }
  } else {
    userNotLoggedIn(res);
  }
});

/*
delete existing service by owner
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
      const service = await Service.findByPrimary(req.body.id);
      if (!service) {
        serviceNotFound(res);
        return;
      }
      await service.destroy();
      res.statusCode = 200;
      res.json({
        'message': 'service successfully deleted'
      });
    } else {
      userNotFound(res);
    }
  } else {
    userNotLoggedIn(res);
  }
});

export const ServiceController: Router = router;
