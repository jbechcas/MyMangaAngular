import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoTitulo'
})
export class FormatoTituloPipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value) return ''; 

    return value
      .split(' ')  
      .map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); 
      })
      .join(' ');
  }
}
