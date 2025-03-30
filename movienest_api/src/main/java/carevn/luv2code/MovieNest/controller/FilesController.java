package carevn.luv2code.MovieNest.controller;

import carevn.luv2code.MovieNest.entity.FileInfo;
import carevn.luv2code.MovieNest.exception.ErrorCode;
import carevn.luv2code.MovieNest.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@CrossOrigin("http://localhost:8081")
@RequestMapping("/api/storage")
public class FilesController {

    @Autowired
    FileStorageService storageService;

//    @PostMapping("/upload")
//    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
//        String message = "";
//
//        try {
//            storageService.save(file);
//
//            message = "File uploaded successfully: " + file.getOriginalFilename();
//            return ResponseEntity.status(HttpStatus.OK).body(message);
//        } catch (Exception e) {
//            message = "Can not upload file: " + file.getOriginalFilename();
//            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(message);
//        }
//    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            storageService.save(file);

            String filename = file.getOriginalFilename();
            String fileUrl = MvcUriComponentsBuilder
                    .fromMethodName(FilesController.class, "getFile", filename)
                    .build()
                    .toUri()
                    .toString();

            Map<String, String> response = new HashMap<>();
            response.put("filename", filename);
            response.put("url", fileUrl);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            throw new RuntimeException("Could not upload the file: " + e.getMessage());
        }
    }

    @GetMapping("/files")
    public ResponseEntity<List<FileInfo>> getListFiles() {
        List<FileInfo> fileInfos = storageService.loadAll().map(path ->
        {
            String filename = path.getFileName().toString();
            String url = MvcUriComponentsBuilder
                    .fromMethodName(FilesController.class,
                            "getFile",
                            path.getFileName()
                                    .toString())
                    .build()
                    .toUri()
                    .toString();

            return new FileInfo(filename, url);
        }).collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(fileInfos);
    }

    @GetMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        Resource file = storageService.load(filename);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\""
                        + file.getFilename() + "\"").body(file);
    }
}
