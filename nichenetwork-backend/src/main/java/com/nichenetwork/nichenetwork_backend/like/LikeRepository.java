package com.nichenetwork.nichenetwork_backend.like;

import com.nichenetwork.nichenetwork_backend.community.Community;
import com.nichenetwork.nichenetwork_backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    //like ai post
    boolean existsByUserIdAndPostId(Long userId, Long postId);
    int countByPostId(Long postId);
    void deleteByUserIdAndPostId(Long userId, Long postId);

    //like ai commenti
    boolean existsByUserIdAndCommentId(Long userId, Long commentId);
    int countByCommentId(Long commentId);
    void deleteByUserIdAndCommentId(Long userId, Long commentId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query("DELETE FROM Like l WHERE l.post.id IN :postIds")
    void deleteByPostIdIn(@Param("postIds") List<Long> postIds);


    @Modifying
    @Query("DELETE FROM Like l WHERE l.user = :user")
    void deleteByUser(@Param("user") User user);

    @Modifying
    @Query("DELETE FROM Like l WHERE l.post.user.id = :userId")
    void deleteByPostUserId(@Param("userId") Long userId);


    @Modifying
    @Transactional
    @Query("DELETE FROM Like l WHERE l.post IN (SELECT p FROM Post p WHERE p.user = :user AND p.community = :community)")
    void deleteLikesByUserAndCommunity(@Param("user") User user, @Param("community") Community community);

    void deleteByPostId(Long id);
}
