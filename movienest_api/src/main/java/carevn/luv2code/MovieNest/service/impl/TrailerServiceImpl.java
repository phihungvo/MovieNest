package carevn.luv2code.MovieNest.service.impl;

import carevn.luv2code.MovieNest.dto.TrailerDTO;
import carevn.luv2code.MovieNest.entity.Movie;
import carevn.luv2code.MovieNest.entity.Trailer;
import carevn.luv2code.MovieNest.enums.TrailerType;
import carevn.luv2code.MovieNest.exception.AppException;
import carevn.luv2code.MovieNest.exception.ErrorCode;
import carevn.luv2code.MovieNest.mapper.TrailerMapper;
import carevn.luv2code.MovieNest.repository.MovieRepository;
import carevn.luv2code.MovieNest.repository.TrailerRepository;
import carevn.luv2code.MovieNest.service.TrailerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.EnumSet;
import java.util.List;
import java.util.UUID;

@Service
public class TrailerServiceImpl implements TrailerService {

    private final TrailerRepository trailerRepository;

    private final MovieRepository movieRepository;

    private final TrailerMapper trailerMapper;

    public TrailerServiceImpl(TrailerRepository trailerRepository, MovieRepository movieRepository, TrailerMapper trailerMapper) {
        this.trailerRepository = trailerRepository;
        this.movieRepository = movieRepository;
        this.trailerMapper = trailerMapper;
        System.out.println("TrailerMapper Bean: " + trailerMapper);
    }

    @Override
    public void createTrailer(TrailerDTO trailerDTO) {
        boolean existedTrailer = trailerRepository.existsByTitleAndKey(trailerDTO.getTitle(), trailerDTO.getKey());

        if (existedTrailer) {
            throw new AppException(ErrorCode.TRAILER_EXISTED);
        }

        if (!EnumSet.allOf(TrailerType.class).contains(trailerDTO.getTrailerType())) {
            throw new AppException(ErrorCode.INVALID_TRAILER_TYPE);
        }

        Trailer trailer = trailerMapper.toEntity(trailerDTO);

        trailerRepository.save(trailer);
    }

    @Override
    public Page<Trailer> findAllTrailers(int page, int size, String keyWord) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        Page<Trailer> trailerPage;

        if (keyWord != null && !keyWord.trim().isEmpty()) {
            trailerPage = trailerRepository.findByTitleContainingIgnoreCase(keyWord, pageable);
        }else {
            trailerPage = trailerRepository.findAll(pageable);
        }
        return trailerPage;
    }

    @Override
    public List<Trailer> findAllTrailersNoPagination() {
        return trailerRepository.findAll();
    }

    @Override
    public List<Trailer> getTrailersByMovieId(UUID movieId) {
        return trailerRepository.findByMovieId(movieId);
    }

    @Override
    public Trailer getTrailerById(UUID trailerId) {
        Trailer trailer = trailerRepository.findById(trailerId)
                .orElseThrow(() -> new RuntimeException("Trailer not found"));
        return trailer;
    }

    @Override
    public Trailer updateTrailer(UUID trailerId, TrailerDTO trailerDTO) {
        Trailer trailer = trailerRepository.findById(trailerId)
                .orElseThrow(() -> new AppException(ErrorCode.TRAILER_NOT_FOUND));

        trailer.setTitle(trailerDTO.getTitle());
        trailer.setKey(trailerDTO.getKey());
        trailer.setSite(trailerDTO.getSite());
        trailer.setTrailerType(trailerDTO.getTrailerType());
        trailer.setOfficial(trailerDTO.isOfficial());
        trailer.setPublishedAt(trailerDTO.getPublishedAt());

        return trailerRepository.save(trailer);
    }

    @Override
    public void deleteTrailer(UUID trailerId) {
        Trailer trailer = trailerRepository.findById(trailerId)
                .orElseThrow(() -> new AppException(ErrorCode.TRAILER_NOT_FOUND));

        trailerRepository.delete(trailer);
    }
}
