const Project = (name, todos, id) => {
    function getName(){return name;}
  
    function setName(newName) {name = newName;}
  
    function getToDos(){return todos}
  
    function addToDo(newToDo){
      todos.push(newToDo);
    }
    
    function deleteToDo(deleteToDo){
      if(todos.includes(deleteToDo)){
        todos.splice(todos.indexOf(deleteToDo), 1);
      }
    }
  
    function getId(){return id}
  
    return {getName, getToDos, getId, setName, addToDo, deleteToDo};
  }
  export { Project }