const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const play = $(".btn-toggle-play");
const progress = $(".progress");
const playicon = $(".player");
const nextbtn = $(".btn-next");
const prevbtn = $(".btn-prev");
const randombtn = $(".btn-random");
const repeatbtn = $(".btn-repeat");
const playlist = $(".playlist");
const App = {
    currentIndex: 0,
    isplaying: false,
    israndom: false,
    isrepeating: false,
    songs: [
        {
            name: "Dior",
            artist: "Pop Smokes",
            path: "./assets/music/dior.mp3",
            image: "./assets/img/dior.jpg",
        },
        {
            name: "Ngõ chạm",
            artist: "Bigdaddy & Emily",
            path: "./assets/music/ngocham.mp3",
            image: "./assets/img/ngocham.jpg",
        },
        {
            name: "PHATCOMCHO",
            artist: "Gill",
            path: "./assets/music/phatcomcho.mp3",
            image: "./assets/img/gill.jpg",
        },
        {
            name: "Phong",
            artist: "VsTra",
            path: "./assets/music/phong.mp3",
            image: "./assets/img/phong.jpg",
        },
        {
            name: "Rap cho anh em",
            artist: "Ocean Mob",
            path: "./assets/music/rapchoanhem.mp3",
            image: "./assets/img/rapchoanhemjpg.jpg",
        },
        {
            name: "Vinflow",
            artist: "Wxrdie",
            path: "./assets/music/vinflow.mp3",
            image: "./assets/img/vinflow.jpg",
        },
        {
            name: "Tình wa ak",
            artist: "2pillz & GreyD",
            path: "./assets/music/tinhwaakk.mp3",
            image: "./assets/img/tinhwaak.jpg",
        },
        {
            name: "Follow me",
            artist: "Richie D. ICY x Gill x Blacka",
            path: "./assets/music/richi.mp3",
            image: "./assets/img/richi.jpg",
        },
        {
            name: "Lại mất thời gian",
            artist: "Hazel",
            path: "./assets/music/hazel.mp3",
            image: "./assets/img/hazel.jpg",
        },
    ],
    render: function () {
        const html = this.songs.map(function (song, index) {
            return `
            <div class="song ${
                index === App.currentIndex ? "active" : " "
            }"  data-index=${index}>
        <div class="thumb" style="background-image: url('${song.image}')">
        </div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.artist}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
            `;
        });
        playlist.innerHTML = html.join("");
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },
    handleEvent: function () {
        var cdwidth = $(".cd").offsetWidth;

        // làm đĩa quay
        const cdroll = cdThumb.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000,
            iterations: Infinity,
        });
        cdroll.pause();

        // xử lý khi phóng to / thu nhỏ
        document.onscroll = function () {
            const scroll = window.scrollY || document.documentElement.scrollTop;
            const newcdwidth = cdwidth - scroll;
            $(".cd").style.width = newcdwidth > 0 ? newcdwidth + "px" : 0;
            $(".cd").style.opacity = newcdwidth / 200;
        };

        // xử lý khi play nhạc
        play.onclick = function () {
            if (App.isplaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };
        // khi song play
        audio.onplay = function () {
            App.isplaying = true;
            playicon.classList.add("playing");
            cdroll.play();
        };
        // khi song pause
        audio.onpause = function () {
            App.isplaying = false;
            playicon.classList.remove("playing");
            cdroll.pause();
        };
        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const currenprogresspercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = currenprogresspercent;
            }
        };

        // khi tua bài hát
        progress.onchange = function (e) {
            const seektime = (e.target.value * audio.duration) / 100;
            audio.currentTime = seektime;
        };
        // khi next bài hát
        nextbtn.onclick = function () {
            if (App.israndom) {
                App.randomSong();
            } else {
                App.nextSong();
            }
            audio.play();
            App.render();
            App.scrolltoactivesong();
        };
        // khi pre bài hát
        prevbtn.onclick = function () {
            if (App.israndom) {
                App.randomSong();
            } else {
                App.preSong();
            }
            audio.play();
            App.render();
            App.scrolltoactivesong();
        };

        // khi random bài hát
        randombtn.onclick = function () {
            App.israndom = !App.israndom;
            randombtn.classList.toggle("active", App.israndom);
        };

        // khi lặp lại bài hát
        repeatbtn.onclick = function () {
            App.isrepeating = !App.isrepeating;
            repeatbtn.classList.toggle("active", App.isrepeating);
        };

        // xử lý khi audio ended
        audio.onended = function () {
            if (App.isrepeating) {
                audio.play();
            } else {
                nextbtn.onclick();
            }
        };

        // xử lý khi click vào song
        playlist.onclick = function (e) {
            const nodeSong = e.target.closest(".song:not(.active)");

            if (nodeSong || e.target.closest(".option")) {
                //khi click vào song
                if (nodeSong && !e.target.closest(".option")) {
                    App.currentIndex = Number(nodeSong.dataset.index);
                    App.loadCurrentsong();
                    audio.play();
                    App.render();
                    App.scrolltoactivesong();
                }
            }
        };
    },
    loadCurrentsong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentsong();
    },
    preSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length;
        }
        this.loadCurrentsong();
    },
    randomSong: function () {
        let newindex;
        do newindex = Math.floor(Math.random() * this.songs.length);
        while (newindex === this.currentIndex);
        this.currentIndex = newindex;
        this.loadCurrentsong();
    },

    scrolltoactivesong: function () {
        setTimeout(function () {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 200);
    },
    start: function () {
        // định nghĩa thuộc tính cho obj
        this.defineProperties();

        //lắng nghe /xử lý các thao tác sự kiện
        this.handleEvent();

        //tải thông tin  bài hát đầu tiên khi chạy
        this.loadCurrentsong();
        //render playlists
        this.render();
    },
};
App.start();
