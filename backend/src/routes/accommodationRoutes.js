import { Router } from 'express'
import { search, countByPrice, priceDistribution } from '../controllers/accommodationController.js'

const router = Router()

router.get('/search', search)
router.get('/count', countByPrice)
router.get('/price-distribution', priceDistribution)

export default router
