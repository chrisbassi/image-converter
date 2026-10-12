package com.example.imgconverter;

import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.util.ThumbnailatorUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Locale;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "http://localhost:4200")
public class ImageController {

    @PostMapping("/convert")
    public ResponseEntity<?> convertImage(
        @RequestParam("file") MultipartFile file,
        @RequestParam("format") String format,
        @RequestParam("quality") float quality,
        @RequestParam(value = "maxWidth", required = false) String maxWidthStr,
        @RequestParam(value = "maxHeight", required = false) String maxHeightStr,
        @RequestParam(value = "rotation", required = false) String rotationStr) {

        String outFormat = format == null ? "" : format.trim().toLowerCase(Locale.ROOT);

        // O Java não grava todos os formatos (ex.: WEBP não vem por padrão).
        // Antes isso estourava como 500; agora vira 400 com mensagem clara.
        if (!ThumbnailatorUtils.isSupportedOutputFormat(outFormat)) {
            return ResponseEntity.badRequest()
                .body("Formato de saída não suportado: " + format);
        }

        try {
            Integer maxWidth = parseInteger(maxWidthStr);
            Integer maxHeight = parseInteger(maxHeightStr);
            Double rotation = parseDouble(rotationStr);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            Thumbnails.Builder<?> builder = Thumbnails.of(file.getInputStream());

            // O Thumbnailator EXIGE size ou scale. Sem largura/altura, escala 1.0
            // (mantém o tamanho original) em vez de deixar sem nada definido.
            if (maxWidth != null && maxHeight != null) {
                builder.size(maxWidth, maxHeight);
            } else if (maxWidth != null) {
                builder.width(maxWidth);
            } else if (maxHeight != null) {
                builder.height(maxHeight);
            } else {
                builder.scale(1.0);
            }

            // rotate() do Thumbnailator recebe GRAUS (não radianos).
            if (rotation != null) {
                builder.rotate(rotation);
            }

            builder.outputFormat(outFormat);

            // Qualidade só faz sentido em formato com perda (JPG).
            if (outFormat.equals("jpg") || outFormat.equals("jpeg")) {
                builder.outputQuality(quality);
            }

            builder.toOutputStream(outputStream);

            return ResponseEntity.ok()
                .header("Content-Type", contentTypeFor(outFormat))
                .body(outputStream.toByteArray());
        } catch (IOException | IllegalArgumentException e) {
            // IllegalArgumentException cobre entrada inválida/formato de origem não suportado (ex.: WEBP de entrada)
            return ResponseEntity.badRequest().body("Erro ao processar a imagem: " + e.getMessage());
        }
    }

    private String contentTypeFor(String format) {
        return format.equals("jpg") ? "image/jpeg" : "image/" + format;
    }

    private Integer parseInteger(String value) {
        if (value == null || value.isBlank() || value.equals("null") || value.equals("undefined")) {
            return null;
        }
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Double parseDouble(String value) {
        if (value == null || value.isBlank() || value.equals("null") || value.equals("undefined")) {
            return null;
        }
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}