const input = document.querySelector('.search__input')
const searchWrapper = document.querySelector('.search__wrapper')
const repoWrapper = document.querySelector('.repo-list__wrapper')

function debounce(cb, time) {
    let timer
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            cb.apply(this, args)
        }, time)
    }
}

function getRepos(text) {
    return Promise.resolve()
        .then(() => {
            return fetch(`https://api.github.com/search/repositories?q=${text}&per_page=5`)
                .then(response => response.json())
        })
}

function addRepo(data) {
    const repoItem = document.createElement('div')
    repoItem.classList.add('repo-list__item', 'item')

    repoItem.innerHTML = `
        <div class="item__col">
            <div class="item__name">Name: ${data.name}</div>
            <div class="item__owner">Owner: ${data.owner.login}</div>
            <div class="item__stars">Stars: ${data.stargazers_count}</div>
        </div>
        <div class="item__col">
            <button class="item__delete"><img src="cross.svg" alt="delete"></button>
        </div>
    `
    repoWrapper.append(repoItem)
}

function createDropdown(data) {
    try {
        const arr = data.items
        const dropdown = document.createElement('div')
        dropdown.classList.add('dropdown')
        arr.forEach(item => {
            const dropdownItem = document.createElement('div')
            dropdownItem.addEventListener('click', () => {
                addRepo(item)
            })
            dropdownItem.classList.add('dropdown__item')
            const dropdownTitle = document.createElement('div')
            dropdownTitle.classList.add('dropdown__title')
            dropdownTitle.textContent = item.name
            dropdownItem.append(dropdownTitle)
            dropdown.append(dropdownItem)
        })
        searchWrapper.append(dropdown)
    } catch (e) {
    }
}

input.addEventListener('input', debounce(() => {
    if (input.value !== '') {
        getRepos(input.value)
            .then(data => {
                createDropdown(data)
            })
    } else {
        const dropdown = document.querySelector('.dropdown')
        dropdown.remove()
    }
}, 500))

searchWrapper.addEventListener('click', (e) => {
    if (e.target.classList.contains('dropdown__title')) {
        input.value = ''
        const dropdown = document.querySelector('.dropdown')
        dropdown.remove()
    }
})

repoWrapper.addEventListener('click', (e) => {
    if (e.target.nodeName === 'IMG' || e.target.nodeName === 'BUTTON') {
        e.target.closest('.item').remove()
    }
})