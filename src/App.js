// import { useState } from "react";

import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [friends, setFriends] = useState(initialFriends);

  const [selectedFriend, setSelectedFriend] = useState({});
  const [showAddFriend, setShowAddFriend] = useState(false);

  function handleSelectedFriend(friend) {
    selectedFriend === friend
      ? setSelectedFriend({})
      : setSelectedFriend(friend);
  }

  function addNewFriend(friend) {
    setFriends([...friends, friend]);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          onSelection={handleSelectedFriend}
          selectedFriend={selectedFriend}
          friends={friends}
        />
        {showAddFriend && <FormAddFriend onAddNewFriend={addNewFriend} />}
        <Button onClick={() => setShowAddFriend(!showAddFriend)}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {Object.entries(selectedFriend).length > 0 && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          setSelectedFriend={setSelectedFriend}
          friends={friends}
          setFriends={setFriends}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

function FriendList({ onSelection, selectedFriend, friends }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  return (
    <li className="selected">
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}€
        </p>
      )}
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {friend.balance}€
        </p>
      )}
      {friend.balance === 0 && (
        <p className="">You and {friend.name} are Equal</p>
      )}

      <Button onClick={() => onSelection(friend)}>
        {selectedFriend.name === friend.name ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormSplitBill({
  selectedFriend,
  setSelectedFriend,
  friends,
  setFriends,
}) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";

  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (whoIsPaying === "user") {
      setFriends(() =>
        friends.map((friend) =>
          friend.id === selectedFriend.id
            ? { ...friend, balance: paidByFriend + friend.balance }
            : friend
        )
      );
    } else {
      setFriends(() =>
        friends.map((friend) =>
          friend.id === selectedFriend.id
            ? { ...friend, balance: friend.balance + (0 - paidByUser) }
            : friend
        )
      );
    }
    // setSelectedFriend({});
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰 Bill value = {bill}</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      />
      <label>🧍&zwj;♀️ Your expense {paidByUser}</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) => setPaidByUser(e.target.value)}
      />
      <label>👫 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />
      <label>🤑 Who is paying the bill = {whoIsPaying}</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value={selectedFriend.name}>{selectedFriend.name}</option>
      </select>
      <button className="button">Split bill</button>
    </form>
  );
}

function FormAddFriend({ onAddNewFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const friend = {
      id: crypto.randomUUID(),
      name,
      image,
      balance: 0,
    };

    onAddNewFriend(friend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👫 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🌄 Image URL</label>
      {/* value="https://i.pravatar.cc/48" */}
      <input
        type="text"
        placeholder="https://i.pravatar.cc/48"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default App;
