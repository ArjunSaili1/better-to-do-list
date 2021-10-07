const ToDo = (title, description, dueDate, priority, notes, id, project) => {

    function getTitle(){return title;}
    
    function getDescription(){return description;}
    
    function getDueDate(){if(dueDate){return dueDate};}
    
    function getPriority(){return priority;}
    
    function getNotes(){if(notes){return notes;};}
    
    function getProject(){return project;}
  
    function getId(){return id}
  
    return{getTitle, getDescription, getDueDate, getPriority, getNotes,
    getProject, getId}
  }
  export { ToDo }