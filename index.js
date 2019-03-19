let selectYear = (new Date()).getFullYear(); //получить текущую дату
const calContent = { //json, описывающий содержимое выборки
    'I': ['ЯНВ', 'ФЕВ', 'МАР'],
    'II': ['АПР', 'МАЙ', 'ИЮН'],
    'III': ['ИЮЛ', 'АВГ', 'СЕН'],
    'VI': ['ОКТ', 'НОЯ', 'ДЕК']
}
function loadComplete() {
    //Главный метод, отрисовывающий компонент (наверное стоит сделать его классом)
    let calendar = d3.select('body').append('div').attr('class', 'calendar');
    //Заголовок календаря 
    //содержит дату с переключателями +- и кнопку "Накопительного отчёта"
    let header = calendar.append('div').attr('class', 'catigories');
    header.append('button', 'div').attr('id', 'Decrement').attr('class', 'header')
        .text('<').attr('onClick', 'decrement()');
    header.append('div').attr('id', 'Year').attr('class', 'header')
        .text(selectYear);
    header.append('button').attr('id', 'Increment').attr('class', 'header')
        .text('>').attr('onClick', 'increment()');
    header.append('hr');
    header.append('div').attr('id', 'accumulative').text('Накопительный отчёт').attr('onClick', 'accumulativeSelect()');
    header.append('hr');
    //область выборки
    let calBody = calendar.append('div').attr('class', 'selectPlace');
    let mounthNum = 1; //переменная для присвоения каждому месяцу порядкового номера, которая записывается в класс DOM-элемента
    Object.keys(calContent).forEach(function (quarter) {
        let quarterArea = calBody.append('div').attr('id', quarter + 'quarter');
        quarterArea.append('div').attr('class', 'quarters').text(quarter)
            .attr('id', quarter).attr('onClick', 'selectQuarter("' + quarter + '")');
        quarterArea.append('div').attr('class', 'separator');
        calContent[quarter].forEach(function (mounth) {
            quarterArea.append('div').attr('class', 'mounth mounthNum-' + mounthNum)
                .text(mounth)
                .attr('onClick', 'selectMounth("' + mounthNum + '")');
            mounthNum++;
        });
    });
}
function increment() {
    //год +1
    selectYear++;
    d3.select('#Year').text(selectYear);
}
function decrement() {
    //год -1
    selectYear--;
    d3.select('#Year').text(selectYear);
}
function selectQuarter(numQuart) {
    //Событие при выборе квартала подсвечивает, все месяца и сам квартал или снимает выделение (при повторном нажатии)
    if (d3.select('#' + numQuart + 'quarter').select('.quarters.select')._groups[0][0]) {
        d3.select('#' + numQuart + 'quarter').selectAll('*').classed('select', false);
    } else {
        d3.select('#' + numQuart + 'quarter').selectAll('*').classed('select', true);
    }
    selectionLogic();
}
function selectMounth(mounthNum) {
    //Событие при нажатии на любой месяц поставить выделение / снять
    if (d3.select('.mounthNum-' + mounthNum + '.select')._groups[0][0] != null) {
        d3.select('.mounthNum-' + mounthNum).classed('select', false);
    } else {
        d3.select('.mounthNum-' + mounthNum).classed('select', true);
    }
    selectionLogic();
}
function selectionLogic() {
    //универсальный метод, после любого выбора проверяет на то выбраны ли все месяца в квартале и если выбраны, ставит выделение на квартал
    //и наоборот, при снятии выделения с месяца, то и квартал перестаёт подсвечиваться.
    // 1 квартал
    if (d3.select('.mounthNum-1.select')._groups[0][0] != null
        && d3.select('.mounthNum-2.select')._groups[0][0] != null
        && d3.select('.mounthNum-3.select')._groups[0][0] != null) {
        d3.select('#I').classed('select', true);
    } else {
        d3.select('#I').classed('select', false);
    }
    // 2 квартал
    if (d3.select('.mounthNum-4.select')._groups[0][0] != null
        && d3.select('.mounthNum-5.select')._groups[0][0] != null
        && d3.select('.mounthNum-6.select')._groups[0][0] != null) {
        d3.select('#II').classed('select', true);
    } else {
        d3.select('#II').classed('select', false);
    }
    // 3 квартал
    if (d3.select('.mounthNum-7.select')._groups[0][0] != null
        && d3.select('.mounthNum-8.select')._groups[0][0] != null
        && d3.select('.mounthNum-9.select')._groups[0][0] != null) {
        d3.select('#III').classed('select', true);
    } else {
        d3.select('#III').classed('select', false);
    }
    // 4 квартал
    if (d3.select('.mounthNum-10.select')._groups[0][0] != null
        && d3.select('.mounthNum-11.select')._groups[0][0] != null
        && d3.select('.mounthNum-12.select')._groups[0][0] != null) {
        d3.select('#VI').classed('select', true);
    } else {
        d3.select('#VI').classed('select', false);
    }
}
function accumulativeSelect() {
    // Событие при нажатии на "Накопительный итог" находит последний выбеленный месяц и выбирает все месяца выделенные ранее
    // если ранее ничего не было выбрано (т.е. все месяца без селекта), то выделяет весь год. 
    if (d3.selectAll('.mounth.select')._groups[0][0] == null) {
        for (let iter = 12; iter >= 1; iter--) {
            d3.select('.mounthNum-' + iter).classed('select', true);
        }
    } else {
        for (let iter = 12; iter >= 1; iter--) {
            if (d3.select('.mounthNum-' + iter + '.select')._groups[0][0] != null) {
                for (let i = iter - 1; i >= 1; i--) {
                    d3.select('.mounthNum-' + i).classed('select', true);
                }
                break;
            }
        }
    }
    selectionLogic();
}