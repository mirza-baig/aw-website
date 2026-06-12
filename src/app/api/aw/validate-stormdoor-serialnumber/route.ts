import config from 'aw.config.server';
import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';

const endpoint = `${config.mulesoft.apiUrl}/api/web/stormdoor/v1.0/getstormdooritemnumber`;
const clientId = config.mulesoft.clientId;
const clientSecret = config.mulesoft.clientSecret;

type StormdoorRequestBody = {
  serialNumber?: string;
};

export async function POST(req: NextRequest): Promise<Response> {
  if (req.method !== 'POST') {
    return Response.json({ status: 405 });
  }
  const body: StormdoorRequestBody = await req.json().catch(() => null);
  const serialNumberRaw = body?.serialNumber;

  if (typeof serialNumberRaw !== 'string') {
    return Response.json(
      { message: 'Invalid payload', error: 'serialNumber must be a string' },
      { status: 400 }
    );
  }
  const serialNumber = serialNumberRaw.trim();

  const serialNumberLetter = getSerialNumberLetterCode(serialNumber);
  const id = getSerialNumberInteger(serialNumber);

  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      client_id: clientId ?? '',
      client_secret: clientSecret ?? '',
    },
  };

  const validateSerialNumberURL = new URL(endpoint || '');
  validateSerialNumberURL.searchParams.append('serialnumberletter', serialNumberLetter);
  validateSerialNumberURL.searchParams.append('id', id);

  const response = await fetch(validateSerialNumberURL.toString(), requestOptions);

  const data = await response.json();

  return Response.json(JSON.stringify(data), { status: 200 });
}

const getSerialNumberLetterCode = (sSerialNumber: string) => {
  let retVal = ' ';
  if (sSerialNumber !== '') {
    if (isLetter(sSerialNumber)) {
      retVal = sSerialNumber.substring(0, 1);
    }
  }
  return retVal;
};

const getSerialNumberInteger = (sSerialNumber: string) => {
  let retVal = '';
  if (sSerialNumber !== '') {
    if (isNumeric(sSerialNumber)) {
      retVal = sSerialNumber;
    } else if (
      isLetter(sSerialNumber) &&
      isNumeric(sSerialNumber.substring(1, sSerialNumber.length - 1))
    ) {
      retVal = sSerialNumber.substring(1, sSerialNumber.length - 1);
    }
  }
  return retVal;
};

const isNumeric = (str: string) => {
  try {
    Number.parseFloat(str);
  } catch {
    return false;
  }
  return true;
};

const isLetter = (str: string) => {
  const c = str[0] as unknown as number;
  return Number.isNaN(c);
};
