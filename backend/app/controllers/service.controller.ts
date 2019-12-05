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
 * Get a Service by id
 * @param id of Service
 * @returns Service, if found
 */
router.get('/id=:id', async (req: Request, res: Response) => {
  const instance = await Service.findById(req.params.id);
  if (instance) {
    res.statusCode = 200;
    res.send(instance.toSimplification());
  } else {
    serviceNotFound(res);
  }
});

/**
 * Get your own Services
 * @param token JWT string as HTTP parameters
 * @returns Array of your own Services, message if not logged in
 */
router.get('/myServices/:token', async (req: Request, res: Response) => {
  const token = req.params.token;
  const verification = verify(token);
  if (verification) {
    const user = await decodeUser(token);
    if (user) {
      let instances: Array<Service> = await Service.findAll();
      instances = instances.filter(function search(element: Service) {
        if (element.username === user.username) {
          return element;
        }
      });
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
 * Get your all Services of a specific User
 * @param username of specific User
 * @returns Array of Services of specific User, message if User not found
 */
router.get('/servicesOf/:username', async (req: Request, res: Response) => {
  const username = req.params.username;
  const user = await User.findByPk(username);
  if (user) {
    let instances: Array<Service> = await Service.findAll();
    instances = instances.filter(function search(element: Service) {
      if (element.username === user.username) {
        return element;
      }
    });
    res.statusCode = 200;
    res.send(instances.map(e => e.toSimplification()));
  } else {
    userNotFound(res);
  }
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
          req.body.contactMail = user.email;
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
 * @param req contains search string for username, serviceName, priceMin (minimal Price), priceMax (maximal Price),
 * location and description.
 * If a parameter is empty, then every record within the parameter is valid (including NULL).
 * If priceMin is empty, it is set to 0; if priceMax is empty, it is set to MAX_VALUE.
 * @returns Array of corresponding services (may be empty)
 */
router.get('/search/' +
  'username=?:username' +
  '&serviceName=?:serviceName' +
  '&category=?:category' +
  '&priceMin=?:priceMin' +
  '&priceMax=?:priceMax' +
  '&location=?:location' +
  '&description=?:description', async (req: Request, res: Response) => {

  const username: RegExp = new RegExp((req.params.username === '=' ? '.*' : req.params.username.toLocaleLowerCase()));
  const serviceName: RegExp = new RegExp((req.params.serviceName === '=' ? '.*' : req.params.serviceName.toLocaleLowerCase()));
  const category: RegExp = new RegExp((req.params.category === '=' ? '.*' : req.params.category.toLocaleLowerCase()));
  const location: RegExp = new RegExp((req.params.location === '=' ? '.*' : req.params.location.toLocaleLowerCase()));
  const description = new RegExp((req.params.description === '=' ? '.*' : req.params.description.toLocaleLowerCase()));

  let priceMin = parseFloat(req.params.priceMin);
  let priceMax = parseFloat(req.params.priceMax);

  if (isNaN(priceMin)) {
    priceMin = 0;
  }
  if (isNaN(priceMax)) {
    priceMax = Number.MAX_VALUE;
  }

  function search(element: Service) {
    if ((req.params.category !== '=' && element.category === null)
      || (req.params.location !== '=' && element.location === null)
      || (req.params.description !== '=' && element.description === null)) {
      return;
    }

    if ((element.username.match(username))
      && (element.serviceName.toLocaleLowerCase().match(serviceName))
      && (element.category === null || element.category.toLocaleLowerCase().match(category))
      && (element.location === null || element.location.toLocaleLowerCase().match(location))
      && (element.description === null || element.description.toLocaleLowerCase().match(description))
      && (element.price >= priceMin.valueOf())
      && (element.price <= priceMax.valueOf())
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
 * Search within Services in any parameter
 * @param searchString as HTTP param
 * @returns Array of corresponding services (may be empty)
 */
router.get('/searchAny/:searchString', async (req: Request, res: Response) => {
  const searchString: RegExp = new RegExp(req.params.searchString.toLocaleLowerCase());

  function search(element: Service) {
    if (element.username.toLocaleLowerCase().match(searchString)
      || element.serviceName.toLocaleLowerCase().match(searchString)
      || (element.category !== null && element.category.toLocaleLowerCase().match(searchString))
      || (element.location !== null && element.location.toLocaleLowerCase().match(searchString))
      || (element.description !== null && element.description.toLocaleLowerCase().match(searchString))) {
      return element;
    }
  }

  let instances: Array<Service> = await Service.findAll();
  instances = instances.filter(search);
  res.statusCode = 200;
  res.send(instances.map(e => e.toSimplification()));
});

/**
 * Search within Services in any parameter (if no parameters are used)
 * @returns Array of all Services
 */
router.get('/searchAny/', async (req: Request, res: Response) => {
  const instances: Array<Service> = await Service.findAll();
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
