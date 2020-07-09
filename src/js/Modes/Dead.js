import $ from 'jquery';
import Bot from '../Bot';
import Mode from './Mode';

class Dead extends Mode {
    constructor(ghost) {
        super(ghost);

        this._target = this.ghost.map.house.getR().getU();

        this._endX = this.ghost.defaults.x;
        this._endY = this.ghost.map.houseCenter.y;

        this._end = this.ghost.map.getTile(this._endX, this._endY, true);
    }

    onEnter() {
        this._prepareEnter = false;
        this.ghost.animation =  this.ghost.animations['score_' + this.ghost.score];
        this.ghost.render();
    }

    move() {
        var t = this.ghost.getTile();

        if (!this._prepareEnter && this.ghost.getTile() === this._target) {
            this._prepareEnter = true;
        }

        if (this.exit()) {

            this.onExit();

        } else if (this._prepareEnter) {
            var endX = this._endX;
            var endY = this._endY;
            // Should go to center first
            if (this.ghost.y < endY) endX = this._target.x - this.ghost.map.tw / 2;
            // Set direction
            if (this.ghost.x < endX) this.ghost.dir = 'r';
            else if (this.ghost.x > endX) this.ghost.dir = 'l';
            else if (this.ghost.y < endY) this.ghost.dir = 'd';
            // Move
            if (this.ghost.dir === 'd')
                this.ghost.y += this.ghost.getMin(this.ghost.getStep(), endY - this.ghost.y);
            if (this.ghost.dir === 'r')
                this.ghost.x += this.ghost.getMin(this.ghost.getStep(), endX - this.ghost.x);
            if (this.ghost.dir === 'l')
                this.ghost.x -= this.ghost.getMin(this.ghost.getStep(), this.ghost.x - endX);

            this.setAnimation();

            this.ghost.render();

        } else {

            Bot.prototype.move.call(this.ghost, this.ghost._dir);

        }
    }

    setAnimation() {
        if (this.ghost.dir === 'u') {
            this.ghost.animation = this.ghost.animations.deadUp;
        }
        if (this.ghost.dir === 'r') {
            this.ghost.animation = this.ghost.animations.deadRight;
        }
        if (this.ghost.dir === 'd') {
            this.ghost.animation = this.ghost.animations.deadDown;
        }
        if (this.ghost.dir === 'l') {
            this.ghost.animation = this.ghost.animations.deadLeft;
        }
    }

    _getTarget() {
        return this._target;
    }

    canGo(dir, t) {
        if (!t) t = this.ghost.getTile();

        var nt = t.get(dir);

        return !nt || !nt.isWall();
    }

    exit() {
        return this.ghost.getTile() === this._end;
    }

    onExit() {
        var attrs = this.ghost.id === 'bot-blinky' ? {x : this.ghost.x, y : this.ghost.y} : {};
        this.ghost.reset(attrs);
    }
}

export default Dead;
