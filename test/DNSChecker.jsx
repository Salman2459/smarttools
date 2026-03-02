"use client";

import React, { useState } from 'react';
import { Search, RotateCw, CheckCircle, XCircle, Globe, Server, ChevronDown, Copy, Info } from 'lucide-react';
import WorldMap from './WorldMap';

const DNS_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT', 'PTR', 'SOA'];

// DNS Server locations with specific resolvers and coordinates
const DNS_LOCATIONS = [
    // United States
    { id: 'us-sfo', country: 'United States', city: 'San Francisco CA', flag: '🇺🇸', provider: 'OpenDNS', resolver: 'us-opendns', lat: 37.7749, lng: -122.4194 },
    { id: 'us-mtv', country: 'United States', city: 'Mountain View CA', flag: '🇺🇸', provider: 'Google', resolver: 'us-google', lat: 37.3861, lng: -122.0839 },
    { id: 'us-berk', country: 'United States', city: 'Berkeley', flag: '🇺🇸', provider: 'Quad9', resolver: 'us-quad9', lat: 37.8715, lng: -122.2730 },
    { id: 'us-nyc', country: 'United States', city: 'New York', flag: '🇺🇸', provider: 'Verisign', resolver: 'us-verisign', lat: 40.7128, lng: -74.0060 },
    { id: 'us-col', country: 'United States', city: 'Columbia', flag: '🇺🇸', provider: 'Level3', resolver: 'us-level3', lat: 34.0007, lng: -81.0348 },
    { id: 'us-cen', country: 'United States', city: 'Central US', flag: '🇺🇸', provider: 'Cloudflare', resolver: 'us-cloudflare', lat: 39.0, lng: -95.0 }, // Approx/Council Bluffs
    { id: 'us-dal', country: 'United States', city: 'Dallas TX', flag: '🇺🇸', provider: 'Google', resolver: 'us-google', lat: 32.7767, lng: -96.7970 },
    { id: 'us-mia', country: 'United States', city: 'Miami FL', flag: '🇺🇸', provider: 'OpenDNS', resolver: 'us-opendns', lat: 25.7617, lng: -80.1918 },

    // Canada
    { id: 'ca-tor', country: 'Canada', city: 'Toronto', flag: '🇨🇦', provider: 'Cloudflare', resolver: 'us-cloudflare', lat: 43.6511, lng: -79.3470 },
    { id: 'ca-mon', country: 'Canada', city: 'Montreal', flag: '🇨🇦', provider: 'Google', resolver: 'us-google', lat: 45.5017, lng: -73.5673 },

    // Europe
    { id: 'uk-lon', country: 'United Kingdom', city: 'London', flag: '🇬🇧', provider: 'Cloudflare', resolver: 'eu-cloudflare', lat: 51.5074, lng: -0.1278 },
    { id: 'de-fra', country: 'Germany', city: 'Frankfurt', flag: '🇩🇪', provider: 'Quad9', resolver: 'eu-quad9', lat: 50.1109, lng: 8.6821 },
    { id: 'nl-ams', country: 'Netherlands', city: 'Amsterdam', flag: '🇳🇱', provider: 'AdGuard', resolver: 'eu-cloudflare', lat: 52.3676, lng: 4.9041 },
    { id: 'nl-die', country: 'Netherlands', city: 'Diemen', flag: '🇳🇱', provider: 'XS4ALL', resolver: 'eu-quad9', lat: 52.3432, lng: 4.9667 },
    { id: 'fr-par', country: 'France', city: 'Paris', flag: '🇫🇷', provider: 'Orange', resolver: 'eu-cloudflare', lat: 48.8566, lng: 2.3522 },
    { id: 'es-mad', country: 'Spain', city: 'Madrid', flag: '🇪🇸', provider: 'Telefonica', resolver: 'us-google', lat: 40.4168, lng: -3.7038 },
    { id: 'it-mil', country: 'Italy', city: 'Milan', flag: '🇮🇹', provider: 'Telecom Italia', resolver: 'eu-quad9', lat: 45.4642, lng: 9.1900 },
    { id: 'se-sto', country: 'Sweden', city: 'Stockholm', flag: '🇸🇪', provider: 'Telia', resolver: 'eu-cloudflare', lat: 59.3293, lng: 18.0686 },

    // Asia Pacific
    { id: 'jp-tok', country: 'Japan', city: 'Tokyo', flag: '🇯🇵', provider: 'Google', resolver: 'jp-google', lat: 35.6762, lng: 139.6503 },
    { id: 'sg-sin', country: 'Singapore', city: 'Singapore', flag: '🇸🇬', provider: 'Cloudflare', resolver: 'sg-cloudflare', lat: 1.3521, lng: 103.8198 },
    { id: 'au-syd', country: 'Australia', city: 'Sydney', flag: '🇦🇺', provider: 'Quad9', resolver: 'us-quad9', lat: -33.8688, lng: 151.2093 },
    { id: 'in-mum', country: 'India', city: 'Mumbai', flag: '🇮🇳', provider: 'Google', resolver: 'us-google', lat: 19.0760, lng: 72.8777 },
    { id: 'kr-seo', country: 'South Korea', city: 'Seoul', flag: '🇰🇷', provider: 'KT Corporation', resolver: 'us-google', lat: 37.5665, lng: 126.9780 },
    { id: 'hk-hkg', country: 'Hong Kong', city: 'Hong Kong', flag: '🇭🇰', provider: 'PCCW', resolver: 'us-cloudflare', lat: 22.3193, lng: 114.1694 },

    // Middle East & Africa
    { id: 'ae-dxb', country: 'UAE', city: 'Dubai', flag: '🇦🇪', provider: 'Etisalat', resolver: 'us-google', lat: 25.2048, lng: 55.2708 },
    { id: 'za-jnb', country: 'South Africa', city: 'Johannesburg', flag: '🇿🇦', provider: 'Telkom', resolver: 'us-cloudflare', lat: -26.2041, lng: 28.0473 },

    // South America
    { id: 'br-gru', country: 'Brazil', city: 'São Paulo', flag: '🇧🇷', provider: 'Google', resolver: 'us-google', lat: -23.5505, lng: -46.6333 },
    { id: 'mx-mex', country: 'Mexico', city: 'Mexico City', flag: '🇲🇽', provider: 'Telmex', resolver: 'us-opendns', lat: 19.4326, lng: -99.1332 },
];

