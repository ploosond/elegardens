import { getPayload } from 'payload'
import config from '@payload-config'

import products from '../data/products.json'

async function run() {
  try {
    const payload = await getPayload({ config })

    // Delete all existing products first
    console.log('🗑️  Deleting all existing products...')
    const existingProducts = await payload.find({
      collection: 'products',
      limit: 1000, // Get all products
    })

    if (existingProducts.docs.length > 0) {
      for (const product of existingProducts.docs) {
        await payload.delete({
          collection: 'products',
          id: product.id,
        })
      }
      console.log(`✅ Deleted ${existingProducts.docs.length} existing products`)
    } else {
      console.log('ℹ️  No existing products to delete')
    }

    // Seed new products
    console.log(`\n🌱 Seeding ${products.length} products...`)

    for (const product of products) {
      try {
        // Ensure availability is set (default to 'available' if not present)
        const productData: any = {
          ...product,
          availability: (product as any).availability || 'available',
        }
        
        console.log(`Creating: ${product.slug} (${productData.productId})`)
        await payload.create({
          collection: 'products',
          data: productData,
        })
      } catch (error: any) {
        console.error(`\n❌ Failed to create product:`)
        console.error(`   Product ID: ${(product as any).productId}`)
        console.error(`   Slug: ${product.slug}`)
        console.error(
          `   Name: ${
            (product as any).common_name ||
            (product as any).common_name_en ||
            (product as any).common_name_de
          }`,
        )
        console.error(`   Error: ${error.message || JSON.stringify(error)}`)
        throw error // Stop on first error to identify the duplicate
      }
    }

    console.log(`\n✅ Successfully seeded ${products.length} products!`)
  } catch (error: any) {
    console.error('Error details:')
    console.error(JSON.stringify(error, null, 2))
    if (error.message) {
      console.error('Message:', error.message)
    }
    if (error.stack) {
      console.error('Stack:', error.stack)
    }
    process.exit(1)
  }

  process.exit(0)
}

await run()
