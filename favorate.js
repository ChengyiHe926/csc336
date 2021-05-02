
window.addEventListener('DOMContentLoaded', () => {

    if (!localStorage.getItem('favorate')) {
        localStorage.setItem('favorate', JSON.stringify([]));
    }
    let favorate = JSON.parse(localStorage.getItem('favorate'));
    if (favorate.length === 0) {
        document.getElementById('cards').innerHTML = `<h3>No data yet</h3>`
        return;
    }
    let htmlStr = favorate.map((item) => {
        return `<div class="cast">
                        <a href="/details/${item.media}/${item.id}">
                            <img style="width:100%" src="${item.poster_path}" alt="${item.title}"
                                title="${item.title}">
                        </a>
                        <div style="text-align: center; color: white;">
                            ${item.title}
                        </div>
                    </div>`
    }).join("")

    document.getElementById('cards').innerHTML = htmlStr;


})