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
    route: '/thread/create',
    label: 'Create Thread',
  },
  // {
  //   imgURL: '/assets/community.svg',
  //   route: '/communities',
  //   label: 'Communities',
  // },
  {
    imgURL: '/assets/user.svg',
    route: '/profile',
    label: 'Profile',
  },
];

export const profileTabs = [
  { value: 'threads', label: 'Threads', icon: '/assets/reply.svg' },
  { value: 'favourites', label: 'Favourites', icon: '/assets/heart-gray.svg' },
  // { value: 'tagged', label: 'Tagged', icon: '/assets/tag.svg' },
];

export const activityTabs = [
  { value: 'likes', label: 'Likes', icon: '/assets/heart-gray.svg' },
  { value: 'replies', label: 'Replies', icon: '/assets/members.svg' },
];

// export const communityTabs = [
//   { value: 'threads', label: 'Threads', icon: '/assets/reply.svg' },
//   { value: 'members', label: 'Members', icon: '/assets/members.svg' },
//   { value: 'requests', label: 'Requests', icon: '/assets/request.svg' },
// ];
