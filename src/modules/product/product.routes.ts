import { Router } from 'express';
// import { productController } from './product.controller';
// import { validate, authenticate, authorize } from '../../middlewares';

const router = Router();

/**
 * Product Routes
 *
 * Routes to be implemented:
 * GET    /             - List all products (public)
 * GET    /:id          - Get product by ID (public)
 * GET    /slug/:slug   - Get product by slug (public)
 * POST   /             - Create product (admin)
 * PUT    /:id          - Update product (admin)
 * DELETE /:id          - Delete product (admin)
 */

export { router as productRoutes };
