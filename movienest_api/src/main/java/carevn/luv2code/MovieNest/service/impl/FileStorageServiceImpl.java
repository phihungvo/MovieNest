package carevn.luv2code.MovieNest.service.impl;

import carevn.luv2code.MovieNest.service.FileStorageService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Stream;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final Path root = Paths.get("uploads");

    @PostConstruct
    public void initialize() {
        init();
    }

    @Override
    public void init() {
        try {
            Files.createDirectories(root); // Ensure the directory exists
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }

    @Override
    public String save(MultipartFile file) {
        try {
            String filename = file.getOriginalFilename();
            Path filePath = this.root.resolve(filename);

            if (Files.exists(filePath)) {
                return filename;
            }
            Files.copy(file.getInputStream(), filePath);
            return filename;
        } catch (Exception e) {
            if (e instanceof FileAlreadyExistsException) {
                return file.getOriginalFilename();
            }

            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public boolean fileExists(String filename) {
        Path filePath = this.root.resolve(filename);
        return Files.exists(filePath);
    }

    @Override
    public Resource load(String filename) {
        try {
            Path file = root.resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return resource;
            }else {
                throw new RuntimeException("Could not read file: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error : " + e.getMessage());
        }
    }

    @Override
    public void deleteAll() {
        FileSystemUtils.deleteRecursively(this.root.toFile());
    }

    @Override
    public Stream<Path> loadAll() {
        try {
            return Files.walk(this.root, 1).filter(path -> !path.equals(this.root)).map(this.root::relativize);
        } catch (IOException e) {
            throw new RuntimeException("Could not load the files!");
        }
    }
}
