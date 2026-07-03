/**
 * Swiss Post domain seed.
 *
 * Exports `async function seed(sql)` where `sql` is a Neon/postgres tagged
 * template client. Called by `pnpm domain:ingest` after schema migrations run.
 * All numbers are synthesized for demo — do not confuse with real Post CH data.
 */

const SERVICE_POINTS = [
  ["zh-sihlpost", "Sihlpost Zürich HB", "filiale", "ZH", "Zürich", "8021", "07:00-22:00", "08:00-22:00", "10:00-22:00", ["parcel", "letter", "cash", "id_check"], 42.5, 96.4, 47.3782, 8.5384, "active"],
  ["zh-oerlikon", "Zürich-Oerlikon", "filiale", "ZH", "Zürich", "8050", "07:30-18:30", "08:00-16:00", null, ["parcel", "letter", "cash"], 18.1, 94.7, 47.4116, 8.5442, "active"],
  ["be-schanzenpost", "Bern Schanzenpost", "filiale", "BE", "Bern", "3001", "07:00-21:00", "08:00-21:00", "16:00-21:00", ["parcel", "letter", "cash", "id_check"], 31.7, 95.9, 46.9500, 7.4400, "active"],
  ["ge-rive", "Genève Rive", "filiale", "GE", "Genève", "1204", "08:00-18:30", "09:00-16:00", null, ["parcel", "letter", "cash"], 22.4, 93.2, 46.2010, 6.1462, "active"],
  ["vd-lausanne-stf", "Lausanne St-François", "filiale", "VD", "Lausanne", "1003", "08:00-18:30", "09:00-16:00", null, ["parcel", "letter", "cash", "id_check"], 25.9, 94.1, 46.5197, 6.6323, "active"],
  ["bs-aeschen", "Basel Aeschenplatz", "filiale", "BS", "Basel", "4002", "07:30-18:30", "08:00-16:00", null, ["parcel", "letter", "cash"], 19.8, 92.8, 47.5479, 7.5910, "active"],
  ["ti-lugano-hb", "Lugano Stazione", "filiale", "TI", "Lugano", "6900", "07:30-18:30", "08:00-16:00", null, ["parcel", "letter"], 12.6, 91.4, 46.0050, 8.9470, "active"],
  ["zh-mypost24-flughafen", "My Post 24 Flughafen Zürich", "mypost24", "ZH", "Kloten", "8302", "00:00-24:00", "00:00-24:00", "00:00-24:00", ["packstation"], 8.4, 99.1, 47.4581, 8.5555, "active"],
];

const CUSTOMERS = [
  ["digitec-galaxus", "Digitec Galaxus AG", "gk", "e-commerce", "ZH", 1850, 42500000, true, "active", 12],
  ["zalando-ch", "Zalando Schweiz", "gk", "e-commerce", "ZH", 920, 21800000, true, "active", 18],
  ["migros", "Migros-Genossenschafts-Bund", "gk", "retail", "ZH", 640, 15200000, true, "active", 8],
  ["coop", "Coop Genossenschaft", "gk", "retail", "BS", 580, 13900000, true, "active", 10],
  ["nestle-ch", "Nestlé Suisse S.A.", "gk", "cpg", "VD", 210, 4950000, true, "renewal_due", 34],
  ["abb-ch", "ABB Schweiz AG", "gk", "industrial", "ZH", 88, 2100000, false, "active", 15],
  ["postfinance", "PostFinance AG", "gk", "finance", "BE", 420, 9800000, true, "active", 5],
  ["kmu-brack", "BRACK.CH AG", "kmu", "e-commerce", "AG", 145, 3400000, false, "at_risk", 58],
];

