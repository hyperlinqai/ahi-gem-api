import { Router } from 'express';
// import { cartController } from './cart.controller';
// import { validate, authenticate } from '../../middlewares';

const router = Router();

/**
 * Cart Routes
 *
 * Routes to be implemented:
 * GET    /             - Get current user's cart
 * POST   /items        - Add item to cart
 * PUT    /items/:itemId - Update cart item quantity
 * DELETE /items/:itemId - Remove item from cart
 * DELETE /             - Clear entire cart
 */

export { router as cartRoutes };
