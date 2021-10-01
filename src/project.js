import { appLogic } from "./index";

const Project = (name, todos, id) => {
    function getName(){return name;}
  
    function setName(newName) {name = newName;}
  
    function getToDos(){return todos}
  
    function addToDo(newToDo){
      todos.push(newToDo);
    }
  
    function getId(){return id}
  
    return {getName, getToDos, getId, setName, addToDo};
  }
  export { Project }