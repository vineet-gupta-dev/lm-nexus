import type { VercelRequest, VercelResponse } from '@vercel/node';

const SAP_BASE_URL = (process.env.SAP_BASE_URL || process.env.SAP_URL || '').replace(/\/$/, '');
const SAP_USERNAME = process.env.SAP_USERNAME || '';
const SAP_PASSWORD = process.env.SAP_PASSWORD || '';
const SAP_CLIENT   = process.env.SAP_CLIENT ?? '800';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!SAP_BASE_URL || !SAP_USERNAME || !SAP_PASSWORD) {
    return res.status(500).json({
      error: 'Missing SAP environment variables',
      details: 'Set SAP_BASE_URL (or SAP_URL), SAP_USERNAME, SAP_PASSWORD, and SAP_CLIENT in Vercel Project Settings > Environment Variables.',
    });
  }

  const entity    = (req.query.entity as string) || 'A_BusinessPartner';
  const top       = (req.query.$top   as string) || '20';
  const skip      = (req.query.$skip  as string) || '0';
  const filter    = (req.query.$filter as string) || '';
  const select    = (req.query.$select as string) || '';

  let url = `${SAP_BASE_URL}/sap/opu/odata/SAP/API_BUSINESS_PARTNER/${entity}?sap-client=${SAP_CLIENT}&$format=json&$top=${top}&$skip=${skip}`;
  if (filter) url += `&$filter=${encodeURIComponent(filter)}`;
  if (select) url += `&$select=${encodeURIComponent(select)}`;

  try {
    const token = Buffer.from(`${SAP_USERNAME}:${SAP_PASSWORD}`).toString('base64');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const sapRes = await fetch(url, {
      headers: {
        Authorization: `Basic ${token}`,
        Accept: 'application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!sapRes.ok) {
      const errText = await sapRes.text();
      return res.status(sapRes.status).json({
        error: 'SAP OData error',
        status: sapRes.status,
        details: errText,
      });
    }

    const data = await sapRes.json();
    return res.status(200).json(data);
  } catch (err: any) {
    const cause = err?.cause;
    return res.status(500).json({
      error: 'Proxy error',
      details: err?.message ?? String(err),
      hint: 'If details include ENOTFOUND/ECONNREFUSED/ETIMEDOUT, the SAP host is not reachable from the runtime network.',
      networkCause: {
        code: cause?.code ?? null,
        errno: cause?.errno ?? null,
        syscall: cause?.syscall ?? null,
        hostname: cause?.hostname ?? null,
      },
    });
  }
}