const TARIFFS = [
  ["a-post-b5",         "a_post",           "A-Post",           "letter", 0,    100,   1.20, 1, true, "2026-01-01"],
  ["a-post-b4",         "a_post",           "A-Post",           "letter", 100,  250,   1.90, 1, true, "2026-01-01"],
  ["a-post-max",        "a_post",           "A-Post",           "letter", 250,  1000,  4.20, 1, true, "2026-01-01"],
  ["b-post-b5",         "b_post",           "B-Post",           "letter", 0,    100,   1.00, 3, true, "2026-01-01"],
  ["b-post-b4",         "b_post",           "B-Post",           "letter", 100,  250,   1.50, 3, true, "2026-01-01"],
  ["postpac-prio-2kg",  "postpac_priority", "PostPac Priority", "parcel", 0,    2000,  8.80, 1, true, "2026-01-01"],
  ["postpac-prio-10kg", "postpac_priority", "PostPac Priority", "parcel", 2000, 10000, 13.00, 1, true, "2026-01-01"],
  ["postpac-eco-2kg",   "postpac_economy",  "PostPac Economy",  "parcel", 0,    2000,  7.10, 3, true, "2026-01-01"],
  ["postpac-eco-10kg",  "postpac_economy",  "PostPac Economy",  "parcel", 2000, 10000, 10.50, 3, true, "2026-01-01"],
  ["assured-parcel",    "assured",          "Assured Parcel",   "parcel", 0,    30000, 22.50, 1, true, "2026-01-01"],
];

// Generate ~30 shipments spanning statuses, customers, service points.
function buildShipments() {
  const statuses = ["delivered", "delivered", "delivered", "in_transit", "in_transit", "out_for_delivery", "lodged", "delayed", "returned"];
  const cantons = ["ZH", "BE", "VD", "GE", "BS", "TI", "AG", "SG", "LU", "TG"];
  const cities = { ZH: "Zürich", BE: "Bern", VD: "Lausanne", GE: "Genève", BS: "Basel", TI: "Lugano", AG: "Aarau", SG: "St. Gallen", LU: "Luzern", TG: "Frauenfeld" };
  const delayReasons = [null, null, null, "weather", "staffing", "address_issue"];
  const rows = [];
  const now = Date.now();
  for (let i = 0; i < 30; i++) {
    const status = statuses[i % statuses.length];
    const customer = CUSTOMERS[i % CUSTOMERS.length][0];
    const tariff = TARIFFS[5 + (i % 5)]; // parcel tariffs
    const sp = SERVICE_POINTS[i % SERVICE_POINTS.length][0];
    const canton = cantons[i % cantons.length];
    const lodged = new Date(now - (i * 6 + 4) * 3600 * 1000);
    const delivered = status === "delivered" ? new Date(lodged.getTime() + (tariff[7] * 24 + 3) * 3600 * 1000) : null;
    const delayReason = status === "delayed" ? delayReasons[3 + (i % 3)] : null;
    const isOnTime = status === "delivered" ? (i % 7 !== 0) : (status === "delayed" ? false : null);
    rows.push([
      `PP-2026-${String(100000 + i).padStart(6, "0")}`,
      customer,
      tariff[0],
      sp,
      canton,
      cities[canton],
      500 + (i * 173) % 9500,
      status,
      lodged.toISOString(),
      delivered ? delivered.toISOString() : null,
      delayReason,
      isOnTime,
      tariff[2],
    ]);
  }
  return rows;
}
const SHIPMENTS = buildShipments();

const DISRUPTIONS = [
  ["dsr-2026-01", "Verzögerungen im Kanton Graubünden wegen Schneefall", "weather", ["GR"], ["7000", "7500", "7250"], "high", "2026-07-02T04:00:00Z", "2026-07-04T18:00:00Z", "active", "Zustellungen in touristischen Gebieten des Kantons Graubünden verzögern sich um bis zu 24h.", ["parcel", "letter"]],
  ["dsr-2026-02", "Filiale Basel Aeschenplatz vorübergehend geschlossen", "branch_closed", ["BS"], ["4002"], "medium", "2026-06-28T00:00:00Z", "2026-07-10T08:00:00Z", "active", "Wegen Umbau bis 10. Juli geschlossen. Nächste Filiale: Basel Steinenberg.", ["cash", "id_check"]],
  ["dsr-2026-03", "Streckensperrung A2 Gotthard — TI-Zustellungen betroffen", "road_closure", ["TI", "UR"], [], "medium", "2026-07-01T06:00:00Z", "2026-07-05T20:00:00Z", "monitoring", "Umleitung über San Bernardino; PostPac Priority nach Tessin +1 Tag.", ["parcel"]],
  ["dsr-2026-04", "IT-Störung beim Track & Trace behoben", "it_incident", ["_all"], [], "low", "2026-07-02T10:15:00Z", "2026-07-02T11:40:00Z", "resolved", "Track & Trace kurzzeitig nicht erreichbar. Alle Systeme wieder normal.", []],
  ["dsr-2026-05", "Bahnstreik SBB — Briefsammlung Genf verzögert", "strike", ["GE", "VD"], [], "high", "2026-07-03T00:00:00Z", "2026-07-03T23:59:00Z", "active", "Bahnbedingter Sammelverzug in der Romandie. A-Post läuft mit B-Post-Frist.", ["letter"]],
];

