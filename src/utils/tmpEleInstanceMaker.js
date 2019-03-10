import { TMP_PATH } from '../common/constants';
import generateId from './generateId';

const style = 'display: none;position: absolute;top: 10000px;left:10000px;z-index: -10000';


const TMP_NAME = 'tmp-';
const MAX_SIZE = 100;

function createNewMnt() {
    let ele;
    ele = document.createElement('div');
    ele.id = TMP_PATH;
    ele.style.cssText = style;

    return ele;
}

class tmpEleInstance {
    static _instance;

    constructor() {
        let id = TMP_PATH;

        this.baseName = TMP_NAME;
        this._delHeap = new Set();
        this._heap = new Map();
        this._element = null;

        this._element = document.getElementById(id);
        if (!this._element) {
            this._element = createNewMnt();
            document.body.appendChild(this._element);
        }
    }

    static init() {
        tmpEleInstance.getInstance();
    }


    static getInstance() {
        if (!tmpEleInstance._instance) {
            window.tempHandle = new tmpEleInstance();
            tmpEleInstance._instance = window.tempHandle;
        }


        return tmpEleInstance._instance;
    }

    append(ele) {
        let id; let node; let instance;

        if (!ele) {
            return;
        }

        id = ele.id;
        node = document.getElementById(id);
        instance = tmpEleInstance.getInstance();

        if (this._delHeap.has(id)) {
            if (node) {
                instance._element.replaceChild(ele, node);
                this.updateHeap(id);
            }

            this._delHeap.delete(id);
        } else {
            instance._element.appendChild(ele);
            this.updateHeap(id);
        }

        this.clean();
    }

    updateHeap(id) {
        let time;

        time = Date.now();
        this._heap.set(id, time);
    }

    create(eleName, ops = {}) {
        let ele; let retId;

        retId = generateId(this.baseName);

        ele = document.createElement(eleName);
        if (!ele) {
            return null;
        }

        for (let key of Object.keys(ops)) {
            if (key === 'id') continue;
            ele.key = ops.key;
        }

        ele.id = retId;

        this.append(ele);
        return document.getElementById(retId);
    }

    removeElement(id) {
        const node = document.getElementById(id);
        if (node) {
            this._delHeap.add(id);
            this._heap.delete(id);
        }

        this.clean();
    }

    clean() {
        if (this._heap.size < MAX_SIZE / 2) return;

        let els = []; let el; let newMnt;


        for (let key of this._heap.keys()) {
            el = document.getElementById(key);
            if (el) {
                els.push(el);
            }
        }

        this._delHeap.clear();

        newMnt = this.createNewMnt();

        for (let i = 0; i < els.length; i++) {
            newMnt.appendChild(els[i]);
        }

        this._element.parentNode.replaceChild(newMnt, this._element);
        this._element = document.getElementById(newMnt.id);
    }
}

export default tmpEleInstance;
