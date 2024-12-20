function buildFooter() {
    const th = document.createElement('th')
    th.colSpan = '3'
    th.innerHTML = 'Все права защищены и принадлежат кому-то, любое несанкционированное использование приведет к чему-то плохому'

    return th
}

function buildSubTable() {
    const table = document.createElement('table')
    table.className = 'sub-table'
    
    for (var i = 0; i < 5; i++) {
        const tr = document.createElement('tr')
        const td = document.createElement('td')

        td.innerHTML = `Пункт ${i+1}`

        tr.appendChild(td)

        table.appendChild(tr)
    }

    return table
}

function buildImage() {
    const img = document.createElement('img')
    img.src = 'images/gif.webp'
    img.alt = 'image'
    img.style = 'height: 140px;'

    return img
}

function buildList(rootTag, className) {
    const root = document.createElement(rootTag)
    if (className) root.className = className

    for (var i = 0; i < 5; i++) {
        const li = document.createElement('li')
        li.innerHTML = `Пункт ${i+1}`

        root.appendChild(li)
    }

    return root
}

function wrapInTd(element, rowSpan) {
    const td = document.createElement('td')
    if (rowSpan) td.rowSpan = rowSpan

    td.appendChild(element)

    return td
}

function buildTableContentRowII(reversed) {
    if (!reversed) return wrapInTr(wrapInTd(buildSubTable()))

    return wrapInTr(wrapInTd(buildImage()))
}

function buildTableContentRowI(reversed) {
    const tr = document.createElement('tr')

    if (reversed) {
        tr.appendChild(wrapInTd(buildSubTable()))
        tr.appendChild(wrapInTd(buildList('ol', 'roman-numerals'), '2'))
        tr.appendChild(wrapInTd(buildList('ul'), '2'))
    } else {
        tr.appendChild(wrapInTd(buildList('ul'), '2'))
        tr.appendChild(wrapInTd(buildList('ol', 'roman-numerals'), '2'))
        tr.appendChild(wrapInTd(buildImage()))
    }

    return tr
}

function buildHeader() {
    const th = document.createElement('th')
    th.colSpan = '3'
    th.innerHTML = 'Очень длинный и детализированный заголовок, подробно описывающий суть визитки'

    return th
}

function wrapInTr(element, className) {
    const tr = document.createElement('tr')
    if (className) tr.className = className

    tr.appendChild(element)

    return tr
}

function buildTable(reversed) {
    const table = document.createElement('table')
    table.className = 'buss-card-table'

    if (reversed) {
        table.appendChild(wrapInTr(buildFooter(), 'header'))
        table.appendChild(buildTableContentRowI(reversed))
        table.appendChild(buildTableContentRowII(reversed))
        table.appendChild(wrapInTr(buildHeader(), 'header'))
    } else {
        table.appendChild(wrapInTr(buildHeader(), 'header'))
        table.appendChild(buildTableContentRowI(reversed))
        table.appendChild(buildTableContentRowII(reversed))
        table.appendChild(wrapInTr(buildFooter(), 'header'))
    }

    return table
}

function buildDivII() {
    const div = document.createElement('div')
    div.className = 'padded'

    const h2 = document.createElement('h2')
    h2.innerHTML = 'Заголовок 2'

    div.appendChild(h2)

    div.appendChild(buildTable(true))

    return div
}

function buildDivI() {
    const div = document.createElement('div')
    div.className = 'padded'

    const h1 = document.createElement('h1')
    h1.innerHTML = 'Заголовок 1'

    div.appendChild(h1)

    div.appendChild(buildDivII())

    return div
}

function build() {
    document.body.appendChild(buildDivI())
    document.querySelector('#build-btn').style = 'display: none;'
}