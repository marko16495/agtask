import {DialogRef} from '@angular/cdk/dialog';
import {NgIf} from '@angular/common';
import {Component} from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {CreatePost} from '../../../models/create-post';

@Component({
    selector: 'app-post-create-dialog',
    templateUrl: './post-create-dialog.component.html',
    styleUrls: ['./post-create-dialog.component.scss'],
    imports: [
        ReactiveFormsModule,
        NgIf
    ],
    standalone: true
})
export class PostCreateDialogComponent {

    formGroup = new FormGroup({
        title: new FormControl('', Validators.required),
        body: new FormControl('', Validators.required)
    });

    submit$ = new Subject<CreatePost>();

    showLoader = false;

    constructor(public dialogRef: DialogRef<string>) { }

    submit() {
        if (this.formGroup.invalid) {
            return;
        }
        this.submit$.next({
            title: this.formGroup.value.title!,
            body: this.formGroup.value.body!,
        })
    }

    cancel() {
        this.dialogRef.close();
    }

}
