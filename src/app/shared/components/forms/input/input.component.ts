import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() type: string = 'text';

  value: string = '';
  disabled = false;

  // Funções obrigatórias do ControlValueAccessor
  onChange: (_: any) => void = () => {};
  onTouched: () => void = () => {};

  // Recebe valor externo
  writeValue(value: any): void {
    this.value = value;
  }

  // Registra mudança
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Registra toque
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Estado de desabilitado
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
