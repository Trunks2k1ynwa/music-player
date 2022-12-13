/**
 * 1. Render song
 * 2. Scroll top
 * 3. Play / pause/seel
 * 4. cd rotate
 * 5. Next / previous
 * 6. Random
 * 7. Next / repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playslist = $('.playlist')
const cd = $('.cd');
const cdWidth = cd.offsetWidth
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const btnRandom = $('.btn-random')
const btnRepeat = $('.btn-repeat')
const app = {
    currentIndex : 0,
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
    songs :[
        {
            name : 'Stay with name',
            singer : '(CHANYEOL, PUNCH) - Stay With Me',
            path: './file/Music/Goblin Stay with me.mp3'  ,
            image: './file/Img/stay with me.jpg'
        },
        {
            name : 'Me You',
            singer : '(San E) _ Me You',
            path: './file/Music/Me You.mp3'  ,
            image: './file/Img/me you.jpg'
        },
        {
            name : 'Eight',
            singer : 'IU - Eight',
            path: './file/Music/eight.mp3'  ,
            image: './file/Img/eight.jpg'
        },
        {
            name : 'Hai mươi hai',
            singer : 'Amee - Hai mươi hai',
            path: './file/Music/22.mp3'  ,
            image: './file/Img/22.png'
        },
        {
            name : 'Spring day',
            singer : 'BTS - Spring day',
            path: './file/Music/ngày xuân.mp3'  ,
            image: './file/Img/ngày xuân.jpg'
        },
        {
            name : 'Our Beloved Summer ',
            singer : 'Our Beloved Summer OST',
            path: './file/Music/obs.mp3'  ,
            image: './file/Img/obs.jpg'
        },
    ],
    render:function(){
        const htmls = this.songs.map((song,index) =>{
            return `
            <div class="song  ${index===this.currentIndex? 'active':''}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
            </div>
            `
    })
        $('.playlist').innerHTML = htmls.join('')
    },
    definePropertie:function(){
        Object.defineProperty(this,'currentSong',{
            get:function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents:function(){
        const _this = this;

        // Xử lý CD quay và dùng
        const cdThumbAnimate = cdThumb.animate([
            {
                transform:'rotate(360deg)'
            }
        ],{
            duration:3000,
            iterations:Infinity
        })
        cdThumbAnimate.pause()
        // Xử lý phóng to thu nhỏ CD
        document.onscroll = function(){
            const scrollTop = window.scrollY;
            const newCDwidth = cdWidth - scrollTop;
            cd.style.width = newCDwidth > 0 ?newCDwidth + 'px' : 0
            cd.style.opacity = newCDwidth/cdWidth
        }
        // Xử xý khi click play
        playBtn.onclick  = function(){
           _this.isPlaying ? audio.pause():audio.play()

        }// Khi song được playing
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // Khi song bị pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        // Xử lý khi tua song
        progress.onchange = function(e){
            audio.currentTime= (audio.duration / 100* e.target.value)
        }
        // Xử lý khi next song
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render();
        }
        // Xử lý khi previous song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
        }
        // Xử lý bật tắt random song
        btnRandom.onclick = function(){
            _this.isRandom = !_this.isRandom
            btnRandom.classList.toggle('active',_this.isRandom)
        }
        // Xử lý next khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        }
        // Xử lý phát lại 1 song 
        btnRepeat.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            btnRepeat.classList.toggle('active',_this.isRepeat);
        }
    },
    loadCurrenSong : function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex > this.songs.length-1){
            this.currentIndex = 0;
        }
        this.loadCurrenSong()
    },
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0 ){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrenSong()
    },
    randomSong: function(){
        var newIndex;
        const numberSong = this.songs.length-1;
        do{

            newIndex = Math.floor(Math.random() *numberSong );
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrenSong()
    },
    repeatSong: function(){
        const oleIndex = this.currentIndex;

        this.loadCurrenSong();
    },
        start : function(){
        // Định nghĩa các thuộc tính cho object
        this.definePropertie()
        // Lắng nghe và xử lý các sự kiện
        this.handleEvents()
        // Tải thông tin bài hát đầu tiên vào UI
        this.loadCurrenSong()
        // Render playlist
        this.render()
    },
}
app.start();