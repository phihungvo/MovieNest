package carevn.luv2code.MovieNest.service;

import java.util.List;
import java.util.UUID;

import carevn.luv2code.MovieNest.dto.CollectionDTO;

public interface CollectionService {
    
    CollectionDTO collectMovie(UUID userId, UUID movieId);

    void unCollectMovie(UUID userId, UUID movieId);

    List<CollectionDTO> getAllCollectionsByUser(UUID userId);
    
}
