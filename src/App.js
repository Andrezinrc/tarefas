import "./App.css";
import { useState, useEffect } from "react";
import {BsTrash, BsBookmarkCheck, BsBookmarkCheckFill} from 'react-icons/bs';

//const API = "http://localhost:5000";

function App() {

  const [titulo, setTitulo] = useState("");
  const [tempo, settempo] = useState("");
  const [todos, setTodos] = useState([]);
  const [carregar, setCarregar] = useState(false);

  useEffect(() => {
    const loadData = () => {
      setCarregar(true);
      
      const savedTodos = localStorage.getItem("todos-app-data");
      
      if (savedTodos) {
        const parsedTodos = JSON.parse(savedTodos);
        setTodos(parsedTodos);
      }
      
      setCarregar(false);
    };

    loadData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const newId = todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
    
    const todo = {
      id: newId,
      titulo,
      tempo,
      done: false,
    };

    const newTodos = [...todos, todo];
    setTodos(newTodos);
    localStorage.setItem("todos-app-data", JSON.stringify(newTodos));

    setTitulo("");
    settempo("");
  };

  const handleDelete = async (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    localStorage.setItem("todos-app-data", JSON.stringify(newTodos));
  };

  const handleEdit = async(todo) => {
    const updatedTodo = {...todo, done: !todo.done};
    
    const newTodos = todos.map((t) => 
      t.id === todo.id ? updatedTodo : t
    );
    
    setTodos(newTodos);
    localStorage.setItem("todos-app-data", JSON.stringify(newTodos));
  }

  if(carregar){
    return <p className="carregamento">Carregando...</p>
  }

  return (
    <div className="App">
      <header className="cabecalho">
        <h1>React Tarefa</h1>
      </header>
      <main className="principal">
        <h2>Insira sua proxima tarefa!</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="titulo">O que voce vai fazer?</label>
            <input type="text" name="titulo" placeholder="Titulo da tarefa" onChange={(event) => setTitulo(event.target.value)} value={titulo || ""} required/>
          </div>
          <div className="form-control">
            <label htmlFor="tempo">Duracao:</label>
            <input type="text" name="tempo" placeholder="Tempo estimado (em horas)" onChange={(event) => settempo(event.target.value)} value={tempo || ""} required/>
          </div>
          <input type="submit" value="Criar tarefa"/>
        </form>
      </main>
      <footer className="rodape-list">
        <h2>Lista de Tarefas:</h2>
        {todos.length === 0 && <p>Nao a tarefas</p>}
        {todos.map((todo) => (
            <div className="todo" key={todo.id}>
              <h3 className={todo.done ? "todo-done" : ""}>
                {todo.titulo}</h3>
              <p>Duracao: {todo.tempo}h</p>
              <div className="actions">
                <span onClick={() => handleEdit(todo)}>
                  {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
                </span>
                <BsTrash onClick={() => handleDelete(todo.id)}/>
              </div>
            </div>
          ))
        }
      </footer>
    </div>
  );
}

export default App;
