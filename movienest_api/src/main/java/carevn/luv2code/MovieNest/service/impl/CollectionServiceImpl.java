package carevn.luv2code.MovieNest.service.impl;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import carevn.luv2code.MovieNest.entity.Movie;
import carevn.luv2code.MovieNest.entity.User;
import carevn.luv2code.MovieNest.exception.AppException;
import carevn.luv2code.MovieNest.exception.ErrorCode;
import carevn.luv2code.MovieNest.repository.MovieRepository;
import carevn.luv2code.MovieNest.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import carevn.luv2code.MovieNest.dto.CollectionDTO;
import carevn.luv2code.MovieNest.entity.UserMovieCollection;
import carevn.luv2code.MovieNest.repository.UserMovieCollectionRepository;
import carevn.luv2code.MovieNest.service.CollectionService;

@Service
public class CollectionServiceImpl implements CollectionService {

    private final UserMovieCollectionRepository collectionRepository;

    private final UserRepository userRepository;

    private final MovieRepository movieRepository;

    public CollectionServiceImpl(UserMovieCollectionRepository collectionRepository, UserRepository userRepository, MovieRepository movieRepository) {
        this.collectionRepository = collectionRepository;
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
    }

    @Override
    @Transactional
    public CollectionDTO collectMovie(UUID userId, UUID movieId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_EXISTED));

        if (collectionRepository.existsByUserAndMovie(user, movie)) {
            throw new AppException(ErrorCode.USER_HAS_COLLECTED_MOVIE);
        }

        UserMovieCollection collection = UserMovieCollection.builder().user(user).movie(movie).collectedAt(new Date()).build();

        collection = collectionRepository.save(collection);

        return mapToCollectionDTO(collection);
    }


    @Override
    @Transactional
    public void unCollectMovie(UUID userId, UUID movieId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_EXISTED));

        UserMovieCollection collection = collectionRepository.findByUserAndMovie(user, movie)
                .orElseThrow(() -> new AppException(ErrorCode.USER_HAS_NOT_COLLECTED_MOVIE));

        collectionRepository.delete(collection);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CollectionDTO> getAllCollectionsByUser(UUID userId) {
        userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return collectionRepository.findByUserIdOrderByCollectedAtDesc(userId).stream().map(this::mapToCollectionDTO).collect(Collectors.toList());
    }

    private CollectionDTO mapToCollectionDTO(UserMovieCollection collection) {
        return CollectionDTO.builder().id(collection.getId()).userId(collection.getUser().getId()).movieId(collection.getMovie().getId()).movieTitle(collection.getMovie().getTitle()).posterPath(collection.getMovie().getPosterPath()).voteAverage(collection.getMovie().getVoteAverage()).collectedAt(collection.getCollectedAt()).build();
    }

}
