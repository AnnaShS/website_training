"use strict";
const
    sliderContainer = document.querySelector('.review__slider'),
    sliderLine = document.querySelector('.review__line'),
    btnPrev = document.querySelector('#btn_prev'),
    btnNext = document.querySelector('#btn_next'),
    dots = document.querySelectorAll('.review__dots > span'),
    items = document.querySelectorAll('.review__item'),
    itemsCount = items.length;

let
    itemWidth = sliderContainer.offsetWidth, 
    offsetPosition = 0,
    startPos = 0,
    endPos = 0,
    stepMove = itemWidth * 0.15,
    action = 0;

//функция считывание координат касания и курсора   
let
      getEvent = () => event.type.search('touch') !== -1 ? event.touches[0] : event;

//функция установки позиции sliderLine на смещение offsetPosition       
function setPosition(){
    sliderLine.style.transform = `translateX(${offsetPosition}px)`;
    checkupBtns();
    dotPosition();
}

//функция блокировки кнопок
function checkupBtns(){
    btnPrev.disabled = offsetPosition == 0;
    btnNext.disabled = offsetPosition <= -(itemsCount - 1)*itemWidth;
}

//функция установка начальной координаты при первом касании/лкм и остановка анимации 
function startTouch(){
    let e = getEvent();
    startPos = e.clientX;
    
    sliderLine.style.transition = "none";
    sliderContainer.addEventListener('mousemove', moveTouch);
}

//функция установка последней координаты при зажатом тачем/лкм и смещении позиции sliderLine 
function moveTouch(){
    let e = getEvent();
    endPos = e.clientX; 
    action = offsetPosition - (startPos - endPos);
    sliderLine.style.transform = `translateX(${action}px)`;
}

//функция смещения на фиксированный item при отпускании тача/лкм и возобновление анимации 
function endTouch(){
    if (Math.abs(startPos - endPos) > stepMove) {
        if (startPos < endPos && offsetPosition < 0) {
            offsetPosition += itemWidth;
        } else if (startPos > endPos && offsetPosition > -(itemsCount - 1)*itemWidth) {
            offsetPosition += -(itemWidth);
        }
    }
    setPosition();
    sliderLine.style.transition = "all ease-in-out 1s";
    sliderContainer.removeEventListener('mousemove', moveTouch);
}

//функция смещения активного item при нажатии на точку
function dotClick(){
    for(let i = 0; i < dots.length; i++) {
        dots[i].addEventListener('click', () => {
                dots[i].className = -(offsetPosition)/itemWidth == i ? 'active-dot' : '';
                offsetPosition = -itemWidth*i; 
                setPosition();
        })
    }
}

//функция смены активной точки
function dotPosition(){
    for(let i = 0; i < dots.length; i++) {
        dots[i].className = -(offsetPosition)/itemWidth == i ? 'active-dot' : '';
    }
}

//функция инициализации размера item, установки нулевой позиции и проверка статусов кнопок/точек 
function init(){
    itemWidth = sliderContainer.offsetWidth;
    items.forEach((item) => {
        item.style.minWidth = `${itemWidth}px`;
    });
    offsetPosition = 0;
    setPosition();
    dotClick();
}

//слушатель для кнопки влево 
btnPrev.addEventListener('click', () => {
    offsetPosition += itemWidth;
    setPosition();
});

//слушатель для кнопки вправо
btnNext.addEventListener('click', () => {
    offsetPosition += -(itemWidth);
    setPosition();
});

//слушатели для начала тача/лкм, для смещения тача, для отпускания тача/лкм, изменения размера окна
sliderContainer.addEventListener('touchstart', startTouch);
sliderContainer.addEventListener('mousedown', startTouch);
sliderContainer.addEventListener('touchmove', moveTouch);
sliderContainer.addEventListener('touchend', endTouch);
sliderContainer.addEventListener('mouseup', endTouch);
window.addEventListener('resize', init);

//запуск инициализации
init();