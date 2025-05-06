package carevn.luv2code.MovieNest.service;

import carevn.luv2code.MovieNest.dto.BannerDTO;
import carevn.luv2code.MovieNest.entity.Banner;
import org.springframework.data.domain.Page;

import java.awt.print.Pageable;
import java.util.List;
import java.util.UUID;

public interface BannerService {

    BannerDTO createBanner(BannerDTO bannerDTO);

    List<Banner> getAllBanners();

    Page<BannerDTO> getBannersPageable(int page, int size);

    BannerDTO updateBanner(UUID bannerId, BannerDTO bannerDTO);

    void deleteBanner(UUID bannerId);
}
