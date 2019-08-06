import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { AuthModule } from './auth/auth.module';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AuthUser } from './providers/auth-user';

import { Keyboard } from '@ionic-native/keyboard/ngx';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [HttpClientModule, HttpModule, BrowserModule, IonicModule.forRoot(), AppRoutingModule, AuthModule,
            AngularFireModule.initializeApp({
              apiKey: "",
              authDomain: "",
              databaseURL: "",
              projectId: "",
              storageBucket: "",
              messagingSenderId: "",
              appId: ""
            }),
            AngularFireAuthModule, AngularFireDatabaseModule, AngularFirestoreModule],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    AuthUser,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
