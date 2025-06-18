import Stripe from 'stripe'
import { CreditRepository } from '../infrastructure/credit.repository'
import { HttpError, Response, attempt } from '../../../utils/attempt/http'
import { v7 as uuid } from 'uuid'
import { withLogging } from '../../../utils/with-logging'

export class CreditService {
  constructor(private creditRepository: CreditRepository) {}

  async createCheckoutSession({
    teamId,
    priceId,
    credits
  }: {
    teamId: string
    priceId: string
    credits: number
  }): Promise<Response<{ url: string | null }>> {
    if (!process.env.STRIPE_SECRET_KEY) return [new HttpError('VALIDATION_ERROR', 'STRIPE_SECRET_KEY is not set'), null]

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const hostUrl = process.env.FRONT_URL

    const [error, session] = await attempt(
      stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: credits }],
        mode: 'payment',
        success_url: `${hostUrl}`,
        cancel_url: `${hostUrl}/pricing`,
        ui_mode: 'hosted',
        metadata: {
          teamId,
          credits
        }
      })
    )

    if (error) {
      console.error('Error creating Stripe checkout session:', error)
      return [new HttpError('INTERNAL_ERROR', 'Failed to create checkout session'), null]
    }

    console.log('Checkout session created:', session?.id)
    return [null, { url: session?.url || null }]
  }

  async handleWebhook(body: string, signature: string, webhookSecret: string): Promise<Response<any>> {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY environment variable is not set')
      return [new HttpError('VALIDATION_ERROR', 'STRIPE_SECRET_KEY is not set'), null]
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    console.log('Constructing webhook event with:', {
      bodyType: typeof body,
      bodyLength: body.length,
      signatureLength: signature.length,
      webhookSecretLength: webhookSecret.length
    })

    const [eventError, event] = await attempt(
      Promise.resolve(stripe.webhooks.constructEventAsync(body, signature, webhookSecret))
    )

    if (eventError) {
      console.error('Webhook event construction failed:', eventError)
      if (eventError.message.includes('signature')) {
        return [new HttpError('VALIDATION_ERROR', 'Invalid webhook signature'), null]
      }
      return [new HttpError('INTERNAL_ERROR', 'Failed to construct webhook event'), null]
    }

    console.log('Webhook event constructed successfully:', {
      type: event?.type,
      id: event?.id,
      created: event?.created
    })

    if (event?.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      console.log('Processing checkout.session.completed:', {
        sessionId: session.id,
        paymentStatus: session.payment_status,
        metadata: session.metadata
      })

      if (!session.metadata || !session.metadata.teamId || !session.metadata.credits) {
        console.error('Missing required metadata in checkout session:', session.metadata)
        return [new HttpError('VALIDATION_ERROR', 'Missing required metadata in checkout session'), null]
      }

      const { teamId, credits } = session.metadata
      const creditsAmount = parseInt(credits.toString())

      console.log('Creating credit record:', { teamId, creditsAmount })

      const [error, data] = await withLogging('Create credit', { teamId, credits: creditsAmount }, () =>
        this.creditRepository.createCredit({
          id: uuid(),
          teamId,
          amount: creditsAmount
        })
      )

      if (error) {
        console.error('Failed to create credit record:', error)
        return [new HttpError('INTERNAL_ERROR', 'Failed to create credit'), null]
      }

      console.log('Credit record created successfully:', data)
      return [null, { creditCreated: data, sessionId: session.id }]
    } else {
      console.log('Unhandled webhook event type:', event?.type)
      return [null, { message: `Unhandled event type: ${event?.type}` }]
    }
  }

  async getTeamCredits({ teamId }: { teamId: string }): Promise<Response<number>> {
    return this.creditRepository.getTeamCreditBalance({ teamId })
  }
}
