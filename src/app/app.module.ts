import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalRedirectComponent, MsalService, ProtectedResourceScopes } from '@azure/msal-angular';
import { IPublicClientApplication, InteractionType, PublicClientApplication } from '@azure/msal-browser';

function MsalInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth : {
      clientId: 'clientId',
      authority: 'authority',
      redirectUri: 'http://localhost:4200'
    },
    cache: {
      cacheLocation:'sessionStorage'
    }
  })
}

function MsalGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['user.read']
    }
  }
}

function MsalInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap : protectedResourceMap
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide:  MSAL_INSTANCE,
      useFactory: MsalInstanceFactory
    },
    {
      provide:  MSAL_GUARD_CONFIG,
      useFactory: MsalGuardConfigFactory
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi:true
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MsalInterceptorConfigFactory
    },
    MsalService,
    MsalBroadcastService,
    MsalGuard
  ],
  bootstrap: [AppComponent,MsalRedirectComponent]
})
export class AppModule { }
