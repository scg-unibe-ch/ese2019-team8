import { UsernameValidator } from './username.validator';
import { PasswordValidator } from './password.validator';
import {FormControl, FormGroup, Validators} from '@angular/forms';


this.validations_form = this.formBuilder.group({
  username: new FormControl('', Validators.compose([
    UsernameValidator.validUsername,
    Validators.maxLength(25),
    Validators.minLength(5),
    Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
    Validators.required
  ])),
});
this.matching_passwords_group = new FormGroup({
  password: new FormControl('', Validators.compose([
    Validators.minLength(5),
    Validators.required,
    Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
  ])),
  confirm_password: new FormControl('', Validators.required)
}, (formGroup: FormGroup) => {
  return PasswordValidator.areEqual(formGroup);
});

this.validation_messages = {
  username: [
    { type: 'required', message: 'Username is required.' },
    { type: 'minlength', message: 'Username must be at least 5 characters long.' },
    { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
    { type: 'pattern', message: 'Your username must contain only numbers and letters.' },
    { type: 'validUsername', message: 'Your username has already been taken.' }
  ],
  password: [
    { type: 'required', message: 'Password is required.' },
    { type: 'minlength', message: 'Password must be at least 5 characters long.' },
    { type: 'pattern', message: 'Your Password must contain only numbers and letters.' },
  ],
  confirm_password: [
    {type: 'required', message: 'Confirm password is required.'},
    {type: 'areEqual', message: 'Password mismatch'}
  ],
  // more messages
};