const SERVICE_PAGES = [
  ["sp-2026-001", "disruptions", "Zustellstörung Graubünden — was Kunden wissen müssen", "disruption_desk", "incoming", "high", 92, null, "Kurzinfo zur aktuellen Schneefall-Störung mit erwarteter Dauer und Verhaltensempfehlung.", "dsr-2026-01", null],
  ["sp-2026-002", "disruptions", "Filiale Basel Aeschenplatz — Alternativen während Umbau", "disruption_desk", "in_review", "medium", 74, null, "Übersicht der Alternativstandorte plus Öffnungszeiten während der Schliessung.", "dsr-2026-02", null],
  ["sp-2026-003", "tariffs", "PostPac Priority — Preisliste 2026 aktualisiert", "product", "published", "medium", 68, "2026-06-15T09:00:00Z", "Neue Tarife ab 1. Juli, mit Vergleichstabelle nach Gewichtsklasse.", null, "postpac-prio-2kg"],
  ["sp-2026-004", "holidays", "Feiertags-Zustellung 1. August — Übersicht", "internal_ops", "incoming", "high", 88, null, "Was am Bundesfeiertag zugestellt wird und welche Filialen geöffnet sind.", null, null],
  ["sp-2026-005", "how_to", "Sendung umleiten via App — Schritt-für-Schritt", "pr", "published", "medium", 55, "2026-05-20T12:00:00Z", "Anleitung für Empfänger, laufende Sendung an eine andere Adresse oder Filiale zu leiten.", null, null],
  ["sp-2026-006", "product_launch", "PostPac Economy — jetzt auch am Sonntag zustellbar", "product", "in_review", "high", 81, null, "Ausweitung des Sonntagszustell-Netzes auf Economy-Sendungen ab 15. Juli.", null, "postpac-eco-2kg"],
  ["sp-2026-007", "policy", "Neue AGB — Version 2026-Q3", "pr", "in_review", "low", 42, null, "Wesentliche Änderungen der AGB zusammengefasst.", null, null],
  ["sp-2026-008", "disruptions", "Bahnstreik SBB — Auswirkungen auf A-Post Romandie", "disruption_desk", "incoming", "high", 90, null, "Kunden-FAQ zur Umlaufzeit während des SBB-Streiks.", "dsr-2026-05", null],
  ["sp-2026-009", "how_to", "Grosskunden-Portal: Massensendung anlegen", "internal_ops", "published", "low", 38, "2026-04-11T08:00:00Z", "Anleitung für KMU und GK zur Erfassung grosser Sendungsmengen.", null, null],
  ["sp-2026-010", "tariffs", "A-Post vs B-Post — welche wähle ich wann?", "product", "published", "medium", 61, "2026-03-01T09:00:00Z", "Klassisches Erklärstück zur Wahl der Briefkategorie.", null, "a-post-b5"],
  ["sp-2026-011", "product_launch", "My Post 24 — 20 neue Standorte ab Herbst", "pr", "incoming", "medium", 66, null, "Rollout-Plan mit Standortliste und Öffnungsterminen.", null, null],
  ["sp-2026-012", "policy", "SwissID-Login neu für Track & Trace", "product", "published", "low", 47, "2026-02-05T09:00:00Z", "Hinweis auf die Aktivierung von SwissID.", null, null],
  ["sp-2026-013", "how_to", "Sendung an My Post 24 umleiten", "pr", "incoming", "medium", 58, null, "Anleitung, Sendungen an die 24/7-Automatenstandorte umzuleiten.", null, null],
  ["sp-2026-014", "disruptions", "Störung Gotthard-A2 — TI-Sendungen +1 Tag", "disruption_desk", "in_review", "medium", 71, null, "Kurzmeldung mit Karte und Kommunikationstext für Empfänger.", "dsr-2026-03", null],
  ["sp-2026-015", "holidays", "Ostern 2027 — Zustellfahrplan (Entwurf)", "internal_ops", "incoming", "low", 33, null, "Frühentwurf des Zustellfahrplans für Karfreitag bis Ostermontag.", null, null],
];

