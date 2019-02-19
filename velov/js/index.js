var Slider = {

    sliderItems: document.querySelectorAll(".item_slider"),
    arrowLeft: document.querySelector(".button_left"),
    arrowRight: document.querySelector(".button_right"),
    index: 0,

    init: function () {
        this.startSlide();
        this.nextItem();
        this.prevItem();
        this.slideKey();

    },

    reset: function () {
        for (var i = 0; i < Slider.sliderItems.length; i++) {
            this.sliderItems[i].style.display = "none";
        }
    },

    startSlide: function () {
        this.reset();
        this.sliderItems[0].style.display = "block";
    },

    slideRight: function () {
        Slider.reset();
        Slider.sliderItems[Slider.index + 1].style.display = "block";
        Slider.index++;

    },

    nextItem: function () {
        this.arrowRight.addEventListener("click", function () {
            if (Slider.index === Slider.sliderItems.length - 1) {
                Slider.index = -1;
            }
            Slider.slideRight();
        });
    },

    slideLeft: function () {
        Slider.reset();
        Slider.sliderItems[Slider.index - 1].style.display = "block";
        Slider.index--;

    },

    prevItem: function () {
        this.arrowLeft.addEventListener("click", function () {
            if (Slider.index === 0) {
                Slider.index = Slider.sliderItems.length;
            }
            Slider.slideLeft();
        });
    },

    slideKey: function () {
        document.addEventListener("keydown", function (e) {

            if (e.keyCode === 39) {
                if (Slider.index === Slider.sliderItems.length - 1) {
                    Slider.index = -1;
                }
                Slider.slideRight();


            } else if (e.keyCode === 37) {
                if (Slider.index === 0) {
                    Slider.index = Slider.sliderItems.length;
                }
                Slider.slideLeft();

            }
        });
    }
}

Slider.init();
