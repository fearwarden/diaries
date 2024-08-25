package com.fearwarden.diaries.metadata.services;

import com.fearwarden.diaries.metadata.dto.TypeEntityDto;
import com.fearwarden.diaries.metadata.mappers.TypeEntityMapper;
import com.fearwarden.diaries.metadata.repositories.TypeEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MetadataService {
    private final TypeEntityRepository typeEntityRepository;
    private final TypeEntityMapper typeEntityMapper;

    public List<TypeEntityDto> getAllTypes() {
        return typeEntityRepository.findAll().stream().map(typeEntityMapper::toDto).toList();
    }
}