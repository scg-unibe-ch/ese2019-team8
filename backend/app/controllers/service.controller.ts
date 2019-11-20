import {Request, Response, Router} from 'express';
import {Service} from '../models/service.model';
import {decodeUser, userNotFound, userNotLoggedIn, verify, forbidden, preconditionFailed} from './user.controller';
import {User} from '../models/user.model';

const router: Router = Router();

/**
 * send service to frontend
 */
function sendService(res: any, service: Service) {
  res.statusCode = 200;
  res.send(service.toSimplification());
}

/**
 * send "not approved" message to frontend
 */
export function notApproved(res: any) {
  res.statusCode = 403;
  res.json({
    'message': 'User not approved by admin'
  });
}

/**
 * Get all Services
 * @returns Array of all Services
 */
router.get('/', async (req: Request, res: Response) => {
  const instances = await Service.findAll();
  res.statusCode = 200;
  res.send(instances.map(e => e.toSimplification()));
});

/**
 * Create new Service
 * @param req MUST contain serviceName and token, can contain category, price, location, description
 * User has to be a service provider (isServiceProvider) and approved by admin (isApproved).
 * @returns message and, if created, service
 */
router.post('/', async (req: Request, res: Response) => {
  if (!req.body.serviceName) {
    preconditionFailed(res);
  }
  const token = req.body.token;
  const verification = verify(token);
  if (verification) {
    const user = await decodeUser(token);
    if (user) {
      if (user.isServiceProvider) {
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
        forbidden(res);
      }
    } else {
      userNotFound(res);
    }
  } else {
    userNotLoggedIn(res);
  }
});

/**
 * Send "service not found" message to frontend
 */
export function serviceNotFound(res: any) {
  res.statusCode = 404;
  res.json({
    'message': 'service not found'
  });
}

/**
 * Change parameters of an existing Service
 * @param req should contain token, id (of Service) and the parameters that should be changed.
 * (Parameters that aren't changed can be omitted.)
 * @returns message and, if successful, service
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

/**
 * delete existing service by owner
 * @param req should contain token and id (of service)
 * @returns message
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

/**
 * delete existing service by admin
 * @param req should contain token and id (of service)
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

/**
 * Search within Services
 * @param req //TODO
 * @returns Array of corresponding services (may be empty)
 */
router.get('/search/' +
  'any=?:any' +
  '&username=?:username' +
  '&serviceName=?:serviceName' +
  '&category=?:category' +
  '&location=?:location' +
  '&description=?:description', async (req: Request, res: Response) => {

  // const any: RegExp = new RegExp((req.params.any === '=' ? '.*' : req.params.any));
  const any: RegExp = new RegExp(req.params.any);
  const username: RegExp = new RegExp((req.params.username === '=' ? '.*' : req.params.username));
  const serviceName: RegExp = new RegExp((req.params.serviceName === '=' ? '.*' : req.params.serviceName));
  const category: RegExp = new RegExp((req.params.category === '=' ? '.*' : req.params.category));
  const location: RegExp = new RegExp((req.params.location === '=' ? '.*' : req.params.location));
  const description = new RegExp((req.params.description === '=' ? '.*' : req.params.description));

  // TODO price (min, max)
  // TODO correct implementation of the "any" parameter
  function search(element: Service) {
    if ((element.username.match(username) || element.username.match(any))
      && (element.serviceName.match(serviceName) || element.serviceName.match(any))
      && (element.category.match(category) || element.category.match(any))
      && (element.location.match(location) || element.location.match(any))
      && (element.description.match(description) || element.description.match(any))
    ) {
      return element;
    }
  }

  let instances: Array<Service> = await Service.findAll();
  instances = instances.filter(search);
  res.statusCode = 200;
  res.send(instances.map(e => e.toSimplification()));
});

/**
 * Deletes all Services of User
 * @param userObject User of which all Services will be deleted
 * When deleting a User, first all of the Services created by that User have to be deleted.
 * (Otherwise the Foreign Key constraint of the Service Model would fail.)
 */
export async function deleteAllServicesOfUser(userObject: User) {
  let instances: Array<Service> = await Service.findAll();
  instances = instances.filter(function search(element: Service) {
    if (element.username === userObject.username) {
      return element;
    }
  });
  instances.forEach(function (service) {
    service.destroy();
  });
}

export const ServiceController: Router = router;
