import config from 'aw.config';
import environment from 'lib/environment';

import { SFMCTransactionalMessagingService } from './sfmc-transactional-messaging-service';

const transactionalMessagingService = new SFMCTransactionalMessagingService(
  config.salesforce.marketingCloud,
  environment
);

export default transactionalMessagingService;
