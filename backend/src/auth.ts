export const STEAM_OPENID_URL = 'https://steamcommunity.com/openid/login';

/**
 * Generates the Steam OpenID login URL.
 */
export function buildSteamAuthUrl(returnUrl: string, realm: string): string {
    const params = new URLSearchParams({
        'openid.ns': 'http://specs.openid.net/auth/2.0',
        'openid.mode': 'checkid_setup',
        'openid.return_to': returnUrl,
        'openid.realm': realm,
        'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
        'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
    });
    return `${STEAM_OPENID_URL}?${params.toString()}`;
}

/**
 * Verifies the Steam OpenID assertion.
 * Returns the 64-bit Steam ID if valid, null otherwise.
 */
export async function verifySteamAssertion(urlParams: URLSearchParams): Promise<string | null> {
    const params = new URLSearchParams(urlParams);
    params.set('openid.mode', 'check_authentication');

    const response = await fetch(STEAM_OPENID_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    });

    const text = await response.text();
    if (text.includes('is_valid:true')) {
        // Extract Steam ID from claimed_id
        // Format: https://steamcommunity.com/openid/id/76561198000000000
        const claimedId = urlParams.get('openid.claimed_id');
        const matches = claimedId?.match(/\/id\/(\d+)/);
        return matches ? matches[1] : null;
    }
    return null;
}

/**
 * Fetches user summary (avatar, name) from Steam API.
 */
export async function getSteamUserSummary(steamId: string, apiKey: string) {
    const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`;
    try {
        const res = await fetch(url);
        const data = await res.json() as any;
        return data?.response?.players?.[0] || null;
    } catch (e) {
        console.error('Failed to fetch Steam profile:', e);
        return null;
    }
}
