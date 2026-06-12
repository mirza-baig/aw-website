import leverService from 'lib/lever';
import sfmcTransactionMessagingService from 'lib/salesforce/marketing-cloud/transaction-messaging';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export type ProcessJobApplicantRequest = {
  postingId: string;
  customQuestions: Array<{
    id: string;
    fields?: Array<{ value: string }>;
  }>;
  personalInformation: Array<{
    name: string;
    value: string;
  }>;
};

export async function POST(req: NextRequest): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Bad Request', { status: 405 });
  }

  try {
    const request = (await req.json()) as ProcessJobApplicantRequest;

    const email = request?.personalInformation?.find((x) => x.name === 'email')?.value;
    if (!request?.postingId || !email) {
      return Response.json(
        {
          message: 'Invalid parameters',
        },
        { status: 400 }
      );
    }

    const leverData = {
      customQuestions: request.customQuestions.map((q) => ({
        id: q.id,
        fields: q.fields?.map((f) => ({
          value: f.value,
        })),
      })),
      personalInformation: request.personalInformation.map((p) => ({
        name: p.name,
        value: p.value,
      })),
    };

    const response = await leverService.submitJobApplicant(request.postingId, leverData);
    if (!response.ok) {
      const text = await response.text();
      console.error('Lever error:', text);

      return Response.json(
        {
          message: `Lever failed: ${text}`,
        },
        { status: 400 }
      );
    }

    await sfmcTransactionMessagingService.sendEmailToSingleRecipient({
      account: 'AW',
      definitionKey: 'CandidateApplicationConfirmation_API',
      recipient: {
        contactKey: '',
        to: email,
        attributes: {},
      },
    });

    return Response.json({ message: 'Job Applicant Processed' }, { status: 200 });
  } catch (err) {
    console.error('Submit error:', err);
    return Response.json(
      { message: err instanceof Error ? err.message : 'Processing failed' },
      { status: 400 }
    );
  }
}
