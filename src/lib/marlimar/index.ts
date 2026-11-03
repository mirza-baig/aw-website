import config from 'aw.config.server';

import { MarlimarService } from './marlimar-service';

const service = new MarlimarService(config.marlimar);

export default service;
