# 🖼️ Image Converter — Frontend

Interface web em **Angular 17+** para conversão e otimização de imagens. Consome a API REST do backend Java e permite fazer upload, escolher formato, ajustar qualidade, redimensionar e rotacionar imagens em tempo real.

## 🚀 Tecnologias

- Angular 17+ (standalone components)
- TypeScript
- RxJS
- HTML5 + CSS3

## 📋 Funcionalidades

- Upload de imagens
- Preview da imagem selecionada
- Conversão entre formatos: JPG, PNG, WEBP e GIF
- Ajuste de qualidade (10% a 100%)
- Redimensionamento por largura/altura máxima
- Rotação em 90°, 180° ou 270°
- Exibição do tamanho original vs convertido com percentual de redução
- Download da imagem processada

## 🛠️ Como rodar localmente

### Pré-requisitos

- Node.js 18+
- Angular CLI: `npm install -g @angular/cli`
- Backend rodando em http://localhost:8080

### Passos

```bash
git clone https://github.com/chrisbassi/image-converter-angular.git
cd image-converter-angular
npm install
ng serve
