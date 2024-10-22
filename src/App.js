import { useState } from "react";
const initialFriends = [
  {
    id: 118836,
    name: "Simeon",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Muh",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Kum",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [addFriends, setAddNewFriend] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const [bill, setBill] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const [whoIsPayx, setWhoIsPayx] = useState("");
  const [balance, setBalance] = useState(0);

  function handleShowAddFriend() {
    setShowAddFriend(!showAddFriend);
  }
  function handleFormSubmit(newFriend) {
    setAddNewFriend((addFriends) => [...addFriends, newFriend]);
    setShowAddFriend(false);
  }
  function handleSelection(friend) {
    // setSelectedFriend((cur) => {
    //   console.log("cur", cur);
    //   return cur?.id === friend.id ? null : friend;
    // });
    setSelectedFriend(friend);
    setShowAddFriend(false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <Header />
        <FriendsList
          addFriends={addFriends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />

        {showAddFriend && (
          <FormAddFriend
            onAddFriend={handleFormSubmit}
            balance={balance}
            setBalance={setBalance}
          />
        )}

        <Button handleOnclick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          bill={bill}
          setBill={setBill}
          myExpense={myExpense}
          setMyExpense={setMyExpense}
          whoIsPayx={whoIsPayx}
          setWhoIsPayx={setWhoIsPayx}
          setBalance={setBalance}
          setSelectedFriend={setSelectedFriend}
        />
      )}
    </div>
  );
}
function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1>Welcome to Pangsui Bill Splitting App</h1>
        <p>
          Who would you like to go out with today? Please select from the list
          by clicking the 'Select' button, or add a new friend by clicking the
          'Add Friend' button. After, click on 'Select' to chose who will pay
          the bill 😇.
        </p>
      </div>
    </header>
  );
}
function Button({ children, handleOnclick }) {
  return (
    <button onClick={handleOnclick} className="button">
      {children}
    </button>
  );
}
function FriendsList({ addFriends, onSelection, selectedFriend }) {
  return (
    <ul className="friendlist-ul">
      {addFriends.map((friend) => (
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
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even </p>}

      {/* <Button onClick={() => onSelection(friend)}>Select</Button> */}

      <button className="button" onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </button>
    </li>
  );
}

function FormAddFriend({ onAddFriend, balance }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${image}?=${id}`,
      balance,
      id,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleFormSubmit}>
      <label>🤼 Friend name</label>
      <input
        value={name}
        type="text"
        onChange={(e) => setName(e.target.value)}
      />

      <label>🙅‍♀️ Image URL</label>
      <input
        value={image}
        type="text"
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({
  selectedFriend,
  bill,
  setBill,
  myExpense,
  setMyExpense,
  whoIsPayx,
  setWhoIsPayx,
  setBalance,
  setSelectedFriend,
}) {
  // const checkInput = bill > myExpense;
  function billPayment(e) {
    e.preventDefault();
    if (bill > myExpense) {
      if (selectedFriend.name === whoIsPayx) {
        selectedFriend.balance += -myExpense;
        setBalance(-myExpense);
      } else {
        selectedFriend.balance += bill - myExpense;
        setBalance(bill - myExpense);
      }
      setBalance(0);
      setBill("");
      setMyExpense("");
      setWhoIsPayx("You");
      setSelectedFriend(null);
    }
  }
  return (
    <form className="form-split-bill" onSubmit={billPayment}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰 Bill value</label>
      <input
        value={bill}
        type="number"
        onChange={(e) => setBill(+e.target.value)}
      />

      <label>💰 Your expense</label>
      <input
        value={myExpense}
        type="number"
        onChange={(e) => setMyExpense(+e.target.value)}
      />

      <label>🤼 {selectedFriend.name}'s expense</label>
      <input
        value={bill >= myExpense ? bill - myExpense : "invalid amount"}
        type="text"
        disabled
      />

      <label>😇 Who is paying the bill?</label>
      <select
        value={whoIsPayx}
        onChange={(onchange = (e) => setWhoIsPayx(e.target.value))}
      >
        <option value="user">You</option>
        <option value={selectedFriend.name}>{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
