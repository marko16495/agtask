import {DialogRef, DIALOG_DATA} from '@angular/cdk/dialog';
import {NgIf} from '@angular/common';
import {Component, Inject, OnInit} from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {Post} from '../../../models/post';

@Component({
    selector: 'app-post-update-dialog',
    templateUrl: './post-update-dialog.component.html',
    styleUrls: ['./post-update-dialog.component.scss'],
    imports: [
        ReactiveFormsModule,
        NgIf
    ],
    standalone: true
})
export class PostUpdateDialogComponent implements OnInit {

    formGroup = new FormGroup({
        title: new FormControl('', Validators.required),
        body: new FormControl('', Validators.required)
    });

    submit$ = new Subject<Post>();

    showLoader = false;

    constructor(
        public dialogRef: DialogRef<string>,
        @Inject(DIALOG_DATA) public data: Post
    ) { }

    ngOnInit() {
        this.formGroup.patchValue(this.data);
    }

    onSubmit() {
        if (this.formGroup.invalid) {
            return;
        }
        this.submit$.next({
            id: this.data.id,
            title: this.formGroup.value.title!,
            body: this.formGroup.value.body!,
        })
    }

    cancel() {
        this.dialogRef.close();
    }

}
