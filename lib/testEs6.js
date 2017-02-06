/**
 * Created by Liyang on 2016/12/30.
 */
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _marked = [yiedfn].map(regeneratorRuntime.mark);

{
    var _a = 1;
}

function yiedfn() {
    var a, b, _ref;

    return regeneratorRuntime.wrap(function yiedfn$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    a = 0, b = 1;

                case 1:
                    if (!true) {
                        _context.next = 9;
                        break;
                    }

                    _context.next = 4;
                    return a;

                case 4:
                    _ref = [b, a + b];
                    a = _ref[0];
                    b = _ref[1];
                    _context.next = 1;
                    break;

                case 9:
                case 'end':
                    return _context.stop();
            }
        }
    }, _marked[0], this);
}

var _yiedfn = yiedfn(),
    _yiedfn2 = _slicedToArray(_yiedfn, 5),
    a = _yiedfn2[0],
    x = _yiedfn2[1],
    c = _yiedfn2[2],
    v = _yiedfn2[3],
    b = _yiedfn2[4];

var map = new Map();
map.set('name', 'liyang');
map.set('age', '25');
console.log(map);

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
    for (var _iterator = map[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _step$value = _slicedToArray(_step.value, 2),
            key = _step$value[0],
            value = _step$value[1];

        console.log('the key is ' + key);
        console.log('the value is ' + value);
    }
} catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
} finally {
    try {
        if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
        }
    } finally {
        if (_didIteratorError) {
            throw _iteratorError;
        }
    }
}

var str = 'abckdse';
'x'.padStart(5, 's');
console.log(str.startsWith('a'));
console.log(str.endsWith('e'));
console.log(str.includes('k'));