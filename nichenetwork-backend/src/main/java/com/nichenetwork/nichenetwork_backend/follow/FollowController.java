package com.nichenetwork.nichenetwork_backend.follow;

import com.nichenetwork.nichenetwork_backend.user.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follows")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    @PostMapping("/{followerId}/follow/{followingId}")
    public ResponseEntity<String> followUser(@PathVariable Long followerId, @PathVariable Long followingId) {
        try
        {
            followService.followUser(followerId, followingId);
            return ResponseEntity.ok("User followed successfully");
        }
        catch (IllegalArgumentException e)
        {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @DeleteMapping("/{followerId}/unfollow/{followingId}")
    public ResponseEntity<String> unfollowUser(@PathVariable Long followerId, @PathVariable Long followingId) {
        followService.unfollowUser(followerId, followingId);
        return ResponseEntity.ok("User unfollowed successfully");
    }

    @GetMapping("/{userId}/followers/count")
    public ResponseEntity<Integer> getFollowerCount(@PathVariable Long userId) {
        return ResponseEntity.ok(followService.countFollowers(userId));
    }

    @GetMapping("/{userId}/following/count")
    public ResponseEntity<Integer> getFollowingCount(@PathVariable Long userId) {
        return ResponseEntity.ok(followService.countFollowing(userId));
    }

    @GetMapping("/{userId}/followers")
    public ResponseEntity<?> getFollowers(@PathVariable Long userId) {
        List<UserResponse> followers = followService.getFollowers(userId);
        return ResponseEntity.ok(followers);
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<?> getFollowing(@PathVariable Long userId) {
        List<UserResponse> following = followService.getFollowing(userId);
        return ResponseEntity.ok(following);
    }

    @GetMapping("/{userId}/isFollowing/{followingId}")
    public ResponseEntity<Boolean> isFollowing(@PathVariable Long userId, @PathVariable Long followingId) {
        boolean isFollowing = followService.isFollowing(userId, followingId);
        return ResponseEntity.ok(isFollowing);
    }
}
