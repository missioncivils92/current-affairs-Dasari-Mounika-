// W48 "magnificent views": camera flights from India down onto real Copernicus Sentinel-2 imagery, one per place.
// Owner, 27 Nov: "More magnificent views please in video format". Standalone clips (no voice); also usable as B-roll in the weekly.
// Render: node render.js <assets> <timeline> scenes/flights48.js <out> --strict   (assets sat/: <close>.png and <name>_m.png)
// The outer map is the Survey of India outline (exFlat); satellite layers fade in as the camera descends.
window.NO_PUSH = true; window.EX_LOGO = true;
const YEL = '#FFD60A', INK = '#1B0B45';
const zFor = span => Math.log2(1920 * 360 / (256 * span));
function flight(o) {
  return (ctx, s) => {
    const zc = zFor(o.span), A0 = o.from || { lon: 80, lat: 23, zoom: 5.3 }, A1 = { lon: o.ctr[0], lat: o.ctr[1], zoom: zc };
    const fly = clamp((s.t - 0.8) / (s.d * 0.62)), cam = camLerp(A0, A1, fly), push = s.t > s.d * 0.62 + 0.8 ? (s.t - s.d * 0.62 - 0.8) * 0.035 : 0;
    const proj = camera(cam.lon, cam.lat, cam.zoom + push);
    ctx.fillStyle = '#0A224A'; ctx.fillRect(0, 0, W, H);                       // sea
    raster(ctx, proj, A.asia_t, A.asia_t_meta);
    if (o.terr && A[o.terr]) raster(ctx, proj, A[o.terr], A[o.terr + '_meta'], { feather: 90 });
    for (const k of A.geo.countries_wide) if (k.a3 !== 'IND') geo(ctx, proj, k.geom, { stroke: 'rgba(255,255,255,0.35)', lw: 1.5 });
    for (const st of A.geo.india_states) geo(ctx, proj, st.geom, { stroke: 'rgba(255,255,255,0.45)', lw: 1.6 });
    geo(ctx, proj, A.geo.india, { stroke: YEL, lw: 3.5 });
    if (o.rivers) rivers(ctx, proj, o.rivers, { color: '#4A90C2', lw: 3 });
    const zf = (cam.zoom + push);
    if (o.mid && A[o.mid]) raster(ctx, proj, A[o.mid], A[o.mid + '_meta'], { alpha: clamp((zf - (zc - 4.6)) / 1.4), feather: 140, filter: 'brightness(1.05) saturate(1.15)' });
    raster(ctx, proj, A[o.sat], A[o.sat + '_meta'], { alpha: clamp((zf - (zc - 1.4)) / 1.0), feather: 160, filter: 'brightness(1.06) saturate(1.15)' });
    const land = clamp((s.t - (s.d * 0.62 + 0.8)) / 1.2);
    // start pin + travelling marker
    if (fly < 1) { const [px, py] = proj(o.ctr); ctx.save(); ctx.globalAlpha *= 1 - fly * 0.6; ctx.beginPath(); ctx.arc(px, py, 18 + 8 * Math.sin(s.t * 5), 0, 7); ctx.strokeStyle = YEL; ctx.lineWidth = 6; ctx.stroke(); ctx.restore(); }
    for (const [t, ll, z, col, at] of o.labels || []) { const [px, py] = proj(ll); kt(ctx, t, px, py, { font: F.ui(z || 40, 900), color: col || '#FFFFFF', align: 'center', shadow: 10, alpha: land * eia(s, s.d * 0.62 + 0.8 + (at || 0)) }); }
    for (const [t, ll, off, at, bg] of o.pins || []) exTag(ctx, proj, ll, t, off, land * eia(s, s.d * 0.62 + 1.2 + (at || 0)), EP.purple, { bg: bg || '#FFFFFF', size: 30 });
    // title + fact
    exChip(ctx, o.title, 72, 44, YEL, INK, 40, eia(s, 0.2));
    if (o.sub) kt(ctx, o.sub, 76, 150, { font: F.ui(36, 800), color: '#FFFFFF', shadow: 8, alpha: eia(s, 0.6) });
    if (o.fact) { const a = eia(s, s.d * 0.62 + 2.2); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.font = F.ui(40, 900); const w = Math.min(1776, ctx.measureText(o.fact).width + 60); rr(ctx, 72, 930, w, 90, 20); ctx.fillStyle = 'rgba(11,8,32,0.82)'; ctx.fill(); ctx.restore(); kt(ctx, o.fact, 102, 990, { font: F.ui(40, 900), color: YEL, alpha: a, maxW: 1716 }); } }
    kt(ctx, (fly > 0.5 ? 'Contains modified Copernicus Sentinel data 2026 · ' : '') + 'Elevation: Terrain Tiles (Mapzen/AWS) · Boundaries: Survey of India outline (DataMeet)', W - 24, H - 18, { font: F.ui(22, 700), color: '#FFFFFF', align: 'right', shadow: 6, alpha: 0.9 });
  };
}
SCENES.S1 = flight({ title: 'THE STRAIT OF HORMUZ', sub: "From India's west coast to the world's oil choke point", terr: 'hormuz_t', sat: 'hormuz', ctr: [56.35, 26.45], span: 1.75, from: { lon: 70, lat: 23, zoom: 5.2 },
  labels: [['IRAN', [57.0, 26.75], 64], ['PERSIAN GULF', [55.75, 26.4], 46, '#BFE3FF'], ['GULF OF OMAN', [56.88, 26.3], 46, '#BFE3FF'], ['OMAN · Musandam', [56.15, 26.25], 42]],
  pins: [['the narrow strait', [56.42, 26.55], [190, -10], 0.4, YEL]], fact: '≈ 1/5 of the world\'s oil · India imports ≈ 85% of its crude' });
