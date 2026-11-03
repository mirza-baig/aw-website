import config from 'aw.config.server';

import { SendGridService } from './send-grid-service';

const service = new SendGridService(config.sendGrid);

export default service;
