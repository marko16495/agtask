import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {PostListComponent} from './post-list/post-list.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: PostListComponent
            }
        ])
    ],
    exports: [
        RouterModule,
    ]
})
export class PostRoutingModule {
}
