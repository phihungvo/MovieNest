package carevn.luv2code.MovieNest.service.impl;

import carevn.luv2code.MovieNest.dto.BannerDTO;
import carevn.luv2code.MovieNest.entity.Banner;
import carevn.luv2code.MovieNest.entity.Movie;
import carevn.luv2code.MovieNest.mapper.BannerMapper;
import carevn.luv2code.MovieNest.repository.BannerRepository;
import carevn.luv2code.MovieNest.repository.MovieRepository;
import carevn.luv2code.MovieNest.service.BannerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class BannerServiceImpl implements BannerService {

    private final MovieRepository movieRepository;

    private final BannerMapper bannerMapper;

    private final BannerRepository bannerRepository;

    public BannerServiceImpl(MovieRepository movieRepository,
                             BannerMapper bannerMapper,
                             BannerRepository bannerRepository) {
        this.movieRepository = movieRepository;
        this.bannerMapper = bannerMapper;
        this.bannerRepository = bannerRepository;
    }

    @Override
    public BannerDTO createBanner(BannerDTO bannerDTO) {
        Banner banner = BannerMapper.toEntity(bannerDTO);
        bannerRepository.save(banner);
        return BannerMapper.toDTO(banner);
    }

    @Override
    public List<Banner> getAllBanners() {
        return bannerRepository.findAll();
    }

    @Override
    public Page<BannerDTO> getBannersPageable(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Banner> bannersPage = bannerRepository.findAll(pageable);
        return bannersPage.map(BannerMapper::toDTO);
    }

    @Override
    public BannerDTO updateBanner(UUID bannerId, BannerDTO bannerDTO) {
        Banner banner = bannerRepository.findById(bannerId)
                .orElseThrow(() -> new RuntimeException("Banner not found"));

        banner.setTitle(bannerDTO.getTitle());
        banner.setType(bannerDTO.getType());
        banner.setImageUrl(bannerDTO.getImageUrl());
        if (bannerDTO.getMovieId() != null){
            Movie movie = movieRepository.findById(bannerDTO.getMovieId())
                    .orElseThrow(() -> new RuntimeException("Movie not found"));
            banner.setMovie(movie);
        }
        bannerRepository.save(banner);
        return BannerMapper.toDTO(banner);
    }

    @Override
    public void deleteBanner(UUID bannerId) {
        bannerRepository.deleteById(bannerId);
    }
}
