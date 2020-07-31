import { AbstractControl, ValidatorFn } from '@angular/forms';

export function NoBadCharacters(control: AbstractControl): { [key: string]: any } {
    const str = String(control.value).replace(/[|&;$%@"<>()+,]/g, '').trim();
    return str.length !== 0 ? null : { badformat: true };
}
