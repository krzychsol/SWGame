import { bootstrapApplication, enableDebugTools } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ApplicationRef } from '@angular/core';

bootstrapApplication(AppComponent, appConfig).then((moduleRef) => {
  const appRef = moduleRef.injector.get(ApplicationRef);
  const componentRef = appRef.components[0];
  enableDebugTools(componentRef);
}).catch((err) => console.error(err));
