import { Routes, Route } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminRoute from './AdminRoute'
import ManageUsers from '../pages/admin/ManageUsers'
import ManageCommunities from '../pages/admin/ManageCommunities'
import Settings from '../pages/admin/Settings'
import ProtectedRoute from './ProtectedRoute'
import UserDetails from '../pages/admin/UserDetails'
import CommunityDetails from '../pages/admin/CommunityDetails'
import CommunityList from '../pages/CommunityList'
import DiscoverCommunities from '../pages/DiscoverCommunities'
import CommunityFeed from '../pages/CommunityFeed'
import ProfilePage from '../pages/ProfilePage'
import SettingsPage from '../pages/SettingsPage'
import UserProfile from '../pages/UserProfile'
import FollowingFeed from '../pages/FollowingFeed'
function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path='/home' element={<CommunityList />} />
        <Route path='home/following-feed' element={<FollowingFeed />} />
        <Route path='/home/communities' element={<DiscoverCommunities />} />
        <Route
          path='/home/communities/:communityId'
          element={<CommunityFeed />}
        />
        <Route path='/home/profile/:userId' element={<ProfilePage />} />
        <Route path='/home/user/:userId' element={<UserProfile />} />
        <Route
          path='/home/profile/settings/:userId'
          element={<SettingsPage />}
        />
      </Route>

      <Route path='/admin/*' element={<AdminRoute />}>
        <Route path='' element={<AdminDashboard />}>
          <Route path='gestione-utenti' element={<ManageUsers />} />
          <Route path='gestione-utenti/:id' element={<UserDetails />} />
          <Route path='gestione-community' element={<ManageCommunities />} />
          <Route path='gestione-community/:id' element={<CommunityDetails />} />
          <Route path='impostazioni' element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes
