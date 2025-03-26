package com.nichenetwork.nichenetwork_backend.follow;

import com.nichenetwork.nichenetwork_backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {

    boolean existsByFollowerAndFollowing(User follower, User following);

    void deleteByFollowerAndFollowing(User follower, User following);

    int countByFollower(User follower);

    int countByFollowing(User following);

    List<Follow> findByFollowing(User user);

    List<Follow> findByFollower(User user);
}
