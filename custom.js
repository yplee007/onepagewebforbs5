document.querySelector("#headingOne button").addEventListener("click", function () {
    document.querySelector("#foodImg1").src = "./imgs/food1.jpg"
})

document.querySelector("#headingTwo button").addEventListener("click", function () {
    document.querySelector("#foodImg1").src = "./imgs/food2.jpg"
})

document.querySelector("#headingThree button").addEventListener("click", function () {
    document.querySelector("#foodImg1").src = "./imgs/food3.jpg"
})
// ------------------------------------------------------------------------

// scroll to id  => idea by https://gist.github.com/andjosh/6764939
// document.querySelectorAll("#lokiMenu a,footer a").forEach(e => {
//     e.onclick = function (event) {
//         event.preventDefault();
//         const targetID = e.getAttribute("href");

//         scrollToId(document.querySelector(targetID).offsetTop - offset + 1, 1500);
//     };
// });

window.onload = function () {
    // 先計算出navbar的高度。offsetHeight (elment 含border的上下高度差)
    let offset = document.querySelector('#lokiMenu').offsetHeight;

    // 每個section的 top / bottom 算出來，存入sections物件 {sid1:{top:xx; bottom:yy}, sid2:{...}...}
    let sections = {};
    document.querySelectorAll('section').forEach(e => {
        sections[e.id] = {
            top: e.offsetTop,
            bottom: e.offsetTop + e.offsetHeight
        };
    });
    console.log(sections);

    let scrollSpy = () => {
        // scrollTop 是元素頂端和能被看見的最頂端之間的距離. 當元素並未產生滾動條, 那麼 scrollTop 的值預設為 0
        topY = document.scrollingElement.scrollTop;
        // 考慮navbar，故加入navbard 高度的offset。故為多考慮了navbar後。scroll高度要向下移一個offset。
        viewTop = topY + offset;
        for (const key in sections) {
            if (sections[key].top <= viewTop && viewTop <= sections[key].bottom) {

                //如果存在持有.active但不是持有href=key的人，取消他的active
                let turnOff = document.querySelector(`#lokiMenu a.active:not([href="#${key}"])`);
                if (turnOff) turnOff.classList.remove('active');
                let turnOn = document.querySelector(`#lokiMenu a[href="#${key}"]:not(.active)`);
                if (turnOn) turnOn.classList.add('active'); //如果存在未持有.active但持有href=key的人，增加他的active
            }
        };
    };

    let indexShown = () => {
        const
            viewWidth = document.scrollingElement.offsetWidth,
            indexBottom = document.querySelector('#lokiSlider').offsetHeight,
            targetMenu = document.querySelector('#lokiMenu'),
            targetArrow = document.querySelector('#lokiArrow'),
            startY = document.scrollingElement.scrollTop; // 新語法可跨平台

        if (viewWidth >= 992) { //屬於大螢幕時才會做判斷
            if (startY < indexBottom - offset) { //於slider內
                targetMenu.classList.remove('bg-dark');
                targetArrow.classList.remove('shown');
            } else {
                targetMenu.classList.add('bg-dark');
                targetArrow.classList.add('shown');
            }
        } else targetMenu.classList.add('bg-dark');
    }


    window.onscroll = () => {
        scrollSpy();
        indexShown();
    }

    window.onresize = () => { //當有人對window重新調整尺寸時
        indexShown();
    }

};

const offset = document.querySelector('#lokiMenu').offsetHeight;

// scroll to id  => idea by https://gist.github.com/andjosh/6764939
document.querySelectorAll("#lokiMenu a,footer a").forEach(e => {
    e.onclick = function (event) {
        event.preventDefault();
        const targetID = e.getAttribute("href");

        scrollToId(document.querySelector(targetID).offsetTop - offset + 1, 1500);
    };
});

function scrollToId(toY, duration) {
    const
        startNode = document.scrollingElement, // 新語法可跨平台
        startY = startNode.scrollTop,
        changeY = toY - startNode.scrollTop,
        startTime = +new Date();

    Math.easeInOutQuad = function (t, b, c, d) {
        // t = current time
        // b = start value
        // c = change in value
        // d = duration
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };

    let animateScroll = function () {
        console.log(1);
        const currentTime = +new Date() - startTime;
        let val = Math.easeInOutQuad(currentTime, startY, changeY, duration);
        startNode.scrollTop = val;
        if (currentTime < duration) requestAnimationFrame(animateScroll); //frame pre 60/s
    };
    animateScroll();
}