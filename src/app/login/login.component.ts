import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(
    public fb: FormBuilder,
    public http: HttpClient,
    public router: Router,
    public toastra: ToastrService,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      return this.toast.error({
        detail: 'Error',
        summary: 'Invalid Credentials',
        duration: 5000,
        position: 'bottomRight',
      });
    }

    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<any>(
        'https://buildcrmdev.apps.deeccus.com/apps/builder/api/login',
        loginData,
        { headers }
      )
      .subscribe((res) => {
        let user = res.find((res: any) => {
          return (
            res.email === this.loginForm.value.email &&
            res.password === this.loginForm.value.password
          );
        });
        if (user) {
          this.toast.success({
            detail: 'SUCCESS',
            summary: 'Successfully Login',
            duration: 5000,
            position: 'bottomRight',
          });

          this.loginForm.reset('');
          this.router.navigate(['/dashboard']);
        } else {
          this.toast.error({
            detail: 'Error',
            summary: 'Invalid Credentials',
            duration: 5000,
            position: 'bottomRight',
          });
        }
      });
  }
}
