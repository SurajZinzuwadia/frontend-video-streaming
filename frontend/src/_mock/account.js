// ----------------------------------------------------------------------

const getuserL = localStorage.getItem('user');
let getuser = null

getuser = JSON.parse(getuserL)
const account = {
  displayName: getuser?.name || 'Guest',
  email: 'demo@minimals.cc',
  photoURL: getuser?.avatarUrl||'/assets/images/avatars/avatar_default.jpg',
};

export default account;
