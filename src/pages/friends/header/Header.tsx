import './Header.css'
import { SearchBar } from '../../../utilities/components/navbar/navbarcontents/searchbar/SearchBar'
import { Button } from '../../../utilities/components/button/Button'
import { useState, useEffect, useRef } from 'react'
import { FriendTab } from './friendtab/FriendTab'
import { setCookie, getCookie } from '../../../utilities/functions/cookies'
import { Dialog } from '@headlessui/react'
import { UserData } from '../../../utilities/functions/globalFunctions'
import axios from 'axios'

//change your username
async function changeUsername(setUser: React.Dispatch<React.SetStateAction<UserData>>, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, setChangeUsernameError:React.Dispatch<React.SetStateAction<string>>) {
  axios.patch('http://localhost:3001/users/patch/username', {username: (document.getElementById('update-username') as HTMLInputElement).value,}, { headers: {'Authorization': `Bearer ${getCookie('accessToken')}`}})
  .then(function (response) {
    setCookie('accessToken', response.data.accessToken, 1);
    setUser((user)=>({...user, username: response.data.newUsername}));
    setChangeUsernameError(response.data.error);
    setIsOpen(false);
  })
  .catch(function (error) {
    setChangeUsernameError(error.response.data.error);
    setIsOpen(false);
  });
}

//add friend
async function addFriend(setMessage: React.Dispatch<React.SetStateAction<string>>, friendUsername: string, setUser: React.Dispatch<React.SetStateAction<UserData>>) {
  const friendToAdd = {
    username: friendUsername,
  };
  //add friend request with authorization
  axios.post('http://localhost:3001/users/add', friendToAdd, { headers: {'Authorization': `Bearer ${getCookie('accessToken')}`}})
  .then(function (response) {
    setCookie('accessToken', response.data.accessToken, 1);
    setUser((user)=>({...user, friends: [...user.friends, response.data.id]}));
    setMessage(response.data.message);
  })
  .catch(function (error) {
    setMessage(error.response.data.error);
  });
}

export function Header(): JSX.Element {
  //hooks
  const [isOpen, setIsOpen] = useState(false);
  const [changeUsernameError, setChangeUsernameError] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<UserData>({id: '', username: '', friends: [], pinned: [], recent: []});
  const newFriend = useRef<string | null>(null);

  const listOfFriends = user.friends.map((id) => {
    return <FriendTab id={id} key={id}/>
  });

  //get user data once at page reload
  useEffect(()=>{
      axios.post('http://localhost:3001/users/get', {}, { headers: {'Authorization': `Bearer ${getCookie('accessToken')}`}})
      .then(function (response) {
        setUser(response.data.user as UserData);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  function setFriend(value:string){
    newFriend.current = value;
  }

  return (
    <div className="friends-header">
      <div className='account-box box'>
        <div className='profile'>
          <p className='username'>{user.username}</p>
        </div>
        <Button label="edit" width="4rem" onPress={()=>setIsOpen(prev => !prev)}/>
      </div>
        <Dialog className="dialog" open={isOpen} onClose={() => setIsOpen(false)}>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Title className="dialog-title">Change your username</Dialog.Title>
          <SearchBar placeholder="new username.." name="update-username"/>
          { changeUsernameError && <p className="username-error"> { changeUsernameError } </p> }
          <div className='popup-buttons'>
            <Button label="submit" width="4rem" onPress={() => changeUsername(setUser, setIsOpen, setChangeUsernameError)}/>
            <Button label="cancel" width="4rem" onPress={()=>setIsOpen(false)}/>
          </div>
        </Dialog>
      <div className='friend-box box'>
        <div className='search-bar-name'>
          <SearchBar placeholder="search name.." name="friend-name"/>
        </div>
        <div className='friend-box-container'>
          {listOfFriends}
        </div>
        { message && <p className="message-handler"> { message } </p> }
        <SearchBar placeholder="add friend.." name="add-friend" onChange={setFriend}/>
        <Button label="add friend" width="8rem" onPress={() => newFriend.current && addFriend(setMessage, newFriend.current, setUser)}/>
      </div>
    </div>
  )
}