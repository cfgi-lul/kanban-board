import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterTestingModule } from "@angular/router/testing";
import { TranslateModule } from "@ngx-translate/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { SignUpComponent } from "./sign-up.component";
import { AuthService } from "../core/api/auth.service";

describe("SignUpComponent", () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    const authServiceSpy = {
      register: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
        HttpClientTestingModule,
        SignUpComponent,
      ],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have form with only username and password fields", () => {
    const form = component.signUpForm;
    expect(form.contains("userName")).toBeTruthy();
    expect(form.contains("password")).toBeTruthy();
    expect(form.contains("name")).toBeFalsy();
    expect(form.contains("confirmPassword")).toBeFalsy();
  });

  it("should validate username is required", () => {
    const usernameControl = component.signUpForm.get("userName");
    expect(usernameControl?.errors?.["required"]).toBeTruthy();

    usernameControl?.setValue("testuser");
    expect(usernameControl?.errors?.["required"]).toBeFalsy();
  });

  it("should validate password is required", () => {
    const passwordControl = component.signUpForm.get("password");
    expect(passwordControl?.errors?.["required"]).toBeTruthy();

    passwordControl?.setValue("password123");
    expect(passwordControl?.errors?.["required"]).toBeFalsy();
  });

  it("should validate username minimum length", () => {
    const usernameControl = component.signUpForm.get("userName");
    usernameControl?.setValue("ab"); // Less than 3 characters
    expect(usernameControl?.errors?.["minlength"]).toBeTruthy();

    usernameControl?.setValue("abc"); // Exactly 3 characters
    expect(usernameControl?.errors?.["minlength"]).toBeFalsy();
  });

  it("should validate password minimum length", () => {
    const passwordControl = component.signUpForm.get("password");
    passwordControl?.setValue("12345"); // Less than 6 characters
    expect(passwordControl?.errors?.["minlength"]).toBeTruthy();

    passwordControl?.setValue("123456"); // Exactly 6 characters
    expect(passwordControl?.errors?.["minlength"]).toBeFalsy();
  });

  it("should be valid with proper username and password", () => {
    component.signUpForm.patchValue({
      userName: "testuser",
      password: "password123",
    });

    expect(component.signUpForm.valid).toBeTruthy();
  });
});
