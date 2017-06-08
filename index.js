// Author: Jonathan Revell H
import throttle from "lodash/throttle";

export class Inchworm {
    constructor( target, events ) {
        this.events = events;
        this.rebuildIndexes();


        this.scrollEv = throttle(() => {
                this.onScroll();
            }, 100);

        this.target = this.getElement( target );
    }

    destroy() {
        this.stop();
        this.events = [];
        this.scrollEv = null;
        this.target = null;
    }

    getElement( val ) {
        if(typeof val == "string") {
            let el = document.querySelector(val);
            if(el) {
                val = el;
            }
        }
        

        if(val == window || val instanceof Element) {
            return val;
        } else {
            return null;
        }
    }

    onScroll() {
        var scrollX = this.target.scrollX,
            scrollY = this.target.scrollY;
        
        var matches = [];
        var unmatches = [];
        
        var resultXMin = this.checkIndex("x", "min", scrollX);
        var resultXMax = this.checkIndex("x", "max", scrollX);

    }

    checkIndex( axis, inequality, val ) {
        var index = this.indexes[axis][inequality];
        var matches = [];
        var unmatches = [];

        // Iterate through each value in the index to check
        // What has been triggered
        for(let i = 0, len = index.length; i < len; i++ ) {
            let idxVal = index[0][i];
            if(inequality == "min" && val > idxVal ) {
                matches.push(index[1][i]);
            } else if(inequality == "max" && val < idxVal) {
                matches.push(index[1][i]);
            } else {
                unmatches.push(index[1][i]);
            }
        }

        return {
            matches,
            unmatches
        };
    }

    addEvent( ev ) {

        if(!ev.axis) {
            ev.axis = "y";
        }
        if(!ev.eventTarget) {
            ev.eventTarget = this.target;
        }
        if(ev.isActive === undefined) {
            ev.isActive = false;
        }

        this.events.push(ev);
    }

    rebuildIndexes() {
        // The indexes are divided up by axis and by inequality type
        // Each index is a synchronized set of two arrays. The first array
        // is an array of integer triggers, and the second is an array 
        // of object references
        this.indexes = {
            x: { min: [[],[]], max: [[],[]] },
            y: { min: [[],[]], max: [[],[]] }
        };
        for(let i = 0, len = this.events.length; i < len; i++) {
            let ev = this.events[i];
            this.addEvent( ev );
        }
    }

    addEventToIndex( ev ) {
        var ineq = (ev.min === undefined) ? "max" : "min";
        this.indexes[ev.axis][ineq][0].push( parseInt(ev.ineq) );
        this.indexes[ev.axis][ineq][1].push( ev );
    }

    start() {
        this.target.removeEventListener("scroll", this.scrollEv);
        this.target.addEventListener("scroll", this.scrollEv);
    }

    stop() {
        this.target.removeEventListener("scroll", this.scrollEv);
    }
}


var inchworm = new Inchworm(window, [
    { axis: "x", min: "200", eventTarget: "#banner", class: "compact" }
]);