import { NextResponse } from 'next/server';

const DNS_LOOKUP_TIMEOUT_MS = 10000;

/**
 * DNS-over-HTTPS (DoH) resolvers – reliable HTTP-based lookups.
 * No UDP, no EREFUSED/ETIMEOUT from restrictive networks.
 * Format: GET ?name=example.com&type=A, Accept: application/dns-json
 */
const DOH_RESOLVERS = {
    cloudflare: {
        url: 'https://cloudflare-dns.com/dns-query',
        location: 'Cloudflare (Global)',
        country: 'us',
        coords: [39.0, -98.0],
    },
    google: {
        url: 'https://dns.google/resolve',
        location: 'Google DNS (Global)',
        country: 'us',
        coords: [37.3861, -122.0839],
    },
    quad9: {
        url: 'https://dns.quad9.net/dns-query',
        location: 'Quad9 (Global)',
        country: 'us',
        coords: [37.8715, -122.2730],
    },
    adguard: {
        url: 'https://dns.adguard.com/dns-query',
        location: 'AdGuard (Global)',
        country: 'eu',
        coords: [52.3676, 4.9041],
    },
    opendns: {
        url: 'https://doh.opendns.com/dns-query',
        location: 'OpenDNS (Global)',
        country: 'us',
        coords: [37.7749, -122.4194],
    },
    cleanbrowsing: {
        url: 'https://doh.cleanbrowsing.org/dns-query',
        location: 'CleanBrowsing (Global)',
        country: 'us',
        coords: [34.0, -84.0],
    },
    mullvad: {
        url: 'https://doh.dns.mullvad.net/dns-query',
        location: 'Mullvad (EU)',
        country: 'se',
        coords: [59.3293, 18.0686],
    },
    yandex: {
        url: 'https://dns.yandex.com/dns-query',
        location: 'Yandex DNS (Russia)',
        country: 'ru',
        coords: [55.7558, 37.6173],
    },
    alibaba: {
        url: 'https://dns.alidns.com/resolve',
        location: 'Alibaba DNS (China)',
        country: 'cn',
        coords: [30.2741, 120.1551],
    },
    controlli: {
        url: 'https://doh.controld.com/dns-query',
        location: 'Control D (Global)',
        country: 'us',
        coords: [40.0, -74.0],
    },
    nextdns: {
        url: 'https://dns.nextdns.io/dns-query',
        location: 'NextDNS (Global)',
        country: 'us',
        coords: [37.0, -95.0],
    },
    level3: {
        url: 'https://doh.centraleu.pi-dns.pi-dns.com/dns-query',
        location: 'Pi-DNS (EU)',
        country: 'de',
        coords: [51.3397, 12.3731],
    },
};

