import {
  findBySearch,
  countByPriceRange,
  getPriceDistribution,
} from '../repositories/accommodationRepository.js'

export async function searchAccommodations({ destination, guests, checkIn, checkOut, type, minPrice, maxPrice }) {
  return findBySearch({ destination, minGuests: Number(guests) || 0, checkIn, checkOut, type, minPrice, maxPrice })
}

export async function getCountByPriceRange({ destination, guests, minPrice, maxPrice }) {
  return countByPriceRange({
    destination,
    minGuests: Number(guests) || 0,
    minPrice,
    maxPrice,
  })
}

export async function getPriceDistributionData({ destination, guests }) {
  return getPriceDistribution({ destination, minGuests: Number(guests) || 0 })
}
