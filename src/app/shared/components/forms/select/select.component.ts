import { Component, EventEmitter, forwardRef, Input, Output } from "@angular/core";
import { GenericModule } from "../../../../../shareds/commons/GenericModule";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() id: string = ''; 
  @Input() label: string = '';
  @Input() options: any[] = [];
  @Input() selectedValue: any;
  @Output() selectionChange = new EventEmitter<string>();

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  onSelectionChange(value: string): void {
    this.onChange(value);  
    this.selectionChange.emit(value);
  }

  writeValue(value: any): void {
    if (value !== undefined) {
      this.selectedValue = value;
      this.onChange(value); // Isso assegura que o valor de ngModel também seja atualizado
      console.log('Valor recebido no SelectComponent:', value); // Console para verificar o valor recebido
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Não há necessidade de implementar isso para um seletor básico, mas pode ser necessário se você tiver requisitos de desativação do componente
  }
}
