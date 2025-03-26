package com.nichenetwork.nichenetwork_backend.post;

import com.nichenetwork.nichenetwork_backend.community.Community;
import com.nichenetwork.nichenetwork_backend.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Page<Post> findByCommunityIdOrderByCreatedAtDesc(Long communityId, Pageable pageable);

    boolean existsByIdAndUser(Long id, User user);

    @Modifying
    @Query("DELETE FROM Post p WHERE p.id = :postId")
    void deletePostById(@Param("postId") Long postId);

    @Modifying
    @Query("DELETE FROM Post p WHERE p.user = :user")
    void deleteByUser(@Param("user") User user);

    @Modifying
    @Query("DELETE FROM Post p WHERE p.user.id = :id")
    void deleteByUserId(Long id);

    Page<Post> findByUserIdInOrderByCreatedAtDesc(List<Long> followingIds, PageRequest of);

    @Modifying
    @Transactional
    @Query("DELETE FROM Post p WHERE p.user = :user AND p.community = :community")
    void deleteByUserAndCommunity(@Param("user") User user, @Param("community") Community community);


    List<Post> findByCommunity(Community community);
}