const cleanHostname = (input) => {
    if (!input) return '';
    let cleaned = input.trim().toLowerCase();
    cleaned = cleaned.replace(/^(https?|ftp):\/\//, '');
    cleaned = cleaned.replace(/^www\./, '');
    cleaned = cleaned.split('/')[0];
    cleaned = cleaned.split('?')[0];
    cleaned = cleaned.split(':')[0];
    return cleaned;
};

/**
 * Fetch DNS record via DoH JSON API.
 * Returns same shape as before: { Status, Answer: [{ name, type, data }], ... }
 */
async function fetchDoH(hostname, recordType, resolverId) {
    const resolver = DOH_RESOLVERS[resolverId];
    if (!resolver) return null;

    const url = new URL(resolver.url);
    url.searchParams.set('name', hostname);
    url.searchParams.set('type', recordType);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DNS_LOOKUP_TIMEOUT_MS);

    try {
        const res = await fetch(url.toString(), {
            headers: { Accept: 'application/dns-json' },
            signal: controller.signal,
        });
        clearTimeout(timeout);
        if (!res.ok) return null;
        const data = await res.json();
        // DoH JSON uses Status, Answer[].data – same as our format
        return data;
    } catch {
        clearTimeout(timeout);
        return null;
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('name') || searchParams.get('domain');
    const recordType = (searchParams.get('type') || 'A').toUpperCase();
    const resolverId = searchParams.get('resolver');

    if (!domain) {
        return NextResponse.json({ error: 'Domain is required.' }, { status: 400 });
    }

    const hostname = cleanHostname(domain);
    if (!hostname) {
        return NextResponse.json({ error: 'Invalid hostname.' }, { status: 400 });
    }

    const validTypes = ['A', 'AAAA', 'MX', 'CNAME', 'TXT', 'NS', 'SOA', 'PTR'];
    if (!validTypes.includes(recordType)) {
        return NextResponse.json({
            Status: 2,
            Answer: [],
            Comment: 'Unsupported record type.',
            Domain: hostname,
            Type: recordType,
        });
    }

    // Prefer DoH when resolver id is provided
    if (resolverId && DOH_RESOLVERS[resolverId]) {
        const data = await fetchDoH(hostname, recordType, resolverId);
        if (data && typeof data.Status === 'number') {
            return NextResponse.json({
                Status: data.Status,
                Answer: Array.isArray(data.Answer) ? data.Answer : [],
                Domain: hostname,
                Type: recordType,
                Resolver: resolverId,
            });
        }
        return NextResponse.json({
            Status: 2,
            Answer: [],
            Domain: hostname,
            Type: recordType,
            Comment: 'DNS-over-HTTPS request failed or timed out.',
            Resolver: resolverId,
        });
    }

    // Fallback: legacy IP-based lookup (Node dns) when resolver is not DoH
    const resolverIp = searchParams.get('ip');
    if (!resolverIp) {
        return NextResponse.json({
            Status: 2,
            Answer: [],
            Domain: hostname,
            Type: recordType,
            Comment: 'Missing resolver. Use ?resolver=cloudflare or ?ip=8.8.8.8',
        });
    }

    const { Resolver } = await import('dns');
    const { promisify } = await import('util');

    const resolver = new Resolver();
    resolver.setServers([resolverIp]);

    const resolve4 = promisify(resolver.resolve4.bind(resolver));
    const resolve6 = promisify(resolver.resolve6.bind(resolver));
    const resolveCname = promisify(resolver.resolveCname.bind(resolver));
    const resolveMx = promisify(resolver.resolveMx.bind(resolver));
    const resolveNs = promisify(resolver.resolveNs.bind(resolver));
    const resolveTxt = promisify(resolver.resolveTxt.bind(resolver));
    const resolvePtr = promisify(resolver.resolvePtr.bind(resolver));
    const resolveSoa = promisify(resolver.resolveSoa.bind(resolver));

    function withTimeout(promise, ms) {
        return Promise.race([
            promise,
            new Promise((_, reject) =>
                setTimeout(() => reject(Object.assign(new Error('Query timeout'), { code: 'ETIMEOUT' })), ms)
            ),
        ]);
    }

    function formatAnswer(result, type, domain) {
        if (result == null) return [];
        if (!Array.isArray(result)) result = [result];
        return result.map((item) => {
            let data = '';
            if (type === 'MX' && item && typeof item === 'object') {
                data = `${item.priority ?? ''} ${item.exchange ?? ''}`.trim();
            } else if (type === 'TXT' && Array.isArray(item)) {
                data = item.join('');
            } else if (type === 'SOA' && item && typeof item === 'object') {
                data = [item.nsname, item.hostmaster, item.serial, item.refresh, item.retry, item.expire, item.minttl].filter(Boolean).join(' ');
            } else {
                data = item != null ? String(item) : '';
            }
            return { name: domain, type, data: String(data) };
        });
    }

    try {
        let result;
        switch (recordType) {
            case 'A':
                result = await withTimeout(resolve4(hostname), DNS_LOOKUP_TIMEOUT_MS);
                break;
            case 'AAAA':
                result = await withTimeout(resolve6(hostname), DNS_LOOKUP_TIMEOUT_MS);
                break;
            case 'CNAME':
                result = await withTimeout(resolveCname(hostname), DNS_LOOKUP_TIMEOUT_MS);
                break;
            case 'MX':
                result = await withTimeout(resolveMx(hostname), DNS_LOOKUP_TIMEOUT_MS);
                break;
            case 'NS':
                result = await withTimeout(resolveNs(hostname), DNS_LOOKUP_TIMEOUT_MS);
                break;
            case 'TXT':
                result = await withTimeout(resolveTxt(hostname), DNS_LOOKUP_TIMEOUT_MS);
                break;
            case 'PTR':
                result = await withTimeout(resolvePtr(hostname), DNS_LOOKUP_TIMEOUT_MS);
                break;
            case 'SOA':
                result = [await withTimeout(resolveSoa(hostname), DNS_LOOKUP_TIMEOUT_MS)];
                break;
            default:
                result = [];
        }
        const answer = formatAnswer(result, recordType, hostname);
        return NextResponse.json({
            Status: 0,
            Answer: answer,
            Domain: hostname,
            Type: recordType,
            Server: resolverIp,
        });
    } catch (error) {
        if (error.code === 'ENODATA' || error.code === 'NODATA') {
            return NextResponse.json({ Status: 0, Answer: [], Domain: hostname, Type: recordType, Message: `No ${recordType} records found.` });
        }
        if (error.code === 'ENOTFOUND') {
            return NextResponse.json({ Status: 3, Answer: [], Domain: hostname, Type: recordType, Comment: 'Domain not found.' });
        }
        if (error.code === 'ETIMEOUT') {
            return NextResponse.json({ Status: 2, Answer: [], Domain: hostname, Type: recordType, Comment: 'Query timeout.' });
        }
        if (error.code === 'EREFUSED') {
            return NextResponse.json({ Status: 2, Answer: [], Domain: hostname, Type: recordType, Comment: 'Query refused by DNS server.' });
        }
        return NextResponse.json({
            Status: 2,
            Answer: [],
            Comment: error.message || 'Lookup failed.',
            Domain: hostname,
            Type: recordType,
        });
    }
}
