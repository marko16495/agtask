import {NgModule} from '@angular/core';
import {PostListComponent} from './post-list/post-list.component';
import {PostRoutingModule} from './post-routing.module';

@NgModule({
    imports: [
        PostRoutingModule,
        PostListComponent,

    ],
    declarations: []
})
export class PostModule {

}
