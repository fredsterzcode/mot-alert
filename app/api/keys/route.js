import { NextResponse } from 'next/server';
import { createApiKey, getUserApiKeys, revokeApiKey, getApiUsageStats } from '@/lib/api-keys';
import { requireAuth } from '@/lib/auth';

/**
 * API Key Management Endpoints
 */

// Create new API key
export async function POST(request) {
  try {
    const user = await requireAuth(request);
    const { tier, organizationName } = await request.json();

    if (!tier || !['BASIC', 'PREMIUM', 'ENTERPRISE'].includes(tier)) {
      return NextResponse.json(
        { error: 'Valid tier is required (BASIC, PREMIUM, ENTERPRISE)' },
        { status: 400 }
      );
    }

    const apiKey = await createApiKey(user.id, tier, organizationName);

    return NextResponse.json({
      success: true,
      message: 'API key created successfully',
      apiKey: {
        key: apiKey.api_key,
        tier: apiKey.tier,
        organizationName: apiKey.organization_name,
        createdAt: apiKey.created_at
      }
    });

  } catch (error) {
    console.error('API key creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create API key', details: error.message },
      { status: 500 }
    );
  }
}

// Get user's API keys
export async function GET(request) {
  try {
    const user = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const includeUsage = searchParams.get('includeUsage') === 'true';

    const apiKeys = await getUserApiKeys(user.id);

    if (includeUsage) {
      // Get usage stats for each key
      const keysWithUsage = await Promise.all(
        apiKeys.map(async (key) => {
          const usage = await getApiUsageStats(key.api_key, 30);
          return {
            ...key,
            usage: {
              totalRequests: usage.reduce((sum, day) => sum + day.request_count, 0),
              dailyAverage: Math.round(usage.reduce((sum, day) => sum + day.request_count, 0) / 30),
              lastUsed: usage[0]?.last_used || null
            }
          };
        })
      );
      return NextResponse.json({ success: true, apiKeys: keysWithUsage });
    }

    return NextResponse.json({ success: true, apiKeys });

  } catch (error) {
    console.error('API key retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to get API keys', details: error.message },
      { status: 500 }
    );
  }
}

// Revoke API key
export async function DELETE(request) {
  try {
    const user = await requireAuth(request);
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // Verify user owns this API key
    const userKeys = await getUserApiKeys(user.id);
    const keyExists = userKeys.some(key => key.api_key === apiKey);

    if (!keyExists) {
      return NextResponse.json(
        { error: 'API key not found or access denied' },
        { status: 404 }
      );
    }

    await revokeApiKey(apiKey);

    return NextResponse.json({
      success: true,
      message: 'API key revoked successfully'
    });

  } catch (error) {
    console.error('API key revocation error:', error);
    return NextResponse.json(
      { error: 'Failed to revoke API key', details: error.message },
      { status: 500 }
    );
  }
} 