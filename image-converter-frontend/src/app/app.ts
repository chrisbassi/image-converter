import { Component } from '@angular/core';
import { ImageConverter } from './features/image-converter/image-converter';
import { ScrollingBg } from './scrolling-bg/scrolling-bg';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ImageConverter, ScrollingBg],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  arquivoExistente = {
    id: '1',
    name: 'documento.pdf',
    size: 245000,
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    type: 'pdf'
  };
}