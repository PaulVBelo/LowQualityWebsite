// Уведомление через n секунд (reminder).
const popupReminderElement = document.querySelector(".popup__reminder");
const popupReminderContainer = popupReminderElement.querySelector(".popup__container_reminder");
const popupReminderCloseButton = popupReminderElement.querySelector(".popup__close-button");
const timeBeforeShow = 1000 * 30;

const popupReminderOpen = function() {
    popupReminderElement.classList.add("popup_opened");
    popupReminderContainer.classList.add("popup__container_opened");
    localStorage.setItem("is-reminder-opened", "true");
    blockScrolling();
}

const popupReminderClose = function() {
    popupReminderElement.classList.remove("popup_opened");
    popupReminderContainer.classList.remove("popup__container_opened");
    localStorage.setItem("is-reminder-opened", "false");
    unlockScrolling()
}

const popupReminderOpenFirst = function () {
    const isReminderOpened = localStorage.getItem("is-reminder-opened");
    if (isReminderOpened === "true") {
        popupReminderOpen();
    } else {
        setTimeout(popupReminderOpen, timeBeforeShow);
    }
}
popupReminderOpenFirst();

popupReminderCloseButton.addEventListener("click", function(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    localStorage.setItem("is-reminder-opened", "false");
    popupReminderClose();
    setTimeout(function() {popupReminderOpen();}, timeBeforeShow);
})

popupReminderContainer.addEventListener("click", function(evt) {
    evt.stopPropagation();
    setTimeout(function() {popupReminderOpen();}, timeBeforeShow);
});

popupReminderElement.addEventListener("click", function(evt) {
    localStorage.setItem("is-reminder-opened", "false");
    popupReminderClose();
    evt.stopPropagation();
    setTimeout(function() {popupReminderOpen();}, timeBeforeShow);
})

setTimeout(function() {popupReminderOpen();}, timeBeforeShow);

// Форма с методом Post (form)
const contactForm = document.querySelector('.popup__form');
const formContainer = contactForm.querySelector('.popup__container_form')
const formCloseButton = formContainer.querySelector('.popup__close-button')
const formButton = document.getElementById('formButton');
const popupForm = document.querySelector('.popup__form');
const formContact = document.getElementById('contactForm');
const submitButton = contactForm.querySelector('.popup__send');

const popupFromClose = function() {
    popupForm.classList.remove('popup_opened');
    formContainer.classList.remove('popup__container_opened');
    const submitButton = contactForm.querySelector('.popup__send');
    submitButton.textContent = 'Submit';
    submitButton.style.backgroundColor = '#cc0256';
    submitButton.style.cursor = 'pointer';
    submitButton.disabled = false; 
    unlockScrolling();
}

formCloseButton.addEventListener("click", function(evt) {
    popupFromClose();
})

formButton.addEventListener('click', function(evt) {
    evt.preventDefault();
    popupForm.classList.add('popup_opened');
    formContainer.classList.add('popup__container_opened')
    blockScrolling();
});

contactForm.addEventListener('submit', async function(evt) {
    evt.preventDefault();
    const formData = new FormData(formContact);

    const phone = formData.get('phone');
    const email = formData.get('email');
    const request = formData.get('request');

    if (!notEmpty(phone)) {
        alert('Fill in phone number!');
        return;
    }
    if (!IsOnlyNumInPhone(phone)) {
        alert('Use only numbers in phone!');
        return;
    }
    if (!IsTen(phone)) {
        alert('Need 10 numbers in phone!');
        return;
    }

    if (!notEmpty(email)) {
        alert('Fill in email!');
        return;
    }
    if(!validateEmail(email)) {
        alert('Invalid input for email');
        return;
    }

    if (!notEmpty(request)) {
        alert('Please leave a request Message!');
        return;
    }
    if (!validateText(request)) {
        alert('Leave a message, only using english letters.');
        return;
    }

    submitButton.textContent = 'Sending...';
    submitButton.style.backgroundColor = '#FF006A';
    submitButton.style.cursor = 'wait';
    submitButton.disabled = true;

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(Object.fromEntries(formData.entries()))
        });

        if (response.ok) {
            submitButton.textContent = 'Form sent';
            submitButton.style.backgroundColor = '#B0758D';
            submitButton.style.cursor = 'default';
            submitButton.disabled = true;
            formContact.reset();
            setTimeout(() => {
                popupFromClose();
            }, 3000);
        } else {
            throw new Error('Failed to submit form.');
        }
    } catch (error) {
        console.error(error);
        alert('Failed to submit form. Please try again later.');
        submitButton.textContent = 'Submit';
        submitButton.style.backgroundColor = '';
        submitButton.style.cursor = '';
        submitButton.disabled = false;
    }
})

function notEmpty(field) {
    return field.length > 0;
}

function IsOnlyNumInPhone(phone) {
    const phoneRegex = /^\d+$/;
    return phoneRegex.test(phone);
}

