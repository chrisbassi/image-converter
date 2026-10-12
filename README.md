# Conversor de Imagens

Chega de abrir o Photoshop só pra converter uma imagem. Envie o arquivo, escolha formato, qualidade, tamanho e rotação, e baixe o resultado. Rápido e grátis.

## O que faz

- Converte entre **JPG, PNG, WEBP e GIF**
- Ajusta a **qualidade** da compressão (10% a 100%)
- Redimensiona por **largura e/ou altura máxima**
- Gira a imagem em **90°, 180° ou 270°**
- Mostra o tamanho antes e depois, com o percentual de redução
- Baixa a imagem convertida com um clique

**Limites:** aceita arquivos GIF, JPG, PNG e WEBP de até 16 MB. GIFs animados perdem a animação (só o primeiro frame é usado).

## Tecnologias

| Camada   | Stack                                  |
| -------- | -------------------------------------- |
| Frontend | Angular (standalone components, signals) |
| Backend  | Java + Spring Boot (Maven)             |

## Estrutura do projeto

```
image-converter/
├── image-converter-frontend/   # aplicação Angular
├── src/                        # API Spring Boot
├── pom.xml
└── mvnw / mvnw.cmd             # Maven Wrapper
```

## Como rodar

### Pré-requisitos

- Java (versão definida no `pom.xml`)
- Node.js e npm
- Angular CLI (`npm install -g @angular/cli`)

### Backend

Na raiz do projeto:

```bash
./mvnw spring-boot:run
```

A API sobe, por padrão, em `http://localhost:8080`.

### Frontend

```bash
cd image-converter-frontend
npm install
ng serve
```

Abra `http://localhost:4200` no navegador.

## Como usar

1. Escolha uma imagem (arraste ou clique no campo de upload)
2. Defina o formato de saída, a qualidade, as dimensões e a rotação
3. Clique em **Converter**
4. Confira a redução de tamanho e clique em **Baixar imagem convertida**

## Autor

Feito por [Chris Bassi](https://github.com/chrisbassi). Portfólio em [behance.net/chrisbassi](https://behance.net/chrisbassi).
