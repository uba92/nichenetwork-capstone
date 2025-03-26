package com.nichenetwork.nichenetwork_backend.comment;

import com.nichenetwork.nichenetwork_backend.community.Community;
import com.nichenetwork.nichenetwork_backend.post.Post;
import com.nichenetwork.nichenetwork_backend.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPost(Post post);

    boolean existsByIdAndUserId(Long commentId, Long userId);

    Page<Comment> findByPostId(Long postId, PageRequest of);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query("DELETE FROM Comment c WHERE c.post.id IN :postIds")
    void deleteByPostIdIn(@Param("postIds") List<Long> postIds);

    @Transactional
    @Modifying
    @Query("DELETE FROM Comment c WHERE c.id = :commentId")
    void deleteByIdCustom(@Param("commentId") Long commentId);

    @Modifying
    @Query("DELETE FROM Comment c WHERE c.user = :user")
    void deleteByUser(@Param("user") User user);

    @Modifying
    @Query("DELETE FROM Comment c WHERE c.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Comment c WHERE c.post IN (SELECT p FROM Post p WHERE p.user = :user AND p.community = :community)")
    void deleteCommentsByUserAndCommunity(@Param("user") User user, @Param("community") Community community);


    void deleteByPostId(Long id);
}
