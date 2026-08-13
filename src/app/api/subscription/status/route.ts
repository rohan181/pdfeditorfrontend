import { auth } from '@clerk/nextjs/server'
import { getUserSubscription } from '@/lib/subscription'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const tier = await getUserSubscription(userId)
  return Response.json({ tier })
}
