# MOT Alert API Documentation

## Overview
The MOT Alert API provides access to vehicle MOT information, reminders, and management services. The API is RESTful and uses JSON for data exchange.

## Authentication
All API requests require an API key to be included in the request headers:

```
X-API-Key: mot_premium_abc123_xyz789
```

Or using Authorization header:
```
Authorization: Bearer mot_premium_abc123_xyz789
```

## API Tiers

### Basic Tier (Free)
- **Rate Limit**: 100 requests/day
- **Endpoints**: Vehicle lookup, MOT check
- **Cost**: Free

### Premium Tier (£199/month)
- **Rate Limit**: 10,000 requests/day
- **Endpoints**: All basic + bulk operations, user management
- **Cost**: £199/month

### Enterprise Tier (£499/month)
- **Rate Limit**: 100,000 requests/day
- **Endpoints**: Everything + custom integrations, dedicated support
- **Cost**: £499/month

## Endpoints

### 1. Vehicle MOT Check
**GET** `/api/v1/vehicle`

Get MOT information for a specific vehicle registration.

**Parameters:**
- `registration` (required): Vehicle registration number

**Example Request:**
```bash
curl -X GET "https://your-site.vercel.app/api/v1/vehicle?registration=ABC123" \
  -H "X-API-Key: mot_basic_abc123_xyz789"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "registration": "ABC123",
    "motStatus": "Valid",
    "motExpiryDate": "2024-12-31",
    "lastTestDate": "2023-12-15",
    "mileage": "45,000",
    "make": "Ford",
    "model": "Focus",
    "year": "2019",
    "color": "Blue",
    "fuelType": "Petrol",
    "engineSize": "1.0L",
    "advisories": [
      "Nearside front tyre worn close to legal limit",
      "Offside rear brake disc worn"
    ],
    "failures": [],
    "testResult": "PASS"
  },
  "usage": {
    "remaining": 95,
    "tier": "BASIC"
  }
}
```

### 2. Bulk Vehicle Processing
**POST** `/api/v1/bulk`

Process multiple vehicles at once (Premium/Enterprise tier only).

**Request Body:**
```json
{
  "registrations": ["ABC123", "DEF456", "GHI789"],
  "operation": "mot_check"
}
```

**Example Request:**
```bash
curl -X POST "https://your-site.vercel.app/api/v1/bulk" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: mot_premium_abc123_xyz789" \
  -d '{
    "registrations": ["ABC123", "DEF456", "GHI789"],
    "operation": "mot_check"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "processed": 3,
    "results": [
      {
        "registration": "ABC123",
        "status": "processed",
        "motStatus": "Valid",
        "motExpiryDate": "2024-12-31",
        "lastTestDate": "2023-12-15",
        "make": "Ford",
        "model": "Focus",
        "year": "2019"
      }
    ],
    "operation": "mot_check"
  },
  "usage": {
    "remaining": 9995,
    "tier": "PREMIUM"
  }
}
```

## API Key Management

### Create API Key
**POST** `/api/keys`

Create a new API key for your account.

**Request Body:**
```json
{
  "tier": "PREMIUM",
  "organizationName": "My Garage Ltd"
}
```

**Example Request:**
```bash
curl -X POST "https://your-site.vercel.app/api/keys" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-session-token" \
  -d '{
    "tier": "PREMIUM",
    "organizationName": "My Garage Ltd"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "message": "API key created successfully",
  "apiKey": {
    "key": "mot_premium_abc123_xyz789",
    "tier": "PREMIUM",
    "organizationName": "My Garage Ltd",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get API Keys
**GET** `/api/keys`

Get all API keys for your account.

**Parameters:**
- `includeUsage` (optional): Include usage statistics

**Example Request:**
```bash
curl -X GET "https://your-site.vercel.app/api/keys?includeUsage=true" \
  -H "Authorization: Bearer your-session-token"
```

**Example Response:**
```json
{
  "success": true,
  "apiKeys": [
    {
      "id": 1,
      "api_key": "mot_premium_abc123_xyz789",
      "tier": "PREMIUM",
      "organization_name": "My Garage Ltd",
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z",
      "usage": {
        "totalRequests": 1500,
        "dailyAverage": 50,
        "lastUsed": "2024-01-15T09:45:00Z"
      }
    }
  ]
}
```

### Revoke API Key
**DELETE** `/api/keys`

Revoke an API key.

**Request Body:**
```json
{
  "apiKey": "mot_premium_abc123_xyz789"
}
```

**Example Request:**
```bash
curl -X DELETE "https://your-site.vercel.app/api/keys" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-session-token" \
  -d '{
    "apiKey": "mot_premium_abc123_xyz789"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "message": "API key revoked successfully"
}
```

## Error Responses

### Rate Limit Exceeded
```json
{
  "error": "Rate limit exceeded. 100/100 requests used today.",
  "status": 429
}
```

### Invalid API Key
```json
{
  "error": "API key required",
  "status": 401
}
```

### Insufficient Permissions
```json
{
  "error": "Bulk operations require Premium or Enterprise tier",
  "status": 403
}
```

## Rate Limits

| Tier | Requests/Day | Bulk Limit |
|------|-------------|------------|
| Basic | 100 | N/A |
| Premium | 10,000 | 100 vehicles |
| Enterprise | 100,000 | Unlimited |

## Webhooks (Enterprise Only)

Enterprise customers can receive webhooks for real-time updates:

**Webhook URL**: `https://your-site.vercel.app/api/webhooks`

**Events**:
- `vehicle.mot_expiring`: MOT due within 30 days
- `vehicle.mot_expired`: MOT has expired
- `bulk.processing_complete`: Bulk operation completed

## SDKs and Libraries

### JavaScript/Node.js
```javascript
const MOTAlertAPI = require('mot-alert-api');

const api = new MOTAlertAPI('mot_premium_abc123_xyz789');

// Get vehicle MOT info
const vehicle = await api.getVehicle('ABC123');
console.log(vehicle.motStatus);

// Bulk processing
const results = await api.bulkProcess(['ABC123', 'DEF456']);
console.log(results.processed);
```

### Python
```python
import mot_alert_api

api = mot_alert_api.Client('mot_premium_abc123_xyz789')

# Get vehicle MOT info
vehicle = api.get_vehicle('ABC123')
print(vehicle['motStatus'])

# Bulk processing
results = api.bulk_process(['ABC123', 'DEF456'])
print(results['processed'])
```

## Support

For API support:
- **Email**: api@mot-alert.com
- **Documentation**: https://docs.mot-alert.com
- **Status Page**: https://status.mot-alert.com

Enterprise customers receive priority support with dedicated account managers. 