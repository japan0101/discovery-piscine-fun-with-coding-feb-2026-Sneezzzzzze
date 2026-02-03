function getListContainer() {
    return $('#ft_list');
}

$(function() {
    // Bind the click event for the New button
    $('button').click(createNewTodo);

    // Load tasks from cookie
    const cookies = document.cookie.split(';');
    const todoCookie = cookies.find(row => row.trim().startsWith('ft_list='));

    if (todoCookie) {
        try {
            const jsonStr = decodeURIComponent(todoCookie.split('=')[1]);
            const tasks = JSON.parse(jsonStr);
            // Reverse to show in original order (since we prepend)
            if (Array.isArray(tasks)) {
                 tasks.reverse().forEach(task => addTask(task, false));
            }
        } catch (e) {
            console.error("Cookie parsing error:", e);
        }
    }
});

function saveToCookie() {
    const $ftList = getListContainer();
    const tasks = [];
    const items = $ftList.find('div');
    
    // Iterate in reverse to save in logical order (top is first)
    // prepend adds to top, so the first one in DOM is the newest.
    // DOM: [Newest, ..., Oldest]
    // We want to save: [Newest, ..., Oldest]
    
    items.each(function() {
        tasks.push($(this).text());
    });

    // Valid only for 7 days
    const d = new Date();
    d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
    const expires = "expires="+d.toUTCString();
    
    // Use 'ft_list' as key to avoid conflicts with previous broken cookies
    document.cookie = "ft_list=" + encodeURIComponent(JSON.stringify(tasks)) + ";" + expires + ";path=/";
}

function createNewTodo() {
    const task = prompt("Enter a new TO DO:");
    // Check if task is not null and not just whitespace
    if (task && $.trim(task) !== "") {
        addTask(task, true);
    }
}

function addTask(text, isNew) {
    const $ftList = getListContainer();
    const $div = $('<div>').text(text);

    $div.on('click', function () {
        if (confirm("Do you really want to delete this TO DO?")) {
            $(this).remove();
            saveToCookie();
        }
    });

    $ftList.prepend($div);

    if (isNew) {
        saveToCookie();
    }
}
