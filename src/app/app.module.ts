import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {EffectsModule} from '@ngrx/effects';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GraphQLModule} from './graphql.module';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {PostEffects} from './state/effects/post-effects';
import {reducers, metaReducers} from './state/reducers';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        GraphQLModule,
        HttpClientModule,
        StoreModule.forRoot(reducers, {
            metaReducers
        }),
        EffectsModule.forRoot([
            PostEffects
        ])
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