function IsTen(phone) {
    const phoneRegex = /^.{10}$/;
    return phoneRegex.test(phone);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateText(text) {
    const textRegex = /^[a-zA-Z\s]+$/;
    return textRegex.test(text);
}

// Прилипание меню.
window.addEventListener('scroll', function() {
    const header = document.querySelector(".header");
    const firstScreenHeight = window.innerHeight;
    
    if (window.scrollY < firstScreenHeight) {
        header.classList.add('disabled');
        header.classList.remove('active');
        document.body.style.paddingTop = '0';
    } else {
        header.classList.remove('disabled');
        header.classList.add('active');
        document.body.style.paddingTop = '130px';
    }
});

// Таймер
function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
        'total': Math.max(t, 0),
        'days': Math.max(days, 0),
        'hours': Math.max(hours, 0),
        'minutes': Math.max(minutes, 0),
        'seconds': Math.max(seconds, 0)
    };
  }
   
  function initializeClock(id, endtime) {
    var clock = document.getElementById(id);
    var daysSpan = clock.querySelector('.days');
    var hoursSpan = clock.querySelector('.hours');
    var minutesSpan = clock.querySelector('.minutes');
    var secondsSpan = clock.querySelector('.seconds');
   
    function updateClock() {
      var t = getTimeRemaining(endtime);
   
      daysSpan.innerHTML = t.days;
      hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
      minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
      secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
   
      if (t.total <= 0) {
        clearInterval(timeinterval);
      }
    }
   
    updateClock();
    var timeinterval = setInterval(updateClock, 1000);
}
   
var deadline = 'June 20 2027 00:00:00';
initializeClock('countdown', deadline);

// Галерея фотографий (мемов)
const popupGallery = document.querySelector(".popup__gallery");
const popupGalleryContainer = popupGallery.querySelector(".popup__container");
const popupGalleryImage = popupGalleryContainer.querySelector(".popup__img");

const popupGalleryCloseButton = popupGallery.querySelector(".popup__close-button");
const popupGalleryNextButton = popupGallery.querySelector(".popup__next-button");
const popupGalleryPrevButton = popupGallery.querySelector(".popup__prev-button");

const imgContainerArray = document.querySelectorAll(".meme-div");

let currentImageContainer = document.querySelector(".meme-div");
let currentImageLink = currentImageContainer.querySelector(".meme").src;

function openPopupGallery() {
    popupGallery.classList.add("popup_opened");
    popupGalleryContainer.classList.add("popup__container_opened");
    blockScrolling();
}

function closePopupGallery() {
    popupGallery.classList.remove("popup_opened");
    popupGalleryContainer.classList.remove("popup__container_opened");
    unlockScrolling();
}

function switchNext() {
    let temp = currentImageContainer.nextElementSibling;
    if (temp == null) {
        return;
    }
    currentImageContainer = temp;
    currentImageLink = currentImageContainer.querySelector(".meme").src;
}

function switchPrev() {
    let temp = currentImageContainer.previousElementSibling;
    if (temp == null) {
        return;
    }
    currentImageContainer = temp;
    currentImageLink = currentImageContainer.querySelector(".meme").src;
}

function switchNavigationButtons() {
    let temp = currentImageContainer.previousElementSibling;
    if (temp == null) {
        popupGalleryPrevButton.classList.add("popup__prev-button_disabled");
    } else {
        popupGalleryPrevButton.classList.remove("popup__prev-button_disabled");
    }
    temp = currentImageContainer.nextElementSibling;
    if (temp == null) {
        popupGalleryNextButton.classList.add("popup__next-button_disabled");
    } else {
        popupGalleryNextButton.classList.remove("popup__next-button_disabled");
    }
}

function setImage() {
    popupGalleryImage.src = currentImageLink;
}

imgContainerArray.forEach(function (item) {
    item.addEventListener("click", function () {
        currentImageContainer = item;
        currentImageLink = item.querySelector(".meme").src;
        setImage();
        openPopupGallery();
        switchNavigationButtons();
    });
});

popupGalleryNextButton.addEventListener("click", function (evt) {
    switchNext();
    setImage();
    switchNavigationButtons();
    evt.stopPropagation();
});

popupGalleryPrevButton.addEventListener("click", function (evt) {
    switchPrev();
    setImage();
    switchNavigationButtons();
    evt.stopPropagation();
});

popupGalleryCloseButton.addEventListener("click", function (evt) {
    closePopupGallery();
    evt.stopPropagation();
});

popupGallery.addEventListener("click", function (evt) {
    closePopupGallery();
    evt.stopPropagation();
});

// Треугольники
const svg = document.getElementById('triangles');
let middle = 1;
let side = 0;
  
svg.onclick = (e) => {
    const colors = ['#FFFFFF', '#F2DEE6', '#E7BACC', '#D898B2', 
    '#C7668E', '#C14276', '#CF2A6E', '#EA0F69', '#FF2B82', '#FE5D9F',
    '#F77CAE', '#EBA2C0', '#F3CBDB'];
    const next = (a) => colors[(a+1)%colors.length];
    document.documentElement.style.cssText = `
    --side-color: ${next(side)};
    --middle-color: ${next(middle)}; 
    `
    side=(side+1)%colors.length;
    middle=(middle+1)%colors.length;
}

// Block scroll
function unlockScrolling() {
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.overflow = 'auto';
    document.body.style.marginRight = '0px';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
}

function blockScrolling() {
    document.body.style.position = 'absolute';
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.overflow = 'hidden';
    document.body.style.marginRight = '15px';
}