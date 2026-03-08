import { getPayload } from 'payload'
import { seed } from './src/endpoints/seed'
import config from './src/payload.config'

const runSeed = async () => {
    try {
        const payload = await getPayload({ config })
        await seed({ payload, req: {} as any })
        console.log('Seeding complete')
        process.exit(0)
    } catch (error) {
        console.error('Seeding failed', error)
        process.exit(1)
    }
}

runSeed()