// Function to extract domain from URL
const extractDomain = (input) => {
    let cleaned = input.trim();

    // Remove protocol (http://, https://, ftp://, etc.)
    cleaned = cleaned.replace(/^(https?|ftp):\/\//, '');

    // Remove www. prefix
    cleaned = cleaned.replace(/^www\./, '');

    // Remove path and query parameters
    cleaned = cleaned.split('/')[0];

    return cleaned;
};

const DNSChecker = () => {
    const [domain, setDomain] = useState('');
    const [recordType, setRecordType] = useState('A');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState({});
    const [showFlags, setShowFlags] = useState(true);

    const handleSearch = async () => {
        if (!domain) return;

        const cleanDomain = extractDomain(domain);
        if (!cleanDomain) return;

        setLoading(true);
        setResults({});

        const initialResults = {};
        DNS_LOCATIONS.forEach(loc => {
            initialResults[loc.id] = { status: 'pending', data: null };
        });
        setResults(initialResults);

        const batchSize = 15;
        for (let i = 0; i < DNS_LOCATIONS.length; i += batchSize) {
            const batch = DNS_LOCATIONS.slice(i, i + batchSize);

            await Promise.allSettled(batch.map(async (location) => {
                try {
                    const resolver = location.resolver || 'us-google';
                    const url = `/api/dns-lookup?name=${encodeURIComponent(cleanDomain)}&type=${recordType}&resolver=${resolver}`;
                    const response = await fetch(url);
                    const data = await response.json();

                    const isSuccess = data.Status === 0 && data.Answer && data.Answer.length > 0;
                    const isNotFound = data.Status === 3;

                    setResults(prev => ({
                        ...prev,
                        [location.id]: {
                            status: isNotFound ? 'notfound' : (isSuccess ? 'success' : 'error'),
                            data: data.Answer || [],
                            raw: data,
                        }
                    }));
                } catch (error) {
                    setResults(prev => ({
                        ...prev,
                        [location.id]: { status: 'error', error: 'Failed' }
                    }));
                }
            }));
        }

        setLoading(false);
    };

    const successCount = Object.values(results).filter(r => r?.status === 'success').length;
    const errorCount = Object.values(results).filter(r => r?.status === 'error' || r?.status === 'notfound').length;
    const pendingCount = Object.values(results).filter(r => r?.status === 'pending').length;

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#faf8f5' }}>
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px'
            }} />

            <div className="relative max-w-7xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f68934]/10 border border-[#f68934]/20 mb-4">
                        <span className="text-[#f68934]">✦</span>
                        <span className="text-sm font-medium text-gray-600">DNS PROPAGATION CHECKER</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Check DNS Records<br />
                        <span className="text-[#f68934]">Worldwide</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Verify DNS propagation across {DNS_LOCATIONS.length} global servers.
                        Check A, AAAA, CNAME, MX, NS, TXT and more record types.
                    </p>
                </div>

                {/* Search Box */}
                <div className="max-w-3xl mx-auto mb-10">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                placeholder="Enter domain (e.g. google.com, https://www.youtube.com/)"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="flex-1 px-5 py-4 text-lg border-0 focus:ring-0 outline-none bg-transparent"
                            />
                            <div className="flex gap-2">
                                <div className="relative">
                                    <select
                                        value={recordType}
                                        onChange={(e) => setRecordType(e.target.value)}
                                        className="appearance-none h-full px-5 pr-10 py-4 bg-gray-50 rounded-xl text-gray-700 font-medium border-0 cursor-pointer"
                                    >
                                        {DNS_TYPES.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                                <button
                                    onClick={handleSearch}
                                    disabled={loading || !domain}
                                    className="px-8 py-4 bg-[#f68934] hover:bg-[#de7b2f] text-white font-semibold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
                                >
                                    {loading ? <RotateCw className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Select Pills */}
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {DNS_TYPES.map(t => (
                            <button
                                key={t}
                                onClick={() => setRecordType(t)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${t === recordType
                                    ? 'bg-[#f68934] text-white border-[#f68934]'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#f68934]/50'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Panel - Results */}
                    <div className="lg:col-span-2">
                        {/* Stats */}
                        {Object.keys(results).length > 0 && (
                            <div className="flex gap-4 mb-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span className="font-bold text-green-600">{successCount}</span>
                                    <span className="text-gray-400 text-sm">Success</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100">
                                    <XCircle className="w-5 h-5 text-red-500" />
                                    <span className="font-bold text-red-600">{errorCount}</span>
                                    <span className="text-gray-400 text-sm">Failed</span>
                                </div>
                                {pendingCount > 0 && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100">
                                        <RotateCw className="w-5 h-5 text-[#f68934] animate-spin" />
                                        <span className="font-bold text-[#f68934]">{pendingCount}</span>
                                        <span className="text-gray-400 text-sm">Checking</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Results Table */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                                <div className="flex items-center gap-2">
                                    <Server className="w-5 h-5 text-[#f68934]" />
                                    <span className="font-semibold text-gray-800">Global Server Network</span>
                                </div>
                                <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={showFlags}
                                        onChange={(e) => setShowFlags(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-[#f68934] focus:ring-[#f68934]"
                                    />
                                    Show Flags
                                </label>
                            </div>

                            <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
                                {DNS_LOCATIONS.map((loc) => {
                                    const result = results[loc.id];
                                    const isSuccess = result?.status === 'success';
                                    const isError = result?.status === 'error';
                                    const isNotFound = result?.status === 'notfound';
                                    const isPending = result?.status === 'pending';
                                    const firstIP = result?.data?.[0]?.data;

                                    return (
                                        <div
                                            key={loc.id}
                                            className="flex items-center justify-between px-5 py-3 hover:bg-[#f68934]/5 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                {showFlags && (
                                                    <span className="text-xl">{loc.flag}</span>
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-800">
                                                        {loc.city}, {loc.country}
                                                    </div>
                                                    <div className="text-xs text-gray-400 flex items-center gap-1">
                                                        {loc.provider}
                                                        <Info className="w-3 h-3" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {isPending && (
                                                    <span className="text-[#f68934] text-sm flex items-center gap-1">
                                                        <RotateCw className="w-4 h-4 animate-spin" />
                                                    </span>
                                                )}
                                                {isSuccess && firstIP && (
                                                    <div className="flex items-center gap-2">
                                                        <code className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded font-mono">
                                                            {firstIP}
                                                        </code>
                                                        <button
                                                            onClick={() => copyToClipboard(firstIP)}
                                                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                                        >
                                                            <Copy className="w-4 h-4 text-gray-400" />
                                                        </button>
                                                    </div>
                                                )}
                                                {isNotFound && <span className="text-gray-400 text-sm">Not found</span>}
                                                {isError && <span className="text-red-400 text-sm">Error</span>}

                                                <div className="w-6 h-6 flex items-center justify-center">
                                                    {isSuccess && <CheckCircle className="w-5 h-5 text-green-500" />}
                                                    {(isError || isNotFound) && <XCircle className="w-5 h-5 text-red-400" />}
                                                    {isPending && <div className="w-5 h-5 rounded-full border-2 border-[#f68934]/20 border-t-[#f68934] animate-spin" />}
                                                    {!result && <div className="w-5 h-5 rounded-full border-2 border-gray-200" />}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="space-y-6">
                        {/* Map */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-[#f68934]" />
                                    DNS Propagation Map
                                </h3>
                                <p className="text-xs text-gray-500 mt-1 ml-7">
                                    Visual representation of DNS propagation across global servers. {' '}
                                    (<span className="text-green-600 font-medium">Green</span> indicates success, <span className="text-red-500 font-medium">Red</span> failure)
                                </p>
                            </div>
                            <div className="p-3">
                                <WorldMap locations={DNS_LOCATIONS} results={results} loading={loading} />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <h3 className="font-semibold text-gray-800 mb-3">What is DNS Propagation?</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                DNS propagation is the time it takes for DNS record changes to be updated across all servers globally.
                                This tool helps you verify if your changes have propagated worldwide.
                            </p>
                            <div className="mt-4 p-3 bg-[#f68934]/5 rounded-xl border border-[#f68934]/10">
                                <p className="text-sm text-[#c2621b]">
                                    <strong>💡 Tip:</strong> If some servers show old records, wait 24-48 hours for full propagation.
                                </p>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="bg-gradient-to-br from-[#f68934] to-[#de7b2f] rounded-2xl p-5 text-white">
                            <h3 className="font-semibold mb-2">Need Help with DNS?</h3>
                            <p className="text-sm text-white/90 mb-4">
                                Our team can help you configure and optimize your DNS settings.
                            </p>
                            <button className="w-full py-3 bg-white text-[#f68934] font-semibold rounded-xl hover:bg-[#f68934]/10 transition-colors">
                                Book a Strategy Call
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DNSChecker;