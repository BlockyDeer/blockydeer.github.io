var dataUrl = ""

const baseUrl = `${window.location.protocol}//${window.location.host}`;

function setTitle() {
    const h1Content = document.querySelector('div h1').textContent;
    document.title = h1Content + " - " + document.title;
}

function setDynamicResourcePaths() {
    const cover = document.getElementById('cover');
    var pageName = window.location.pathname.split('/').pop().split('.')[0];
    if (pageName === "") {
        pageName = "index"
    }

    // 当前页面的 URL
    const currentUrl = window.location.href;

    const fileName = currentUrl.substring(currentUrl.lastIndexOf('/') + 1, currentUrl.lastIndexOf('.'));

    const coverImagePath = currentUrl.substring(0, currentUrl.lastIndexOf('/')) + '/assets/' + fileName + '.png';
    cover.style.backgroundImage = `url('${coverImagePath}')`;
    dataUrl = `${baseUrl}/list.json`;
}

async function loadList(jsonPath) {
    try {
        console.log("数据URL:", dataUrl);
        const response = await fetch(jsonPath);
        console.log("fetched json. response: ", response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("数据加载成功", data);

        const sidebarLinks = document.getElementById('sidebar-links');
        sidebarLinks.innerHTML = '';
        //content.innerHTML = '';

        data.forEach((item, index) => {
            const link = document.createElement('a');
            link.href = baseUrl + '/' + item.link;
            link.textContent = item.title;
            sidebarLinks.appendChild(link);
        });
    } catch (error) {
        console.error("加载列表数据时出错:", error);
    }
}

var sidebarToggle = (window.matchMedia('(max-width: 600px)').matches);

const cover = document.querySelector('.content .cover');
const sidebarObj = document.querySelector('.sidebar');
const currentMargin = parseInt(getComputedStyle(cover).marginLeft, 10);
const sidebarWidth = parseInt(getComputedStyle(sidebarObj).width, 10);
const sidebarPadding = parseInt(getComputedStyle(sidebarObj).paddingLeft, 10);

const coverMarginOrigin = parseInt(getComputedStyle(document.querySelector('.content .cover')).marginLeft, 10);
const coverMarginSidebarFolded = (coverMarginOrigin - sidebarWidth - 2 * sidebarPadding) + 'px';

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('visible');
    sidebar.classList.toggle('hidden');

    const coverMargin = parseInt(getComputedStyle(cover).marginLeft, 10);
    if (sidebarToggle) {
        cover.style.marginLeft = coverMarginOrigin + 'px';
    } else {
        cover.style.marginLeft = coverMarginSidebarFolded;
    }
    sidebarToggle = !sidebarToggle;
}

// 初始化
window.onload = function () {
    toggleSidebar();
    setTitle();
    setDynamicResourcePaths();
    loadList(dataUrl);
};

document.getElementById('toggleSidebar').addEventListener('click', toggleSidebar);
