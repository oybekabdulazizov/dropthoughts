export const sidebarLinks = [
  {
    imgURL: '/assets/home.svg',
    route: '/',
    label: 'Home',
  },
  {
    imgURL: '/assets/search.svg',
    route: '/search',
    label: 'Search',
  },
  {
    imgURL: '/assets/heart.svg',
    route: '/activity',
    label: 'Activity',
  },
  {
    imgURL: '/assets/create.svg',
    route: '/thought/create',
    label: 'Create Thought',
  },
  {
    imgURL: '/assets/user.svg',
    route: '/profile',
    label: 'Profile',
  },
];

export const profileTabs = [
  { value: 'thoughts', label: 'Thoughts', icon: '/assets/reply.svg' },
  { value: 'favourites', label: 'Favourites', icon: '/assets/heart-gray.svg' },
  { value: 'archived', label: 'Archived', icon: '/assets/archive.svg' },
];

export const activityTabs = [
  { value: 'likes', label: 'Likes', icon: '/assets/heart-gray.svg' },
  { value: 'replies', label: 'Replies', icon: '/assets/members.svg' },
];

export const searchTabs = [
  { value: 'users', label: 'Users', icon: '/assets/members.svg' },
  { value: 'thoughts', label: 'Thoughts', icon: '/assets/reply.svg' },
];
