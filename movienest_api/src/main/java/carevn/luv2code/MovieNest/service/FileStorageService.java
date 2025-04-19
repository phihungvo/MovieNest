package carevn.luv2code.MovieNest.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.stream.Stream;

public interface FileStorageService {

    public void init();

    public String save(MultipartFile file);

    boolean fileExists(String filename);

    public Resource load(String filename);

    public void deleteAll();

    public Stream<Path> loadAll();
}
