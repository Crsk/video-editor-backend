import { Context } from 'hono'
import { AppEnvironment } from '../../../core/types/environment'
import { CreditService } from '../domain/credit.service'
import { attempt } from '../../../utils/attempt/http'

export class CreditController {
  constructor(private creditService: CreditService) {}

  async createCheckoutSession(c: Context<AppEnvironment>) {
    const [parseError, requestData] = await attempt(c.req.json())

    if (parseError) {
      console.error('Error parsing request JSON:', parseError)
      return c.json(
        {
          error: 'Invalid request format',
          message: parseError.message
        },
        400
      )
    }

    const { priceId, credits, teamId } = requestData
    const [serviceError, result] = await this.creditService.createCheckoutSession({ teamId, priceId, credits })

    if (serviceError) {
      console.error('Error creating checkout session:', serviceError)
      return c.json(
        {
          error: 'Failed to create checkout session',
          message: serviceError.message
        },
        serviceError.code
      )
    }

    return c.json({
      success: true,
      data: result
    })
  }

  async handleWebhook(c: Context<AppEnvironment>) {
    const [bodyError, body] = await attempt(c.req.text())

    if (bodyError || !body) {
      console.error('Error reading webhook body:', bodyError)
      return c.json(
        {
          success: false,
          data: {
            message: 'Failed to read request body',
            error: bodyError?.message || 'Empty body'
          }
        },
        400
      )
    }

    const signature = c.req.header('stripe-signature')

    const webhookSecret = c.env.STRIPE_WEBHOOK_SECRET

    console.log('Webhook received:', {
      bodyLength: body.length,
      hasSignature: !!signature,
      hasSecret: !!webhookSecret
    })

    if (!signature) {
      console.error('No stripe-signature header found')
      return c.json({ success: false, error: 'No signature provided' }, 400)
    }

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured')
      return c.json({ success: false, error: 'Webhook secret not configured' }, 500)
    }

    const [serviceError, data] = await this.creditService.handleWebhook(body, signature, webhookSecret)

    if (serviceError) {
      console.error('Webhook processing error:', serviceError)
      return c.json({ success: false, data: { error: serviceError.message } }, serviceError.code)
    }

    console.log('Webhook processed successfully:', data)
    return c.json({ success: true, data }, 200)
  }
}
