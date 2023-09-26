import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: 'posts',
        loadChildren: () => import('./modules/post/post.module').then(m => m.PostModule)
    },
    {
        path: '',
        redirectTo: 'posts',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
