import "./App.css";
import { useState, useEffect } from "react";
import {BsTrash, BsBookmarkCheck, BsBookmarkCheckFill} from 'react-icons/bs';

const API = "http://localhost:5000";

function App() {

  const [titulo, setTitulo] = useState("");
  const [tempo, settempo] = useState("");
  const [id, setId] = useState(1);
  const [todos, setTodos] = useState([]);
  const [carregar, setCarregar] = useState(false);

  useEffect(() => {


    const loadData = async () => {

      setCarregar(true)

      const resposta = await fetch(API + "/todos")
        .then((resposta) => resposta.json())
        .then((data) => data)
        .catch((erro) => console.log(erro));

        setCarregar(false);

        setTodos(resposta)
    };

    loadData()
  },[])


  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const todo = {
      id: setId((prevState) => prevState + 1),
      titulo,
      tempo,
      done: false,
    };

    await fetch(API +  "/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      }
    });

    setTodos((prevState) => [...prevState, todo])

    setTitulo("")
    settempo("")
  };

  const handleDelete = async (id) => {
    await fetch(API +  "/todos/" + id, {
      method: "DELETE",
    });

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  };

  const handleEdit = async(todo) => {

    todo.done = !todo.done;

    const response = await fetch(API +  "/todos/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json()

    setTodos((prevState) => 
      prevState.map((t) => (t.id === todo.id ? (t = data) : t))
    );
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
