import $ from 'jquery';
import Bot from './Bot.js';

class Pacman extends Bot {
    constructor(attrs) {
        super(attrs);
        // Change tile. Set direction.
        this.on('sprite:tile', (e, t) => {
            if (this.ghostFrightened) this._speed = this.frightenedSpeed;
            else this._speed = this.speed;

            if (t.item) {
                if (t.hasPill()) { // Pill!
                    this.trigger('sprite:pill', t);
                    this.ghostFrightened = true;
                }
                else if (t.hasDot()) { // Dot!
                    this.trigger('sprite:dot', t);
                    if (this.ghostFrightened) this._speed = this.frightenedDotSpeed;
                    else this._speed = this.dotSpeed;
                }
                t.item.destroy();
                delete t.item;
            }

        });

        this.on('sprite:eaten', (e, ghost) => {
            this._eatenTurns = 9;
            this.dir = 'r';
            this.$el.pauseAnimation();
        });
    }

    reset() {
        Bot.prototype.reset.apply(this);
        this._lastEatenTurnsTime = null;
    }

    move() {
        if (!this._eatenTurns) Bot.prototype.move.apply(this, arguments);
        else if (!this._eatenTurnsFrames) {
            if (this._eatenTurns === 9) this.trigger('sprite:die');
            if (this._eatenTurns > 2) {
                var directions = {'d' : 'l', 'l' : 'u', 'u' : 'r', 'r' : 'd'};
                this.dir = directions[this.dir];
                this._setAnimation();
                this.render();
                this._eatenTurnsFrames = 5;
            } else this._eatenTurnsFrames = 25;

            this._eatenTurns--;

            if (this._eatenTurns === 0) this.trigger('sprite:life');

        } else this._eatenTurnsFrames--;
    }

};

Object.assign(Pacman.prototype, {
    animationBase : {
        imageURL : 'img/bots.png',
        numberOfFrame : 4,
        delta : 64,
        rate : 60,
        offsety : 60,
        type : $.gQ.ANIMATION_HORIZONTAL
    },

    animations : {
        right : {},

        down : {
            offsetx : 64 * 4
        },

        up : {
            offsetx : 64 * 8
        },

        left : {
            offsetx : 64 * 12
        }
    },

    dir : 'l',

    defaultAnimation : 'left'
});

export default Pacman;
