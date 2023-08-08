const account = {
  displayName: 'Guest',
  email: 'demo@minimals.cc',
  photoURL: '/assets/images/avatars/avatar_default.jpg',
};

// Function to update the account object with the latest user data
export const updateAccountData = () => {
  const getuserL = localStorage.getItem('user');
  const getuser = JSON.parse(getuserL);
  account.displayName = getuser?.name || 'Guest';
  account.email = getuser?.email || 'demo@minimals.cc';
  account.photoURL = getuser?.avatarUrl || '/assets/images/avatars/avatar_default.jpg';
};

// Call the updateAccountData function initially to update the account data (optional)
updateAccountData();

export default account;
