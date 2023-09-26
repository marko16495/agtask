import { Component } from '@angular/core';
import {PostService} from './services/post.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(
    private postService: PostService
  ) {

    this.postService.create(
        'Test title', 'Test body',
    ).subscribe(response => {
      console.log(response);
      this.postService.getAll(0, 10).subscribe(console.log)

    })

  }

}
