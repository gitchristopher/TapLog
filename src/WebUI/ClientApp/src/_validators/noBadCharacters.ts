import { AbstractControl, ValidatorFn } from '@angular/forms';

export function NoBadCharacters(control: AbstractControl): { [key: string]: any } {
    if (control.value === null || control.value?.length === 0) {
        return null;
    }
    const len = String(control.value).length;
    const str = String(control.value).replace(/([^A-z0-9]+)/gi, '-').trim();
    return str.length !== len ? null : { badformat: true };
}
