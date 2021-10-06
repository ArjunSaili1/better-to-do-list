const ToDo = (title, description, dueDate, priority, notes, id, project) => {

    function getTitle(){return title;}
  
    function setTitle(newTitle){title = newTitle;}
  
    function getDescription(){return description;}
  
    function setDescription(newDescription){description = newDescription;}
  
    function getDueDate(){return dueDate;}
  
    function setDueDate(newDueDate){dueDate = newDueDate;}
  
    function getPriority(){return priority;}
  
    function setPriority(newPriority){priority = newPriority;}
  
    function getNotes(){if(notes){return notes;};}
  
    function setNotes(newNotes){notes = newNotes;}
  
    function getProject(){return project;}
  
    function setProject(newProject){project = newProject;}

    function getId(){return id}
  
    return{getTitle, getDescription, getDueDate, getPriority, getNotes,
    getProject, setTitle, setDescription, setDueDate, setPriority,
    setNotes, setProject, getId}
  }
  export { ToDo }