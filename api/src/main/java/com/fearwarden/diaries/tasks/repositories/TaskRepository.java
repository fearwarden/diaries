package com.fearwarden.diaries.tasks.repositories;

import com.fearwarden.diaries.tasks.models.PriorityEntity;
import com.fearwarden.diaries.tasks.models.StatusEntity;
import com.fearwarden.diaries.tasks.models.TaskEntity;
import com.fearwarden.diaries.users.models.CategoryEntity;
import com.fearwarden.diaries.users.models.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<TaskEntity, String>, JpaSpecificationExecutor<TaskEntity> {
    Optional<TaskEntity> findById(UUID id);
    Page<TaskEntity> findByUserEntityOrderByDueDesc(UserEntity user, Pageable pageable);
    Page<TaskEntity> findAllByUserEntityAndCategoryEntityOrderByDueDesc(UserEntity user, CategoryEntity category, Pageable pageable);
    Page<TaskEntity> findAllByUserEntityAndStatusEntityOrderByDueDesc(UserEntity user, StatusEntity status, Pageable pageable);
    Page<TaskEntity> findAllByUserEntityAndPriorityEntityOrderByDueDesc(UserEntity user, PriorityEntity priority, Pageable pageable);
    @Query("SELECT t.statusEntity.progress, COUNT(t) FROM TaskEntity t WHERE t.userEntity.id = :userId GROUP BY t.statusEntity.id")
    List<Object[]> countTaskEntitiesByStatusEntity(@Param("userId") UUID userId);
    @Query("SELECT t.priorityEntity.level, COUNT(t) from TaskEntity t WHERE t.userEntity.id = :userId GROUP BY t.priorityEntity.id")
    List<Object[]> countTaskEntitiesByPriorityEntity(@Param("userId") UUID userId);
    @Query("SELECT t.categoryEntity.name, COUNT(t) from TaskEntity t WHERE t.userEntity.id = :userId GROUP BY t.categoryEntity.id")
    List<Object[]> countTaskEntitiesByCategoryEntity(@Param("userId") UUID userId);
}

