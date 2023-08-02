let user = {
  name: import.meta.env.VITE_USER_NAME,
  city: import.meta.env.VITE_USER_CITY,
  state: import.meta.env.VITE_USER_STATE,
  street_address: import.meta.env.VITE_USER_STREET_ADDRESS,
  area_code: import.meta.env.VITE_USER_AREA_CODE,
};

const User = {
  user: `Your user is ${user.name} and they live in ${user.city}, ${user.state}. Their street address is ${user.street_address} and their area code is ${user.area_code}.`,
};

export default User;