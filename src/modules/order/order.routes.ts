import { Router } from 'express';
// import { orderController } from './order.controller';
// import { validate, authenticate, authorize } from '../../middlewares';

const router = Router();

/**
 * Order Routes
 *
 * Routes to be implemented:
 * GET    /             - List all orders (admin)
 * GET    /my-orders    - List current user's orders
 * GET    /:id          - Get order by ID
 * POST   /             - Create new order
 * PATCH  /:id/status   - Update order status (admin)
 * POST   /:id/cancel   - Cancel order
 */

export { router as orderRoutes };
