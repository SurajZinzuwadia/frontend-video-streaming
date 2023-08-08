// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'subscriber',
    path: '/dashboard/subscriber',
    icon: icon('ic_user'),
  },
  {
    title: 'channel',
    path: '/dashboard/channel',
    icon: icon('ic_user'),
  },
 
  {
    title: 'Live Streams',
    path: '/dashboard/testing',
    icon: icon('ic_lock'),
  },
  {
    title: 'Watch Highlights',
    path: '/dashboard/highlights',
    icon: icon('ic_lock'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  // Hide from the navbar
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
