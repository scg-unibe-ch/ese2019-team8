import {FormControl} from '@angular/forms';

export class UsernameValidator {
  static validUsername(fc: FormControl) {
    /** hardcoded two existing
     * usernames (“abc123” and “123abc”).
     */
    if (fc.value.toLowerCase() === 'abc123' || fc.value.toLowerCase() === '123abc') {
      return ({validUsername: true});
    } else {
      return null;
    }
  }
}
