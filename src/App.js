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
export default function App(){
  const [friends,setFriends]=useState(initialFriends); 
  const [showAddFriend,setShowAddFriend]=useState(false);
  const [selectedFriend,setSelectedFriend]=useState(null);

  function handleShowAddFriend(){
    setShowAddFriend((show)=>!show);
  }
  function handleAddFriend(friend){
    setFriends((friends)=>[...friends,friend])
    setShowAddFriend(false);
  }
  function handleSelction(friend){
    setSelectedFriend((cur)=>cur?.id===friend.id ? null:friend);
    setShowAddFriend(false);
  }
  function handleSplitBill(value){
       setFriends((friends)=>friends.map((friend)=>friend.id === selectedFriend.id ? {...friend, balance: friend.balance + value}:friend));
       setSelectedFriend(null);
  }
  return (
    <div>
     <Heading/>
  <div className="app">
    <div className="sidebar">
       <FriendList selectedFriend={selectedFriend } friends={friends} onSelection={handleSelction}/> 
      {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend}/>}
      <Button onClick={handleShowAddFriend}>{showAddFriend ? 'Close' :'Add Friend'}</Button>
    </div>
      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend}  onSplitBill={handleSplitBill} key={selectedFriend.id}/>}
  </div> 
  </div>);
}
function Heading(){
  return <h1 className="heading">👥 ShareIt – Friends, Bills & Balance</h1>
}
function FriendList({friends,onSelection,selectedFriend}){
  // const friends=initialFriends;
 return (
 <ul>
    {friends.map((friend)=>(
      <Friend friend={friend} key={friend.id} onSelection={onSelection} selectedFriend={selectedFriend}/>
    ))}
   
 </ul> 
 );
}
function Friend({friend , onSelection ,selectedFriend}){
  const isSelected=selectedFriend?.id===friend.id;
    return<li className={`friend ${isSelected ? "selected" : ""} ${friend.balance < 0 ? "red" : ""}`}>
  <img src={friend.image} alt={friend.name} />
  
  <div className="friend-info">
    <h3>{friend.name}</h3>
    {friend.balance < 0 && (
      <p className="red">You Owe {friend.name} {Math.abs(friend.balance)}₹</p>
    )}
    {friend.balance > 0 && (
      <p className="green">{friend.name} Owes You {Math.abs(friend.balance)}₹</p>
    )}
    {friend.balance === 0 && (
      <p className="neutral">You And Your Friend Are Even</p>
    )}
  </div>

  <button className="button" onClick={() => onSelection(friend)}>
    {isSelected ? "Close" : "Select"}
  </button>
</li>

}
function Button({children,onClick}){
  return <button className="button" onClick={onClick}>{children}</button>
}
function FormAddFriend({onAddFriend}){
  const [name,setName]=useState("");
  const [image,setImage]=useState("https://i.pravatar.cc/48");
  function handleSubmit(e){
     e.preventDefault();
     if(!name||!image)return;
     const id=crypto.randomUUID();
     const newFriend={
      name,
      image:`${image}?=${id}`,
      balance:0,
      id,
     };
     onAddFriend(newFriend);
     setName('');
     setImage("https://i.pravatar.cc/48"); 
  }
  return( 
  <form className="form-add-friend" onSubmit={handleSubmit}>
    <label> Friend Name</label>
    <input className="AddFriend" type="text" value={name} onChange={(e)=>setName(e.target.value)}/>
    <label>Image Url</label>
    <input className="AddFriend" type="text"  value={image} onChange={(e)=>setImage(e.target.value)} />
    <Button>Add</Button>
  </form>
  );
}
function FormSplitBill({selectedFriend,onSplitBill}){
  const [bill,setBill]=useState("");
  const [paidByUser,setPaidByUser]=useState("");
  const paidByFriend=bill ? bill-paidByUser:" ";

  const [whoIsPaying,setWhoIsPaying]=useState("user");
  function handleSubmit(e){
     e.preventDefault();
     if(!bill || !paidByUser) return;
         onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser);
  }
  return (
  <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
       <label>Bill Value</label>
        <input type="text" value={bill} onChange={(e)=>setBill(Number(e.target.value))} />
        <label>Your Expense</label>
        <input type="text" value={paidByUser} onChange={(e)=>setPaidByUser(Number(e.target.value)>bill?paidByUser:Number(e.target.value))} />
        <label>{selectedFriend.name}'s Expense</label>
        <input type="text" disabled value={paidByFriend} />
        <label>Who's Is Paying Bill</label>
        <select className="Select" name="" id=""  value={whoIsPaying} onChange={(e)=>setWhoIsPaying((e.target.value))}>
            <option className="Select" value="user">You</option>
            <option className="Select" value="friend">{selectedFriend.name}</option>
        </select>
    <Button>Split Bill</Button>
  </form>);
}