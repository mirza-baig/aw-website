import config from 'aw.config.server';
import { environment } from 'startup/environment';

import { SFMCTransactionalMessagingService } from './sfmc-transactional-messaging-service';

const transactionalMessagingService = new SFMCTransactionalMessagingService(
  config.salesforce.marketingCloud,
  environment
);

export default transactionalMessagingService;