SCENES.S2 = flight({ title: 'NITISH SETU · OVER THE GANGA', sub: "India's new longest river bridge · Bihar", mid: 'patna_m', terr: 'bihar_t', sat: 'nitish', ctr: [85.315, 25.645], span: 0.3, rivers: ['Ganga'],
  labels: [['GANGA', [85.3, 25.625], 42, '#BFE3FF'], ['PATNA', [85.215, 25.575], 42], ['VAISHALI district', [85.36, 25.70], 38]],
  pins: [['Nitish Setu · 9.76 km · 6 lanes', [85.318, 25.607], [260, -60], 0.2, YEL], ['Mahatma Gandhi Setu', [85.21, 25.64], [140, -90], 0.6]], fact: 'Opened 21 Nov 2026 · Kachchi Dargah (Patna) ↔ Bidupur (Vaishali)' });
SCENES.S3 = flight({ title: 'SARAIGHAT · THE BRAHMAPUTRA', sub: 'Where Lachit Borphukan beat the Mughals, 1671', mid: 'guwahati_m', terr: 'assam_t', sat: 'saraighat', ctr: [91.72, 26.175], span: 0.33, rivers: ['Brahmaputra'],
  labels: [['BRAHMAPUTRA', [91.62, 26.19], 46, '#BFE3FF'], ['GUWAHATI', [91.78, 26.155], 48]],
  pins: [['Saraighat area', [91.68, 26.185], [80, -150], 0.2, YEL]], fact: 'Battle of Saraighat · 1671 · Ahom general Lachit Borphukan' });
SCENES.S4 = flight({ title: 'VISAKHAPATNAM · TELUGU STATES LENS', sub: "Home of India's first strategic oil cavern", mid: 'vizag_m', terr: 'vizag_t', sat: 'vizag', ctr: [83.27, 17.71], span: 0.22,
  labels: [['VISAKHAPATNAM', [83.24, 17.765], 46], ['BAY OF BENGAL', [83.33, 17.66], 40, '#BFE3FF']], fact: 'Strategic petroleum reserve: Visakhapatnam 1.33 MMT · total 5.33 MMT' });
SCENES.S5 = flight({ title: 'ATAL SETU · MUMBAI', sub: "India's longest sea bridge", mid: 'mumbai_m', terr: 'mumbai_t', sat: 'atalsetu', ctr: [72.93, 18.975], span: 0.2,
  pins: [['Atal Setu (sea bridge)', [72.93, 19.0], [40, -120], 0.1, YEL], ['Sewri, Mumbai', [72.86, 19.005], [60, 110], 0.4], ['Elephanta Island', [72.932, 18.965], [120, 90], 0.6]], fact: '≈ 21.8 km · Sewri ↔ Nhava Sheva' });
SCENES.S6 = flight({ title: 'JIUQUAN · GOBI DESERT', sub: 'Where Shenzhou-24 lifted off with Pakistan\'s first astronaut', terr: 'gobi_t', sat: 'jiuquan', ctr: [100.2, 41.0], span: 0.55, from: { lon: 86, lat: 30, zoom: 5.0 },
  labels: [['GOBI DESERT · INNER MONGOLIA', [100.05, 41.12], 40]], pins: [['Jiuquan Satellite Launch Centre', [100.29, 40.96], [-60, -150], 0.2, YEL]], fact: 'Launch centre in Inner Mongolia · named after a city in Gansu' });
SCENES.S7 = flight({ title: 'ANTALYA · TÜRKIYE', sub: 'Host city of COP31, which ended with no deal', terr: 'antalya_t', sat: 'antalya', ctr: [30.72, 36.885], span: 0.33, from: { lon: 55, lat: 31, zoom: 4.6 },
  labels: [['ANTALYA', [30.7, 36.905], 56], ['MEDITERRANEAN SEA', [30.68, 36.84], 42, '#BFE3FF']], fact: 'COP31 · 9–22 Nov 2026 · Türkiye presided, Australia led negotiations' });
