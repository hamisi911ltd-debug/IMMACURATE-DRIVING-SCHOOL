import express from 'express'
import { query } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = express.Router()

router.use(authenticate)

// List vehicles
router.get('/list', asyncHandler(async (req, res) => {
  const vehicles = query(`
    SELECT * FROM vehicles 
    WHERE status = 'active'
    ORDER BY registration_number
  `)

  res.json({
    success: true,
    vehicles,
    count: vehicles.length
  })
}))

export default router
