import {isDevMode} from '@angular/core';
import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {AppState} from '../models/app-state';
import {postReducer} from './post-reducers';

export const reducers: ActionReducerMap<AppState> = {
    posts: postReducer
};


export const metaReducers: MetaReducer<AppState>[] = isDevMode() ? [] : [];
