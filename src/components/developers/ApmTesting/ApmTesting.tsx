'use client';

import Component from 'helpers/Component/Component';

function throwError(message: string = 'Test error') {
  throw new Error(message);
}

function throwApiError(message: string = 'Test API error') {
  fetch('/api/dev/throw-error', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
}

function ApmTesting_Default() {
  return (
    <>
      <Component fields={{ sectionId: { value: 'apm-testing' } }} variant="full">
        <button
          onClick={() => throwError('Test error for APM monitoring in Component')}
          className="col-span-12 bg-red-500 text-white px-4 py-2 rounded"
        >
          Throw Test Error in Component
        </button>
      </Component>
      <div className="section-grid grid grid-cols-2 md:grid-cols-12 px-m gap-s md:gap-s">
        <button
          onClick={() => throwError('Test error for APM monitoring out of Component')}
          className="col-span-12 bg-red-500 text-white px-4 py-2 rounded"
        >
          Throw Test Error out of Component
        </button>
        <button
          onClick={() => throwApiError('Test API error')}
          className="col-span-12 bg-red-500 text-white px-4 py-2 rounded"
        >
          Throw Test Error in API
        </button>
      </div>
    </>
  );
}

export const Default = ApmTesting_Default;