export async function seed(sql) {
  // Truncate downstream first — respect FK order.
  await sql`TRUNCATE TABLE public.service_pages RESTART IDENTITY CASCADE`;
  await sql`TRUNCATE TABLE public.shipments RESTART IDENTITY CASCADE`;
  await sql`TRUNCATE TABLE public.service_disruptions RESTART IDENTITY CASCADE`;
  await sql`TRUNCATE TABLE public.tariffs RESTART IDENTITY CASCADE`;
  await sql`TRUNCATE TABLE public.customers RESTART IDENTITY CASCADE`;
  await sql`TRUNCATE TABLE public.service_points RESTART IDENTITY CASCADE`;

  for (const r of SERVICE_POINTS) {
    await sql`INSERT INTO public.service_points
      (id, name, kind, canton, city, postal_code, opens_mon_fri, opens_sat, opens_sun,
       services, weekly_visits_k, on_time_pct, lat, lng, status)
      VALUES (${r[0]}, ${r[1]}, ${r[2]}, ${r[3]}, ${r[4]}, ${r[5]}, ${r[6]}, ${r[7]}, ${r[8]},
              ${r[9]}, ${r[10]}, ${r[11]}, ${r[12]}, ${r[13]}, ${r[14]})`;
  }
  for (const r of CUSTOMERS) {
    await sql`INSERT INTO public.customers
      (id, name, segment, industry, primary_canton, monthly_volume_k, annual_revenue_chf,
       is_key_account, contract_status, churn_risk_score)
      VALUES (${r[0]}, ${r[1]}, ${r[2]}, ${r[3]}, ${r[4]}, ${r[5]}, ${r[6]}, ${r[7]}, ${r[8]}, ${r[9]})`;
  }
  for (const r of TARIFFS) {
    await sql`INSERT INTO public.tariffs
      (id, service, service_label, format, weight_from_g, weight_to_g, price_chf,
       transit_days_target, is_domestic, effective_from)
      VALUES (${r[0]}, ${r[1]}, ${r[2]}, ${r[3]}, ${r[4]}, ${r[5]}, ${r[6]}, ${r[7]}, ${r[8]}, ${r[9]})`;
  }
  for (const r of DISRUPTIONS) {
    await sql`INSERT INTO public.service_disruptions
      (id, headline, cause, cantons, postal_codes, severity, started_at, expected_end,
       status, impact_summary, affected_services)
      VALUES (${r[0]}, ${r[1]}, ${r[2]}, ${r[3]}, ${r[4]}, ${r[5]}, ${r[6]}, ${r[7]}, ${r[8]}, ${r[9]}, ${r[10]})`;
  }
  for (const r of SHIPMENTS) {
    await sql`INSERT INTO public.shipments
      (id, customer_id, tariff_id, origin_sp_id, destination_canton, destination_city,
       weight_g, status, lodged_at, delivered_at, delayed_reason, is_on_time, service_label)
      VALUES (${r[0]}, ${r[1]}, ${r[2]}, ${r[3]}, ${r[4]}, ${r[5]}, ${r[6]}, ${r[7]}, ${r[8]}, ${r[9]}, ${r[10]}, ${r[11]}, ${r[12]})`;
  }
  for (const r of SERVICE_PAGES) {
    await sql`INSERT INTO public.service_pages
      (id, category, headline, source, status, priority, relevance_pct, published_at,
       summary, related_disruption_id, related_tariff_id)
      VALUES (${r[0]}, ${r[1]}, ${r[2]}, ${r[3]}, ${r[4]}, ${r[5]}, ${r[6]}, ${r[7]}, ${r[8]}, ${r[9]}, ${r[10]})`;
  }

  return {
    service_points: SERVICE_POINTS.length,
    customers: CUSTOMERS.length,
    tariffs: TARIFFS.length,
    shipments: SHIPMENTS.length,
    service_disruptions: DISRUPTIONS.length,
    service_pages: SERVICE_PAGES.length,
  };
}
