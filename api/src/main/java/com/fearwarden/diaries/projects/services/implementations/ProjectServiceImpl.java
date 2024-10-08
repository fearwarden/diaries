package com.fearwarden.diaries.projects.services.implementations;

import com.fearwarden.diaries.projects.dto.response.ProjectDto;
import com.fearwarden.diaries.projects.enums.ProjectRole;
import com.fearwarden.diaries.projects.exceptions.throwables.InvalidMembersException;
import com.fearwarden.diaries.projects.exceptions.throwables.ProjectDoesNotExistsException;
import com.fearwarden.diaries.projects.mappers.ProjectMapper;
import com.fearwarden.diaries.projects.models.ProjectEntity;
import com.fearwarden.diaries.projects.models.ProjectMembershipEntity;
import com.fearwarden.diaries.projects.repositories.ProjectMembershipRepository;
import com.fearwarden.diaries.projects.repositories.ProjectRepository;
import com.fearwarden.diaries.projects.services.ProjectService;
import com.fearwarden.diaries.projects.tools.ProjectHelperFunctions;
import com.fearwarden.diaries.users.dto.response.UserDto;
import com.fearwarden.diaries.users.models.UserEntity;
import com.fearwarden.diaries.users.services.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.file.Paths;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {
    @Value("${file.upload-dir}")
    private String uploadDir;
    @Value("${file.name.placeholder-image}")
    private String placeholderImage;

    private final ProjectRepository projectRepository;
    private final ProjectMembershipRepository projectMembershipRepository;
    private final ProjectMapper projectMapper;

    private final UserService userService;

    @Override
    @Transactional
    public ProjectDto createProject(String name, List<UserDto> members, UserEntity user) {
        // Check if all members are valid
        if (!userService.checkIfUsersExist(members)) {
            throw new InvalidMembersException();
        }
        // Check for duplicates, if exists, remove them
        if (ProjectHelperFunctions.checkForDuplicates(members)) {
            Set<UserDto> uniqueMembers = new HashSet<>(members);
            members.clear();
            members.addAll(uniqueMembers);
        }
        // Load project placeholder image
        String imagePath = Paths.get(uploadDir, placeholderImage).toString();

        ProjectEntity project = new ProjectEntity();
        project.setName(name);
        project.setIconPath(imagePath);
        projectRepository.save(project);

        // Create project membership
        List<ProjectMembershipEntity> createdMembers = new ArrayList<>();
        // Create admin of the project
        UserEntity adminUser = userService.findUserById(user.getId());
        ProjectMembershipEntity admin = new ProjectMembershipEntity();
        admin.setProjectEntity(project);
        admin.setUserEntity(adminUser);
        admin.setProjectRole(ProjectRole.ADMIN);
        createdMembers.add(admin);
        if (!members.isEmpty()) {
            for (UserDto member : members) {
                ProjectMembershipEntity membership = new ProjectMembershipEntity();
                membership.setProjectEntity(project);
                UserEntity userEntity = userService.findUserById(member.id());
                membership.setUserEntity(userEntity);
                createdMembers.add(membership);
            }
        }
        projectMembershipRepository.saveAll(createdMembers);
        return projectMapper.toDto(project);
    }

    @Override
    public List<ProjectDto> getAllProjects(UserEntity user) {
        Set<ProjectMembershipEntity> memberships = projectMembershipRepository.findAllByUserEntity(user);
        List<ProjectEntity> projects = new ArrayList<>();
        for (ProjectMembershipEntity membership : memberships) {
            projects.add(projectRepository.findAllById(membership.getProjectEntity().getId()));
        }
        return projects.stream().map(projectMapper::toDto).toList();
    }

    @Override
    public ProjectDto getProject(String projectId) {
        ProjectEntity project = projectRepository.findById(UUID.fromString(projectId))
                .orElseThrow(() -> new ProjectDoesNotExistsException(projectId));
        return projectMapper.toDto(project);
    }

    @Override
    public ProjectEntity getProjectEntity(String projectId) {
        return projectRepository.findById(UUID.fromString(projectId))
                .orElseThrow(() -> new ProjectDoesNotExistsException(projectId));
    }

    @Override
    @Transactional
    public void deleteProject(String projectId) {
        ProjectEntity project =
                projectRepository.findById(UUID.fromString(projectId))
                        .orElseThrow(() -> new ProjectDoesNotExistsException(projectId));
        projectRepository.delete(project);
    }
}
