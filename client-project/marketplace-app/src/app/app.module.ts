import { ProjectModule } from './modules/project/project.module';
import { RegisterModule } from './modules/register/register.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RegisterModule,
    BrowserAnimationsModule,
    SharedModule,
    ProjectModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
