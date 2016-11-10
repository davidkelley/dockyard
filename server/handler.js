'use strict';

// You can add more handlers here, and reference them in serverless.yml

import poller from './lib/poller';
import update from './lib/update';

export { poller, update };
