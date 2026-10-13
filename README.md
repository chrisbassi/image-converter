<div align="center">

# 🖼️ Conversor de Imagens

**Chega de abrir o Photoshop só pra converter uma imagem.**

Envie o arquivo, escolha formato, qualidade, tamanho e rotação, e baixe o resultado.
Rápido, grátis e sem cadastro.

![Angular](https://img.shields.io/badge/Angular-22-DD0031?style=flat-square&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Java](https://img.shields.io/badge/Java-17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?style=flat-square&logo=vitest&logoColor=white)

[Funcionalidades](#-funcionalidades) · [Como funciona](#-como-funciona) · [Rodando localmente](#-rodando-localmente) · [Estrutura](#-estrutura-do-projeto) · [API](#-api)

</div>

---

## ✨ Funcionalidades

| | |
| --- | --- |
| 🔄 **Conversão** | Entre **JPG, PNG e WEBP** |
| 🎚️ **Qualidade** | Compressão ajustável de 10% a 100% |
| 📐 **Redimensionamento** | Por largura e/ou altura máxima |
| 🔃 **Rotação** | 90°, 180° ou 270° |
| 📉 **Comparativo** | Tamanho antes e depois, com percentual de redução |
| ⬇️ **Download** | Imagem convertida com um clique |

> **Limites:** aceita GIF, JPG, PNG e WEBP de até **16 MB**. GIFs animados perdem a animação (só o primeiro frame é usado).

## ⚙️ Como funciona

A conversão roda **direto no navegador**, usando a Canvas API. A imagem não sai da máquina do usuário: nada de upload, nada de fila, nada de servidor guardando arquivo dos outros.

```
Arquivo ──► <img> ──► <canvas> (resize + rotate) ──► canvas.toBlob(formato, qualidade) ──► download
```

O repositório também traz uma **API em Spring Boot** com [Thumbnailator](https://github.com/coobird/thumbnailator) que faz o mesmo processamento no servidor, útil como alternativa ou pra integrações.

## 🚀 Rodando localmente

### Pré-requisitos

- **Node.js** + npm
- **Angular CLI** → `npm install -g @angular/cli`
- **Java 17+** (só se for rodar a API)

### Frontend

```bash
cd image-converter-frontend
npm install
npm start
```

Abra **http://localhost:4200**.

### Backend (opcional)

Na raiz do projeto:

```bash
./mvnw spring-boot:run
```

A API sobe em **http://localhost:8080**.

### Os dois de uma vez

Tem um `start.sh` que valida o ambiente, sobe backend e frontend, espera as portas abrirem e derruba tudo junto no `Ctrl+C`:

```bash
chmod +x start.sh
./start.sh
```

> O script assume o projeto em `/var/www/imgconverter`. Ajuste a variável `BASE_DIR` no topo se estiver em outro lugar. As portas podem ser trocadas com `BACKEND_PORT` e `FRONTEND_PORT`.

### Testes

```bash
cd image-converter-frontend
npm test
```

## 🗂️ Estrutura do projeto

```
image-converter/
├── image-converter-frontend/        # Angular (standalone components + signals, SSR)
│   └── src/app/
│       ├── features/image-converter/   # tela principal
│       ├── services/image.ts           # conversão via Canvas
│       ├── shared/                     # button, dropdown, input, file-uploader
│       └── scrolling-bg/               # fundo animado
├── src/main/java/.../imgconverter/  # API Spring Boot
│   └── ImageController.java
├── pom.xml
├── mvnw / mvnw.cmd                  # Maven Wrapper
└── start.sh                         # sobe tudo de uma vez
```

## 🔌 API

`POST /api/images/convert` — `multipart/form-data`

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | :---: | --- |
| `file` | arquivo | ✅ | Imagem de entrada |
| `format` | string | ✅ | `jpg`, `png`, `gif`… (o que o Java souber gravar) |
| `quality` | float | ✅ | `0.0` a `1.0` (aplicado só em JPG) |
| `maxWidth` | int | | Largura máxima |
| `maxHeight` | int | | Altura máxima |
| `rotation` | number | | Rotação em graus |

Retorna os bytes da imagem convertida, ou `400` com mensagem se o formato não for suportado ou a imagem for inválida.

```bash
curl -X POST http://localhost:8080/api/images/convert \
  -F "file=@foto.png" -F "format=jpg" -F "quality=0.8" -F "maxWidth=1200" \
  --output foto.jpg
```

> Por padrão, o Java não lê nem grava WEBP. Pra isso no backend, seria preciso adicionar um plugin ImageIO (ex.: TwelveMonkeys).

## 👤 Autor

Feito por **Chris Bassi**, dev full stack e designer UI/UX.

[![GitHub](https://img.shields.io/badge/GitHub-chrisbassi-181717?style=flat-square&logo=github)](https://github.com/chrisbassi)
[![Behance](https://img.shields.io/badge/Behance-chrisbassi-1769FF?style=flat-square&logo=behance&logoColor=white)](https://behance.net/chrisbassi)
