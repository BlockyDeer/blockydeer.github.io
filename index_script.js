const baseUrl = `${window.location.protocol}//${window.location.host}`;

async function loadRecent() {
    try {
        const response = await fetch(`${baseUrl}/list.json`);
        if (!response.ok) {
            throw new Error(`HTTP error. Status: ${response.status}`);
        }
        const data = await response.json();
        data.sort((a, b) => new Date(b.time) - new Date(a.time));
        const recentData = data.slice(10);
        const linksList = document.getElementById('links-list');
        data.forEach((item, index) => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = item.link;
            link.textContent = item.title;
            listItem.appendChild(link);
            linksList.appendChild(listItem);
        });
    } catch (error) {
        console.error("获取链接时出错：", error);
    }
}

window.onload = function () {
    loadRecent();
}
