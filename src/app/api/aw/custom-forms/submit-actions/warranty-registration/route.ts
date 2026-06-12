import externalDbService, { CreateWarrantyInput } from 'lib/external-db';
import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
type WarrantyLineRequest = {
  productType: string;
  productSeries: string;
  quantity: number;
  installationDate: string;
  serialNumber: string;
};

type WarrantyRequest = {
  firstName: string;
  lastName: string;
  email: string;
  telephone?: string;
  address1?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  agreeToNewsUpdates?: boolean;
  lines?: WarrantyLineRequest[];
};

type ApiResponse = {
  message: string;
  result?: unknown;
  error?: string;
};

function isWarrantyRequest(body: unknown): body is WarrantyRequest {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const b = body as WarrantyRequest;

  return (
    typeof b.firstName === 'string' && typeof b.lastName === 'string' && typeof b.email === 'string'
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  if (req.method !== 'POST') {
    const payload: ApiResponse = {
      message: 'Invalid payload',
      error: 'Missing required fields',
    };
    return Response.json(payload, { status: 405 });
  }

  try {
    const body: unknown = await req.json().catch(() => null);

    if (!isWarrantyRequest(body)) {
      const payload: ApiResponse = {
        message: 'Invalid payload',
        error: 'Missing required fields',
      };
      return Response.json(payload, { status: 400 });
    }

    const lines =
      body.lines?.map((l) => ({
        productType: String(l.productType ?? '').trim(),
        productSeries: String(l.productSeries ?? '').trim(),
        quantity: Number(l.quantity ?? 0),
        installationDate: new Date(l.installationDate),
        serialNumber: String(l.serialNumber ?? '').trim(),
      })) ?? [];

    const warranty: CreateWarrantyInput = {
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: body.email.trim().toLowerCase(),
      telephone: body.telephone?.trim() ?? '',
      address1: body.address1?.trim() ?? '',
      city: body.city?.trim() ?? '',
      state: body.state?.trim() ?? '',
      country: body.country?.trim() ?? '',
      zip: body.zip?.trim() ?? '',
      agreeToNewsUpdates: Boolean(body.agreeToNewsUpdates),
      lines,
    };

    const result = await externalDbService.createAwWarranty(warranty);

    const payload: ApiResponse = {
      message: 'Warranty Registered',
      result,
    };
    return Response.json(payload, { status: 200 });
  } catch (err: unknown) {
    console.error('RegisterWarranty error:', err);

    if (err instanceof Error) {
      const payload: ApiResponse = {
        message: 'Warranty Registration Failed',
        error: err instanceof Error ? err.message : 'Unexpected server error',
      };
      return Response.json(payload, { status: 500 });
    }

    return Response.json(
      {
        message: 'Warranty Registration Failed',
        error: 'Unexpected server error',
      },
      { status: 500 }
    );
  }
}
