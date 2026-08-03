import { NextResponse } from 'next/server'

const transportServices = [
  {
    id: 'ground-transport',
    num: '01',
    title: 'Ground Transport',
    description: 'Climate-controlled vans with secure crating, water and rest stops, for trips across the city or across states.',
    tags: ['Door to door', 'Live GPS', 'Multi-pet'],
    image: '/images/service-ground.jpg'
  },
  {
    id: 'flight-escort',
    num: '02',
    title: 'Flight Escort',
    description: 'A dedicated handler flies with your pet — in-cabin or cargo-hold — from check-in to baggage claim.',
    tags: ['In-cabin', 'Cargo-hold', 'Airline liaison'],
    image: '/images/service-flight.jpg'
  },
  {
    id: 'international-relocation',
    num: '03',
    title: 'International Relocation',
    description: 'Import permits, health certificates and customs paperwork handled end to end for moving abroad.',
    tags: ['Customs', 'Permits', 'Quarantine support'],
    image: '/images/service-relocation.jpg'
  },
  {
    id: 'local-pet-taxi',
    num: '04',
    title: 'Local Pet Taxi',
    description: 'On-demand rides to the vet, groomer or daycare, booked in minutes with a tracked pickup window.',
    tags: ['Vet runs', 'Grooming', 'Same-day'],
    image: '/images/service-taxi.jpg'
  }
]

export async function GET(request, { params }) {
  const { id } = await params
  const service = transportServices.find(s => s.id === id)
  if (!service) {
    return NextResponse.json({ message: 'Service not found.' }, { status: 404 })
  }
  return NextResponse.json(service)
}