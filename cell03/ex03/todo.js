function getListContainer() {
    return document.getElementById('ft_list');
}

window.onload = function() {
    const cookies = document.cookie.split('; ');
    const todoCookie = cookies.find(row => row.startsWith('todo='));
    
    if (todoCookie) {
        try {
            const jsonStr = decodeURIComponent(todoCookie.split('=')[1]);
            const tasks = JSON.parse(jsonStr);
            tasks.reverse().forEach(task => addTask(task, false));
        } catch (e) {
            console.error("Cookie parsing error:", e);
        }
    }
};

function saveToCookie() {
    const ftList = getListContainer();
    const tasks = [];
    const items = ftList.querySelectorAll('div');
    items.forEach(item => tasks.push(item.innerText));
    
    const d = new Date();
    d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
    document.cookie = `todo=${encodeURIComponent(JSON.stringify(tasks))}; expires=${d.toUTCString()}; path=/`;
}

function createNewTodo() {
    const task = prompt("Enter a new TO DO:");
    if (task && task.trim() !== "") {
        addTask(task, true);
    }
}

function addTask(text, isNew) {
    const ftList = getListContainer();
    const div = document.createElement('div');
    div.innerText = text;
    
    div.onclick = function() {
        if (confirm("Do you really want to delete this TO DO?")) {
            div.remove();
            saveToCookie();
        }
    };

    // Requirement: New items must be at the top
    ftList.prepend(div);
    
    if (isNew) {
        saveToCookie();
    }
}