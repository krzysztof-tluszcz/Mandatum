//redirect to url
export function redirect(str: string) {
  return () => window.location.href = str;
}

//submit login information and send request
export function submitLogin() {
  return () => alert('submitted login');
}

//submit register information and send request
export function submitRegister() {
  return () => alert('submitted register');
}

//add friend by name
export function addFriend(name: string) {
  return () => alert("adding: " + name);
}

//edits profile picture
export function editProfilePicture(){
  return () => alert('editting profile picture');
}

//edits profile username
export function editProfileUsername(){
  return () => alert('editting profile username');
}