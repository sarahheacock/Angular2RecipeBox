//import './pol'
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Load 3rd party dependencies
// require('jquery');
// require('jquery.ui.widget');
// require('jquery.iframe-transport');
// require('jquery.fileupload');


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
