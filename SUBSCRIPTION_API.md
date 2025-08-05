# Subscription API Documentation

## Overview

The Subscription API provides endpoints for managing Stripe subscriptions, including creation, cancellation, upgrades, and customer portal access.

## Base URL

```
https://your-domain.vercel.app/api/subscriptions
```

## Authentication

All endpoints require proper error handling and validation. No authentication headers are required as this is a public API.

## Endpoints

### 1. Create Subscription

**POST** `/api/subscriptions/create`

Creates a new subscription for a customer.

#### Request Body
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "planType": "premium"
}
```

#### Plan Types
- `premium` - £2.99/month
- `whitelabel` - £49.99/month
- `api_premium` - £199/month
- `api_enterprise` - £499/month

#### Response
```json
{
  "success": true,
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

#### Example
```bash
curl -X POST https://your-domain.vercel.app/api/subscriptions/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "planType": "premium"
  }'
```

### 2. Cancel Subscription

**POST** `/api/subscriptions/cancel`

Cancels an existing subscription.

#### Request Body
```json
{
  "subscriptionId": "sub_1234567890"
}
```

#### Response
```json
{
  "success": true,
  "message": "Subscription cancelled successfully",
  "subscription": {
    "id": "sub_1234567890",
    "status": "active",
    "cancelAtPeriodEnd": true
  }
}
```

#### Example
```bash
curl -X POST https://your-domain.vercel.app/api/subscriptions/cancel \
  -H "Content-Type: application/json" \
  -d '{
    "subscriptionId": "sub_1234567890"
  }'
```

### 3. Get Subscription Details

**GET** `/api/subscriptions/cancel?id=sub_1234567890`

Retrieves details of a specific subscription.

#### Query Parameters
- `id` (required) - Subscription ID

#### Response
```json
{
  "success": true,
  "subscription": {
    "id": "sub_1234567890",
    "status": "active",
    "currentPeriodStart": 1640995200,
    "currentPeriodEnd": 1643673600,
    "cancelAtPeriodEnd": false,
    "items": [
      {
        "priceId": "price_1ABC123...",
        "quantity": 1
      }
    ]
  }
}
```

#### Example
```bash
curl "https://your-domain.vercel.app/api/subscriptions/cancel?id=sub_1234567890"
```

### 4. Manage Subscriptions

**GET** `/api/subscriptions/manage?email=user@example.com`

Retrieves all subscriptions for a customer.

#### Query Parameters
- `email` (required) - Customer email

#### Response
```json
{
  "success": true,
  "customer": {
    "id": "cus_1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "created": 1640995200
  },
  "subscriptions": [
    {
      "id": "sub_1234567890",
      "status": "active",
      "currentPeriodStart": 1640995200,
      "currentPeriodEnd": 1643673600,
      "cancelAtPeriodEnd": false,
      "items": [
        {
          "priceId": "price_1ABC123...",
          "quantity": 1
        }
      ]
    }
  ]
}
```

#### Example
```bash
curl "https://your-domain.vercel.app/api/subscriptions/manage?email=user@example.com"
```

### 5. Update Customer

**PUT** `/api/subscriptions/manage`

Updates customer information.

#### Request Body
```json
{
  "email": "user@example.com",
  "updates": {
    "name": "John Smith",
    "metadata": {
      "company": "Acme Corp"
    }
  }
}
```

#### Response
```json
{
  "success": true,
  "customer": {
    "id": "cus_1234567890",
    "email": "user@example.com",
    "name": "John Smith",
    "updated": true
  }
}
```

#### Example
```bash
curl -X PUT https://your-domain.vercel.app/api/subscriptions/manage \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "updates": {
      "name": "John Smith"
    }
  }'
```

### 6. Upgrade/Downgrade Subscription

**POST** `/api/subscriptions/upgrade`

Changes a subscription to a different plan.

#### Request Body
```json
{
  "email": "user@example.com",
  "newPlanType": "api_premium",
  "subscriptionId": "sub_1234567890"
}
```

#### Response
```json
{
  "success": true,
  "message": "Subscription upgraded successfully",
  "subscription": {
    "id": "sub_1234567890",
    "status": "active",
    "currentPeriodStart": 1640995200,
    "currentPeriodEnd": 1643673600,
    "items": [
      {
        "priceId": "price_1GHI789...",
        "quantity": 1
      }
    ]
  }
}
```

#### Example
```bash
curl -X POST https://your-domain.vercel.app/api/subscriptions/upgrade \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "newPlanType": "api_premium",
    "subscriptionId": "sub_1234567890"
  }'
```

### 7. Get Current Plan

**GET** `/api/subscriptions/upgrade?id=sub_1234567890`

Retrieves the current plan type for a subscription.

#### Query Parameters
- `id` (required) - Subscription ID

#### Response
```json
{
  "success": true,
  "subscription": {
    "id": "sub_1234567890",
    "status": "active",
    "currentPlan": "premium",
    "currentPeriodStart": 1640995200,
    "currentPeriodEnd": 1643673600,
    "cancelAtPeriodEnd": false
  }
}
```

#### Example
```bash
curl "https://your-domain.vercel.app/api/subscriptions/upgrade?id=sub_1234567890"
```

### 8. Customer Portal

**POST** `/api/subscriptions/portal`

Creates a customer portal session for self-service management.

#### Request Body
```json
{
  "email": "user@example.com"
}
```

#### Response
```json
{
  "success": true,
  "url": "https://billing.stripe.com/session/..."
}
```

#### Example
```bash
curl -X POST https://your-domain.vercel.app/api/subscriptions/portal \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

## Error Responses

All endpoints return consistent error responses:

### 400 Bad Request
```json
{
  "error": "Email and plan type are required"
}
```

### 404 Not Found
```json
{
  "error": "User not found or no subscription"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to create subscription",
  "details": "Error message details"
}
```

## Webhook Events

The following webhook events are handled:

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## Rate Limiting

- **API requests**: 1000 requests per 15 minutes
- **Subscription creation**: 10 per minute per IP
- **Customer portal**: 5 sessions per minute per customer

## Testing

### Test Cards (Stripe Test Mode)

- **Success**: `4242424242424242`
- **Decline**: `4000000000000002`
- **Insufficient funds**: `4000000000009995`

### Test Subscription Flow

1. **Create subscription** with test card
2. **Verify webhook** events are received
3. **Test cancellation** and upgrades
4. **Verify customer portal** access

## Security Considerations

- **Webhook verification** is required
- **Price ID validation** prevents unauthorized access
- **Customer ID validation** ensures data isolation
- **Error logging** for monitoring and debugging

## Support

For issues with the Subscription API:

1. **Check Vercel logs** for error details
2. **Verify Stripe configuration** in dashboard
3. **Test with Stripe CLI** for local development
4. **Review webhook logs** for event processing issues 