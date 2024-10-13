import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';

const Todo = ({ user }) => {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [editTodoId, setEditTodoId] = useState(null);
  const [editText, setEditText] = useState('');

  // Fetch todos from Firestore on component mount
  useEffect(() => {
    if (user) {
      fetchTodos(); // Fetch todos only if the user is signed in
    }
  }, [user]);

  // Function to fetch todos
  const fetchTodos = async () => {
    const todosCollection = collection(db, 'todos');
    const q = query(todosCollection, where('userId', '==', user.uid)); // Only fetch todos for the authenticated user
    const todosSnapshot = await getDocs(q);
    const todosList = todosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTodos(todosList);
  };

  // Function to add a new todo
  const addTodo = async () => {
    if (!todo.trim()) {
      alert("Please enter a valid todo.");
      return;
    }
    const todosCollection = collection(db, 'todos');
    await addDoc(todosCollection, { text: todo, completed: false, userId: user.uid }); // Add userId to the todo
    setTodo('');
    fetchTodos();
  };

  // Function to delete a todo
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, 'todos', id));
    fetchTodos();
  };

  // Function to toggle completion status of a todo
  const toggleComplete = async (id, completed) => {
    const todoDoc = doc(db, 'todos', id);
    await updateDoc(todoDoc, { completed: !completed });
    fetchTodos();
  };

  // Function to update a todo
  const updateTodo = async (id) => {
    if (!editText.trim()) {
      alert("Please enter valid text for the todo.");
      return;
    }
    const todoDoc = doc(db, 'todos', id);
    await updateDoc(todoDoc, { text: editText });
    setEditText('');
    setEditTodoId(null);
    fetchTodos();
  };

  return (
    <div>
      <h2>My To-Do List</h2>
      {user ? ( // Only show the todo input and list if the user is logged in
        <>
          <input
            type="text"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            placeholder="Add a new todo"
          />
          <button onClick={addTodo}>Add Todo</button>

          <ul>
            {todos.length > 0 ? (
              todos.map((item) => (
                <li key={item.id} style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                  {editTodoId === item.id ? (
                    <>
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        placeholder="Update todo"
                      />
                      <button onClick={() => updateTodo(item.id)}>Update</button>
                    </>
                  ) : (
                    <>
                      {item.text}
                      <button onClick={() => toggleComplete(item.id, item.completed)}>
                        {item.completed ? 'Undo' : 'Done'}
                      </button>
                      <button onClick={() => {
                        setEditTodoId(item.id);
                        setEditText(item.text);
                      }}>Edit</button>
                      <button onClick={() => deleteTodo(item.id)}>Delete</button>
                    </>
                  )}
                </li>
              ))
            ) : (
              <li>No todos available</li> // Optional message when there are no todos
            )}
          </ul>
        </>
      ) : (
        <p>Please log in to see your to-do list.</p> // Message when the user is not logged in
      )}
    </div>
  );
};

export default Todo;
