import { NextResponse } from 'next/server';
import { Resolver } from 'dns/promises';

const DNS_SERVERS = [
    { name: 'OpenDNS', ip: '208.67.222.222', location: 'San Francisco CA, United States', country: 'US', flag: '🇺🇸', coords: [37.7749, -122.4194] },
    { name: 'Google', ip: '8.8.8.8', location: 'Mountain View CA, United States', country: 'US', flag: '🇺🇸', coords: [37.3861, -122.0839] },
    { name: 'Quad9', ip: '9.9.9.9', location: 'Berkeley, US', country: 'US', flag: '🇺🇸', coords: [37.8715, -122.2730] },
    { name: 'Quad9', ip: '149.112.112.112', location: 'San Francisco, US', country: 'US', flag: '🇺🇸', coords: [37.7749, -122.4194] },
    { name: 'CenturyLink', ip: '205.171.3.65', location: 'United States', country: 'US', flag: '🇺🇸', coords: [39.0, -98.0] },
    { name: 'Daniel Cid', ip: '185.228.169.9', location: 'Columbia, United States', country: 'US', flag: '🇺🇸', coords: [34.0007, -81.0348] },
    { name: 'ZCORUM', ip: '204.14.71.194', location: 'Alpharetta, United States', country: 'US', flag: '🇺🇸', coords: [34.0754, -84.2941] },
    { name: 'Fortinet Inc', ip: '208.91.112.53', location: 'Burnaby, Canada', country: 'CA', flag: '🇨🇦', coords: [49.2488, -122.9805] },
    { name: 'YANDEX LLC', ip: '77.88.8.8', location: 'St Petersburg, Russia', country: 'RU', flag: '🇷🇺', coords: [59.9311, 30.3609] },
    { name: 'Liquid Telecommunications Ltd', ip: '5.11.11.11', location: 'Cullinan, South Africa', country: 'ZA', flag: '🇿🇦', coords: [-25.6694, 28.5230] },
    { name: 'OpenTLD BV', ip: '80.80.80.80', location: 'Amsterdam, Netherlands', country: 'NL', flag: '🇳🇱', coords: [52.3676, 4.9041] },
    { name: 'Completel SAS', ip: '213.244.0.2', location: 'Lille, France', country: 'FR', flag: '🇫🇷', coords: [50.6292, 3.0573] },
    { name: 'ServiHosting Networks S.L.', ip: '82.223.23.23', location: 'Paterna de Rivera, Spain', country: 'ES', flag: '🇪🇸', coords: [36.5222, -5.8679] },
    { name: 'nemox.net', ip: '83.137.40.40', location: 'Innsbruck, Austria', country: 'AT', flag: '🇦🇹', coords: [47.2692, 11.4041] },
    { name: 'Wavenet Limited', ip: '212.119.160.1', location: 'Salford, United Kingdom', country: 'GB', flag: '🇬🇧', coords: [53.4875, -2.2901] },
    { name: 'Universitaet Leipzig', ip: '139.18.1.2', location: 'Leipzig, Germany', country: 'DE', flag: '🇩🇪', coords: [51.3397, 12.3731] },
    { name: 'Universidad LatinoAmericana S.C.', ip: '200.56.231.130', location: 'Mexico City, Mexico', country: 'MX', flag: '🇲🇽', coords: [19.4326, -99.1332] },
    { name: 'Claro S.A', ip: '200.255.121.39', location: 'Santa Cruz do Sul, Brazil', country: 'BR', flag: '🇧🇷', coords: [-29.715, -52.428] },
    { name: 'Cloudflare Inc', ip: '1.1.1.1', location: 'Research, Australia', country: 'AU', flag: '🇦🇺', coords: [-37.7003, 145.1878] },
    { name: 'Pacific Internet', ip: '202.14.18.1', location: 'Melbourne, Australia', country: 'AU', flag: '🇦🇺', coords: [-37.8136, 144.9631] },
    { name: 'DigitalOcean LLC', ip: '67.207.67.2', location: 'Singapore', country: 'SG', flag: '🇸🇬', coords: [1.3521, 103.8198] },
    { name: 'SK Telecom', ip: '210.220.163.82', location: 'Seoul, South Korea', country: 'KR', flag: '🇰🇷', coords: [37.5665, 126.9780] },
    { name: 'Aliyun Computing Co. Ltd', ip: '223.5.5.5', location: 'Hangzhou, China', country: 'CN', flag: '🇨🇳', coords: [30.2741, 120.1551] },
    { name: 'Teknet Yazlim', ip: '31.7.36.36', location: 'Antalya, Turkey', country: 'TR', flag: '🇹🇷', coords: [36.8969, 30.7133] },
    { name: 'Skylink Fibernet Private Limited', ip: '103.99.150.10', location: 'Coimbatore, India', country: 'IN', flag: '🇮🇳', coords: [11.0168, 76.9558] },
    { name: 'CMPak Limited', ip: '202.125.135.29', location: 'Islamabad, Pakistan', country: 'PK', flag: '🇵🇰', coords: [33.6844, 73.0479] },
    { name: 'Irish Broadband', ip: '89.101.160.4', location: 'Dublin, Ireland', country: 'IE', flag: '🇮🇪', coords: [53.3498, -6.2603] },
];

const cleanDomain = (url) => {
    try {
        let domain = url.replace(/(^\w+:|^)\/\//, '');
        domain = domain.split('/')[0];
        domain = domain.split(':')[0];
        return domain;
    } catch (e) {
        return url;
    }
};

export async function POST(req) {
    try {
        const { domain: rawDomain, type } = await req.json();
        const domain = cleanDomain(rawDomain || "");

        if (!domain) {
            return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
        }

        const results = await Promise.all(
            DNS_SERVERS.map(async (server) => {
                const resolver = new Resolver();
                resolver.setServers([server.ip]);

                try {
                    let records = [];
                    switch (type) {
                        case 'A':
                            records = await resolver.resolve4(domain);
                            break;
                        case 'AAAA':
                            records = await resolver.resolve6(domain);
                            break;
                        case 'MX':
                            records = await resolver.resolveMx(domain);
                            break;
                        case 'TXT':
                            records = await resolver.resolveTxt(domain);
                            break;
                        case 'CNAME':
                            records = await resolver.resolveCname(domain);
                            break;
                        case 'NS':
                            records = await resolver.resolveNs(domain);
                            break;
                        default:
                            records = await resolver.resolve(domain, type);
                    }
                    return {
                        server: server.name,
                        ip: server.ip,
                        location: server.location,
                        country: server.country,
                        flag: server.flag,
                        coords: server.coords,
                        status: 'success',
                        records: records.map(r => typeof r === 'string' ? r : JSON.stringify(r)),
                    };
                } catch (err) {
                    return {
                        server: server.name,
                        ip: server.ip,
                        location: server.location,
                        country: server.country,
                        flag: server.flag,
                        coords: server.coords,
                        status: 'error',
                        error: err.code || err.message,
                        records: [],
                    };
                }
            })
        );

        return NextResponse.json({ results });
    } catch (error) {
        console.error('DNS Look up error:', error);
        return NextResponse.json({ error: 'Failed to perform DNS lookup' }, { status: 500 });
    }
}
