package carevn.luv2code.MovieNest.controller;

import carevn.luv2code.MovieNest.dto.BannerDTO;
import carevn.luv2code.MovieNest.entity.Banner;
import carevn.luv2code.MovieNest.service.BannerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Controller
@RequestMapping("/api/banner")
public class BannerController {

    private final BannerService bannerService;

    public BannerController(BannerService bannerService) {
        this.bannerService = bannerService;
    }

    @PostMapping("/create")
    public ResponseEntity<BannerDTO> createBanner(@RequestBody BannerDTO banner) {
        BannerDTO result = bannerService.createBanner(banner);
        return ResponseEntity.ok(result);
    }

    @GetMapping()
    public ResponseEntity<List<Banner>> getAllBannersNoPageable() {
        List<Banner> result = bannerService.getAllBanners();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/getAll")
    public ResponseEntity<Page<BannerDTO>> getAllBanners(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Page<BannerDTO> banners = bannerService.getBannersPageable(page, size);
        return ResponseEntity.ok(banners);
    }

    @PutMapping("/update/{bannerId}")
    public ResponseEntity<BannerDTO> updateBanner(@PathVariable UUID bannerId, @RequestBody BannerDTO bannerDTO) {
        BannerDTO result = bannerService.updateBanner(bannerId, bannerDTO);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{bannerId}")
    public ResponseEntity<String> deleteBanner(@PathVariable UUID bannerId) {
        bannerService.deleteBanner(bannerId);
        return ResponseEntity.ok("Banner deleted!");
    }

}
