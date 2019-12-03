export class ValidationMessages {

  static validationMessages = {
    username: [
      {type: 'required', message: 'Username is required.'},
      {type: 'minlength', message: 'Username must be at least 5 characters long.'},
      {type: 'maxlength', message: 'Username cannot be more than 25 characters long.'},
      {type: 'pattern', message: 'Your username can only contain letters and numbers..'},
      {type: 'validUsername', message: 'Your username has already been taken.'}
    ],
    password: [
      {type: 'required', message: 'Password is required.'},
      {type: 'minlength', message: 'Password must be at least 5 characters long.'},
      {
        type: 'pattern',
        message: 'Your password must contain at least one upper case letter, one lower case letter and one number.'
      },
    ],
    passwordConfirmation: [
      {type: 'required', message: 'Confirm password is required.'},
      {type: 'areEqual', message: 'Password mismatch'}
    ],
    email: [
      {type: 'pattern', message: 'This is not a valid email address.'},
      {type: 'required', message: 'Email is required.'},
    ],
    address: [
      {type: 'minlength', message: 'Address must be at least 3 characters long.'},
      {type: 'maxlength', message: 'Address cannot be more than 150 characters long.'},
      {type: 'pattern', message: 'Your Address can only contain letters, whitespaces and numbers..'}
    ],
    zip: [
      {type: 'minlength', message: 'Your zip code must be at least 4 characters long.'},
      {type: 'maxlength', message: 'Your zip code cannot be more than 6 characters long.'},
      {type: 'pattern', message: 'Your zip code can only contain numbers..'}
    ],
    city: [
      {type: 'minlength', message: 'City must be at least 2 characters long.'},
      {type: 'maxlength', message: 'City cannot be more than 25 characters long.'},
      {type: 'pattern', message: 'City can only contain letters.'}
    ],
    phoneNumber: [
      {type: 'minlength', message: 'Phone number must be at least 10 characters long.'},
      {type: 'maxlength', message: 'Phone number cannot be more than 12 characters long.'},
      {type: 'pattern', message: 'Please enter your phone number using only numbers.'}
    ],
    serviceName: [
      {type: 'required', message: 'Name of service is required.'},
      {type: 'minlength', message: 'Name of Service must be at least 2 characters long.'},
      {type: 'maxlength', message: 'Name of Service cannot be more than 25 characters long.'},
    ],
    price: [
      {type: 'max', message: 'Price cannot exceed 999\'999\'999 CHF.'},
      {type: 'pattern', message: 'Please enter a valid number..'}
    ],
    location: [
      {type: 'minlength', message: 'Location must be at least 2 characters long.'},
      {type: 'maxlength', message: 'Location cannot be more than 50 characters long.'},
      {type: 'pattern', message: 'Location can only contain letters, whitespaces and numbers..'}
    ],

    // more messages
  };
}
